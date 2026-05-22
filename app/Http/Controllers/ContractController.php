<?php

namespace App\Http\Controllers;

use App\Models\Bloc;
use App\Models\Client;
use App\Models\Company;
use App\Models\Contract;
use App\Models\Project;
use App\Models\Tranche;
use App\Services\ContractPdfService;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Http\Requests\StoreContractRequest;

class ContractController extends Controller
{
    public function index(Request $request, Bloc $bloc)
    {
        $query = Contract::with(['client', 'property.bloc.tranche.project.company'])
            ->whereHas('property', function ($q) use ($bloc) {
                $q->where('bloc_id', $bloc->id);
            });

        $contracts = $query->latest()->paginate(10);

        return Inertia::render('Contracts/Index', [
            'contracts' => $contracts,
            'companies' => Company::all(),
            'clients' => Client::all(),
            'bloc' => $bloc->load('tranche.project.company'),
        ]);
    }

    public function create(Bloc $bloc)
    {
        return Inertia::render('Contracts/Create', [
            'companies' => Company::all(),
            'clients' => Client::all(),
            'bloc' => $bloc->load('tranche.project.company'),
        ]);
    }

    public function store(StoreContractRequest $request, Bloc $bloc)
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated, $request, $bloc) {
            // 1. Check or create the Client record
            if (empty($validated['client_id'])) {
                $client = Client::create([
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'email' => $validated['email'] ?? null,
                    'phone' => $validated['phone'],
                    'id_number' => $validated['id_number'] ?? null,
                ]);
                $clientId = $client->id;
            } else {
                $clientId = $validated['client_id'];
            }

            // Target Property Unit matching incoming property ID
            $property = \App\Models\Property::findOrFail($validated['property_id']);
            
            // Verify status
            if (!in_array(strtolower($property->status), ['disponible', 'available'])) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'property_id' => 'This property is not available.',
                ]);
            }

            // 3. Create the Contract record
            $contract = Contract::create([
                'client_id' => $clientId,
                'property_id' => $property->id,
                'contract_number' => $validated['contract_number'],
                'price' => $validated['price'],
                'advance' => $validated['advance'] ?? null,
                'payment_duration' => $validated['paymentDuration'] ?? null,
                'payment_frequency' => $validated['paymentFrequency'] ?? null,
                'date' => $validated['date'] ?? now(),
                'status' => 'active',
            ]);

            // 2. Handle file upload for the modification image
            if (!empty($validated['modification'])) {
                $imagePath = null;
                if ($request->hasFile('modification.image')) {
                    $imagePath = $request->file('modification.image')->store('modifications', 'public');
                }
                
                if (!empty($validated['modification']['notes']) || $imagePath) {
                    $contract->modification()->create([
                        'notes' => $validated['modification']['notes'] ?? null,
                        'image_path' => $imagePath,
                    ]);
                }
            }

            // 4. Generate or save the payment timeline rows
            if ($validated['withDetails']) {
                if (!empty($validated['schedule'])) {
                    foreach ($validated['schedule'] as $payment) {
                        $contract->paymentSchedules()->create([
                            'due_date' => $payment['due_date'],
                            'amount' => $payment['amount'],
                            'observation' => $payment['observation'] ?? null,
                        ]);
                    }
                }
            } else {
                $duration = $validated['paymentDuration'] ?? 0;
                $frequency = $validated['paymentFrequency'] ?? 1;
                
                if ($duration > 0 && $frequency > 0) {
                    $totalRows = ceil($duration / $frequency);
                    $balance = $contract->price - ($contract->advance ?? 0);
                    $amountPerRow = $totalRows > 0 ? $balance / $totalRows : 0;
                    $currentDate = \Carbon\Carbon::parse($contract->date ?? now());

                    for ($i = 1; $i <= $totalRows; $i++) {
                        $contract->paymentSchedules()->create([
                            'due_date' => $currentDate->copy()->addMonths($i * $frequency),
                            'amount' => $amountPerRow,
                            'observation' => "Auto-generated payment #{$i}",
                        ]);
                    }
                }
            }

            // 5. Save commission rules if present
            if (!empty($validated['commission'])) {
                $contract->commission()->create([
                    'broker_name' => $validated['commission']['broker_name'],
                    'amount' => $validated['commission']['amount'],
                    'description' => $validated['commission']['description'] ?? null,
                    'status' => $validated['commission']['status'] ?? 'pending',
                ]);
            }

            // Update property status and price
            $property->update([
                'status' => 'Vendu',
                'price' => $contract->price,
            ]);

            return redirect()->route('blocs.contracts.show', ['bloc' => $bloc->id, 'contract' => $contract->id])
                ->with('success', 'Contract created successfully.');
        });
    }

    public function show(Bloc $bloc, Contract $contract)
    {
        $contract->load(['client', 'property.bloc.tranche.project.company']);

        // Generate breadcrumb path
        $path = '';
        if ($contract->property) {
            $property = $contract->property;
            $bloc = $property->bloc;
            $tranche = $bloc ? $bloc->tranche : null;
            $project = $tranche ? $tranche->project : null;
            $company = $project ? $project->company : null;

            $parts = [];
            if ($company) {
                $parts[] = $company->name;
            }
            if ($project) {
                $parts[] = $project->name;
            }
            if ($tranche) {
                $parts[] = $tranche->name;
            }
            if ($bloc) {
                $parts[] = $bloc->name;
            }
            $parts[] = $property->name;

            $path = implode(' > ', $parts);
        }

        return Inertia::render('Contracts/Show', [
            'contract' => $contract,
            'path' => $path,
            'bloc' => $bloc->load('tranche.project.company'),
        ]);
    }

    public function edit(Bloc $bloc, Contract $contract)
    {
        $contract->load(['property.bloc.tranche.project.company']);

        return Inertia::render('Contracts/Create', [
            'contract' => $contract,
            'companies' => Company::all(),
            'clients' => Client::all(),
            'bloc' => $bloc->load('tranche.project.company'),
        ]);
    }

    public function update(Request $request, Bloc $bloc, Contract $contract)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'property_id' => 'required|exists:properties,id',
            'status' => 'nullable|string|in:active,completed,cancelled,draft',
            'price' => 'nullable|numeric|min:0',
            'date' => 'nullable|date',
        ]);

        $contract->update($validated);

        if ($contract->status === 'active') {
            $contract->property->update(['status' => 'Reserved']);
        } elseif ($contract->status === 'cancelled') {
            $contract->property->update(['status' => 'Available']); // Assuming 'Available' is a valid status
        }

        return redirect()->route('blocs.contracts.index', $bloc->id)->with('success', 'Contract updated successfully.');
    }

    public function destroy(Bloc $bloc, Contract $contract)
    {
        $contract->delete(); // Soft delete

        return redirect()->route('blocs.contracts.index', $bloc->id)->with('success', 'Contract deleted successfully.');
    }

    public function generatePdf(Bloc $bloc, Contract $contract, ContractPdfService $pdfService)
    {
        $contract->load(['client', 'property.bloc.tranche.project.company']);

        $clauses = $pdfService->getClauses($contract);

        $pdf = Pdf::loadView('contracts.pdf', compact('contract', 'clauses'));

        $contractNumber = 'ct'.$contract->id;

        $projectName = '';
        if ($contract->property && $contract->property->bloc && $contract->property->bloc->tranche && $contract->property->bloc->tranche->project) {
            $projectName = $contract->property->bloc->tranche->project->name;
        }
        $projectName = strtolower(preg_replace('/\s+/', '', $projectName));

        $clientName = '';
        if ($contract->client) {
            $clientName = $contract->client->full_name;
        }
        $clientName = strtolower(preg_replace('/\s+/', '', $clientName));

        $date = $contract->date ? Carbon::parse($contract->date)->format('dmY') : now()->format('dmY');

        $fileName = 'contrat_'.$contractNumber.'_'.$projectName.'_'.$clientName.'_'.$date.'.pdf';

        return $pdf->download($fileName);
    }

    // API endpoints for cascading dropdowns
    public function getProjects(Company $company)
    {
        return response()->json($company->projects);
    }

    public function clientsLookup()
    {
        return response()->json(Client::select(['id', 'first_name', 'last_name', 'email', 'id_number', 'phone'])->get());
    }

    public function getTranches(Project $project)
    {
        return response()->json($project->tranches);
    }

    public function getBlocs(Tranche $tranche)
    {
        return response()->json($tranche->blocs);
    }

    public function getProperties(Bloc $bloc)
    {
        return response()->json($bloc->properties);
    }
}
