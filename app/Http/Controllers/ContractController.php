<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContractRequest;
use App\Models\Bloc;
use App\Models\Client;
use App\Models\Company;
use App\Models\Contract;
use App\Models\Project;
use App\Models\Property;
use App\Models\Tranche;
use App\Services\ContractPdfService;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

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
                $fullName = trim(($validated['first_name'] ?? '').' '.($validated['last_name'] ?? ''));
                $client = Client::create([
                    'full_name' => $fullName ?: null,
                    'email' => $validated['email'] ?? null,
                    'phone' => $validated['phone'] ?? null,
                    'identity_number' => $validated['id_number'] ?? null,
                    'address' => $validated['address'] ?? null,
                    'type' => $validated['type'] ?? 'individual',
                ]);
                $clientId = $client->id;
            } else {
                $clientId = $validated['client_id'];
            }

            // Target Property Unit matching incoming property ID
            $property = Property::findOrFail($validated['property_id']);

            // Verify status
            if (! in_array(strtolower($property->status), ['disponible', 'available'])) {
                throw ValidationException::withMessages([
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
            if (! empty($validated['modification'])) {
                $imagePath = null;
                if ($request->hasFile('modification.image')) {
                    $imagePath = $request->file('modification.image')->store('modifications', 'public');
                }

                if (! empty($validated['modification']['notes']) || $imagePath) {
                    $contract->modification()->create([
                        'notes' => $validated['modification']['notes'] ?? null,
                        'image_path' => $imagePath,
                    ]);
                }
            }

            // 4. Generate or save the payment timeline rows
            if (! empty($validated['withDetails'])) {
                if (! empty($validated['schedule'])) {
                    foreach ($validated['schedule'] as $payment) {
                        $dueDate = $payment['due_date'] ?? $payment['date'] ?? null;
                        $amount = $payment['amount'] ?? null;
                        $observation = $payment['observation'] ?? $payment['note'] ?? null;

                        if ($dueDate && $amount !== null) {
                            $contract->paymentSchedules()->create([
                                'due_date' => $dueDate,
                                'amount' => $amount,
                                'observation' => $observation,
                            ]);
                        }
                    }
                }
            } else {
                $duration = $validated['paymentDuration'] ?? 0;
                $frequency = $validated['paymentFrequency'] ?? 1;

                if ($duration > 0 && $frequency > 0) {
                    $totalRows = ceil($duration / $frequency);
                    $balance = $contract->price - ($contract->advance ?? 0);
                    $amountPerRow = $totalRows > 0 ? $balance / $totalRows : 0;
                    $currentDate = Carbon::parse($contract->date ?? now());

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
            if (! empty($validated['commission'])) {
                $commission = $validated['commission'];
                $contract->commission()->create([
                    'broker_name' => $commission['broker_name'] ?? $commission['name'] ?? null,
                    'amount' => $commission['amount'] ?? null,
                    'description' => $commission['description'] ?? null,
                    'status' => $commission['status'] ?? ($commission['status'] ?? 'pending'),
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

    /**
     * Alternate entry point for non-nested POST /contracts requests.
     * Finds the related bloc from the provided property and delegates to the
     * same transactional creation logic.
     */
    public function storeGlobal(StoreContractRequest $request)
    {
        $validated = $request->validated();

        // Resolve the property and its bloc
        $property = Property::findOrFail($validated['property_id']);
        $bloc = $property->bloc;

        if (! $bloc) {
            throw ValidationException::withMessages([
                'property_id' => 'Could not resolve the property bloc for this property.',
            ]);
        }

        // Reuse existing store logic by calling the store method with the resolved bloc
        return $this->store($request, $bloc);
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
            'client_id' => 'nullable|exists:clients,id',
            'property_id' => 'nullable|exists:properties,id',
            'contract_number' => 'nullable|string',
            'status' => 'nullable|string|in:active,completed,cancelled,draft',
            'price' => 'nullable|numeric|min:0',
            'advance' => 'nullable|numeric|min:0',
            'payment_duration' => 'nullable|integer|min:0',
            'payment_frequency' => 'nullable|integer|min:0',
            'date' => 'nullable|date',

            // Client details for inline update if needed
            'client_name' => 'nullable|string',
            'client_email' => 'nullable|email',
            'client_phone' => 'nullable|string',
        ]);

        $contract->update($validated);

        if (! empty($validated['client_name']) && $contract->client) {
            $contract->client->update([
                'full_name' => $validated['client_name'],
                'email' => $validated['client_email'] ?? $contract->client->email,
                'phone' => $validated['client_phone'] ?? $contract->client->phone,
            ]);
        }

        if ($contract->status === 'active') {
            $contract->property->update(['status' => 'Reserved']);
        } elseif ($contract->status === 'cancelled') {
            $contract->property->update(['status' => 'Available']); // Assuming 'Available' is a valid status
        }

        if ($request->header('Referer') && str_contains(strtolower($request->header('Referer')), 'client-contracts')) {
            return redirect()->route('client-contracts', ['bloc' => $bloc->id])->with('success', 'Contract updated successfully.');
        }

        return redirect()->route('blocs.contracts.index', $bloc->id)->with('success', 'Contract updated successfully.');
    }

    public function destroy(Request $request, Bloc $bloc, Contract $contract)
    {
        $contract->update(['status' => 'cancelled']); // Mark as cancelled / expired as per policy

        if ($request->header('Referer') && str_contains(strtolower($request->header('Referer')), 'client-contracts')) {
            return redirect()->route('client-contracts', ['bloc' => $bloc->id])->with('success', 'Contract deleted successfully.');
        }

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
        return response()->json(Client::select([
            'id',
            'full_name as name',
            'email',
            'identity_number as idNumber',
            'phone',
            'address',
        ])->get());
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
        return response()->json($bloc->properties()->with('propertyType')->get());
    }

    public function getNextContractNumber()
    {
        $lastContract = Contract::orderBy('id', 'desc')->first();
        $nextId = $lastContract ? $lastContract->id + 1 : 1;
        $year = date('Y');

        do {
            $number = sprintf('CT-%d-%03d', $year, $nextId);
            $exists = Contract::where('contract_number', $number)->exists();
            if ($exists) {
                $nextId++;
            }
        } while ($exists);

        return response()->json(['contract_number' => $number]);
    }
}
