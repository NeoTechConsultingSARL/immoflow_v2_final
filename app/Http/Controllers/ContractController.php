<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContractRequest;
use App\Models\Bloc;
use App\Models\Client;
use App\Models\Company;
use App\Models\Contract;
use App\Models\ContractCommission;
use App\Models\ContractModification;
use App\Models\PaymentSchedule;
use App\Models\Project;
use App\Models\Parking;
use App\Models\Property;
use App\Models\PropertyType;
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
        $bloc->load('tranche.project.company');
        $project = $bloc->tranche?->project;
        $tranche = $bloc->tranche;

        $params = $request->query();
        $params['bloc'] = $bloc->id;
        $params['blocName'] = $bloc->name;
        if ($project) {
            $params['project'] = $project->id;
            $params['name'] = $project->name;
        }
        if ($tranche) {
            $params['tranche'] = $tranche->id;
            $params['trancheName'] = $tranche->name;
        }

        return redirect()->route('client-contracts', $params);
    }

    public function create(Bloc $bloc)
    {
        return Inertia::render('ContractCreate', [
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
                'parking_id' => $validated['parking_id'] ?? null,
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
                    'status' => $commission['status'] ?? 'pending',
                ]);
            }

            // Reserve the parking space if selected
            if (! empty($validated['parking_id'])) {
                $parking = Parking::find($validated['parking_id']);
                if ($parking) {
                    $parking->update(['status' => 'reserved']);
                }
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

    public function details(Request $request)
    {
        $id = $request->query('id');

        $contract = Contract::with([
            'client',
            'property.bloc.tranche.project.company',
            'paymentSchedules' => function ($q) {
                $q->orderBy('due_date', 'asc');
            },
            'commission',
            'modification',
        ])->findOrFail($id);

        // Generate breadcrumb path
        $path = '';
        $bloc = null;
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

        return Inertia::render('ContractDetails', [
            'contract' => $contract,
            'path' => $path,
            'bloc' => $bloc ? $bloc->load('tranche.project.company') : null,
        ]);
    }

    public function edit(Bloc $bloc, Contract $contract)
    {
        $contract->load([
            'client',
            'property.bloc.tranche.project.company',
            'modification',
            'paymentSchedules',
            'commission',
            'parking',
        ]);

        return Inertia::render('ContractCreate', [
            'contract' => $contract,
            'companies' => Company::all(),
            'clients' => Client::all(),
            'bloc' => $bloc->load('tranche.project.company'),
        ]);
    }

    public function editStandalone(Contract $contract)
    {
        $contract->load([
            'client',
            'property.bloc.tranche.project.company',
            'modification',
            'paymentSchedules',
            'commission',
            'parking',
        ]);

        $bloc = $contract->property?->bloc;

        if ($bloc) {
            $bloc->load('tranche.project.company');
        }

        return Inertia::render('ContractCreate', [
            'contract' => $contract,
            'companies' => Company::all(),
            'clients' => Client::all(),
            'bloc' => $bloc,
        ]);
    }

    public function update(Request $request, Bloc $bloc, Contract $contract)
    {
        if ($request->has('schedule') && is_array($request->input('schedule'))) {
            $filteredSchedule = array_filter($request->input('schedule'), function ($item) {
                return isset($item['amount']) && trim($item['amount']) !== '';
            });
            $request->merge([
                'schedule' => array_values($filteredSchedule),
            ]);
        }

        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'first_name' => 'required_without:client_id|string|max:255',
            'last_name' => 'required_without:client_id|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required_without:client_id|string|max:255',
            'id_number' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',

            'property_id' => 'required|exists:properties,id',
            'parking_id' => 'nullable|exists:parkings,id',
            'contract_number' => 'required|string|unique:contracts,contract_number,'.$contract->id,
            'price' => 'required|numeric|min:0',
            'advance' => 'nullable|numeric|min:0',
            'paymentDuration' => 'nullable|integer|min:1',
            'paymentFrequency' => 'nullable|integer|min:1',
            'date' => 'nullable|date',


            // Client details for inline update if needed
            'client_name' => 'nullable|string',
            'client_email' => 'nullable|email',
            'client_phone' => 'nullable|string',
            'client_cin' => 'nullable|string',
            'client_address' => 'nullable|string',

            'modification.notes' => 'nullable|string',
            'modification.image' => 'nullable|image|max:2048',

            'withDetails' => 'required|boolean',
            'schedule' => 'required_if:withDetails,1|array',
            'schedule.*.due_date' => 'required_with:schedule|date',
            'schedule.*.amount' => 'required_with:schedule|numeric|min:0',
            'schedule.*.observation' => 'nullable|string',

            'commission' => 'nullable|array',
            'commission.broker_name' => 'required_with:commission|string|max:255',
            'commission.amount' => 'required_with:commission|numeric|min:0',
            'commission.description' => 'nullable|string',
            'commission.status' => 'nullable|string',

        ]);

        return DB::transaction(function () use ($validated, $request, $bloc, $contract) {
            // 1. Check or create/update the Client record
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
                $client = Client::findOrFail($clientId);
                $fullName = trim(($request->input('first_name') ?? '').' '.($request->input('last_name') ?? ''));
                if ($fullName) {
                    $client->update(['full_name' => $fullName]);
                }
                if ($request->has('email')) {
                    $client->update(['email' => $request->input('email')]);
                }
                if ($request->has('phone')) {
                    $client->update(['phone' => $request->input('phone')]);
                }
                if ($request->has('id_number')) {
                    $client->update(['identity_number' => $request->input('id_number')]);
                }
                if ($request->has('address')) {
                    $client->update(['address' => $request->input('address')]);
                }
            }

            // Target Property Unit matching incoming property ID
            $property = Property::findOrFail($validated['property_id']);
            $oldPropertyId = $contract->property_id;

            if ($oldPropertyId && $oldPropertyId != $property->id) {
                $oldProperty = Property::find($oldPropertyId);
                if ($oldProperty) {
                    $oldProperty->update(['status' => 'Disponible']);
                }
            }


        if ($contract->client) {
            $clientData = [];
            if ($request->has('client_name')) {
                $clientData['full_name'] = $request->input('client_name');
            }
            if ($request->has('client_email')) {
                $clientData['email'] = $request->input('client_email');
            }
            if ($request->has('client_phone')) {
                $clientData['phone'] = $request->input('client_phone');
            }
            if ($request->has('client_cin')) {
                $clientData['identity_number'] = $request->input('client_cin');
            }
            if ($request->has('client_address')) {
                $clientData['address'] = $request->input('client_address');
            }

            if (! empty($clientData)) {
                $contract->client->update($clientData);
            }
        }

            // Parking reservation update
            $oldParkingId = $contract->parking_id;
            $newParkingId = $validated['parking_id'] ?? null;

            if ($oldParkingId != $newParkingId) {
                if ($oldParkingId) {
                    $oldParking = Parking::find($oldParkingId);
                    if ($oldParking) {
                        $oldParking->update(['status' => 'free']);
                    }
                }
                if ($newParkingId) {
                    $newParking = Parking::find($newParkingId);
                    if ($newParking) {
                        $newParking->update(['status' => 'reserved']);
                    }
                }
            }

            $contract->update([
                'client_id' => $clientId,
                'property_id' => $property->id,
                'parking_id' => $newParkingId,
                'contract_number' => $validated['contract_number'],
                'price' => $validated['price'],
                'advance' => $validated['advance'] ?? null,
                'payment_duration' => $validated['paymentDuration'] ?? null,
                'payment_frequency' => $validated['paymentFrequency'] ?? null,
                'date' => $validated['date'] ?? now(),
            ]);


            // Handle file upload for the modification image
            if (! empty($validated['modification'])) {
                $imagePath = null;
                if ($request->hasFile('modification.image')) {
                    $imagePath = $request->file('modification.image')->store('modifications', 'public');
                }

                if ($contract->modification) {
                    $contract->modification->update([
                        'notes' => $validated['modification']['notes'] ?? $contract->modification->notes,
                        'image_path' => $imagePath ?? $contract->modification->image_path,
                    ]);
                } else {
                    if (! empty($validated['modification']['notes']) || $imagePath) {
                        $contract->modification()->create([
                            'notes' => $validated['modification']['notes'] ?? null,
                            'image_path' => $imagePath,
                        ]);
                    }
                }
            }

            // Payment timeline rows update
            if (! empty($validated['withDetails'])) {
                $contract->paymentSchedules()->delete();

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
                $contract->paymentSchedules()->delete();

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

            // Commission update
            if (! empty($validated['commission'])) {
                $commission = $validated['commission'];
                if ($contract->commission) {
                    $contract->commission->update([
                        'broker_name' => $commission['broker_name'] ?? $commission['name'] ?? $contract->commission->broker_name,
                        'amount' => $commission['amount'] ?? $contract->commission->amount,
                        'description' => $commission['description'] ?? $contract->commission->description,
                        'status' => $commission['status'] ?? $contract->commission->status,
                    ]);
                } else {
                    $contract->commission()->create([
                        'broker_name' => $commission['broker_name'] ?? $commission['name'] ?? null,
                        'amount' => $commission['amount'] ?? null,
                        'description' => $commission['description'] ?? null,
                        'status' => $commission['status'] ?? 'pending',
                    ]);
                }
            }

            $property->update([
                'status' => 'Vendu',
                'price' => $contract->price,
            ]);

            if ($request->header('Referer')) {
                return redirect($request->header('Referer'))->with('success', 'Contract updated successfully.');
            }

            return redirect()->route('client-contracts', ['bloc' => $bloc->id])->with('success', 'Contract updated successfully.');
        });
    }

    public function destroy(Request $request, Bloc $bloc, Contract $contract)
    {
        return DB::transaction(function () use ($request, $bloc, $contract) {
            $contract->update(['status' => 'cancelled']);

            if ($contract->parking_id) {
                $parking = Parking::find($contract->parking_id);
                if ($parking) {
                    $parking->update(['status' => 'free']);
                }
            }

            if ($contract->property) {
                $contract->property->update(['status' => 'Disponible']);
            }

            if ($request->header('Referer')) {
                return redirect($request->header('Referer'))->with('success', 'Contract deleted successfully.');
            }

            return redirect()->route('client-contracts', ['bloc' => $bloc->id])->with('success', 'Contract deleted successfully.');
        });
    }

    public function generatePdf(Bloc $bloc, Contract $contract, ContractPdfService $pdfService, Request $request)
    {
        $contract->load(['client', 'property.bloc.tranche.project.company']);

        $template = $request->query('template', 'summary');

        // Resolve fileName parameters
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

        if ($template === 'resell') {
            $pdf = Pdf::loadView('contracts.resell', compact('contract'));
            $fileName = 'certificat_revente_'.$contractNumber.'_'.$projectName.'_'.$clientName.'_'.$date.'.pdf';
        } elseif ($template === 'full_payment') {
            $pdf = Pdf::loadView('contracts.full_payment', compact('contract'));
            $fileName = 'attestation_paiement_'.$contractNumber.'_'.$projectName.'_'.$clientName.'_'.$date.'.pdf';
        } else {
            $lang = 'fr';
            if ($template === 'ar') {
                $lang = 'ar';
            } elseif ($template === 'en') {
                $lang = 'en';
            }
            $clauses = $pdfService->getClauses($contract, $lang);
            $pdf = Pdf::loadView('contracts.pdf', compact('contract', 'clauses', 'lang'));
            $fileName = 'contrat_'.$contractNumber.'_'.$projectName.'_'.$clientName.'_'.$date.'.pdf';
        }

        return $pdf->download($fileName);
    }

    public function getPropertyTypes()
    {
        return response()->json(PropertyType::all());
    }

    public function getParkings(Request $request, Bloc $bloc)
    {
        $contractId = $request->query('contract_id');

        $query = Parking::where('bloc_id', $bloc->id)
            ->where(function ($q) use ($contractId) {
                // Either status is free OR it is not associated with any contract
                $q->where('status', 'free')
                    ->orWhereNotExists(function ($subQuery) {
                        $subQuery->select(DB::raw(1))
                            ->from('contracts')
                            ->whereColumn('contracts.parking_id', 'parkings.id');
                    });

                // Or it is associated with the current contract being edited
                if ($contractId) {
                    $q->orWhereExists(function ($subQuery) use ($contractId) {
                        $subQuery->select(DB::raw(1))
                            ->from('contracts')
                            ->whereColumn('contracts.parking_id', 'parkings.id')
                            ->where('contracts.id', $contractId);
                    });
                }
            });

        return response()->json($query->get());
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

    public function storePayment(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'due_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'observation' => 'nullable|string',
        ]);

        $contract->paymentSchedules()->create($validated);

        return back()->with('success', 'Payment schedule entry added successfully.');
    }

    public function destroyPayment(Contract $contract, PaymentSchedule $paymentSchedule)
    {
        $paymentSchedule->delete();

        return back()->with('success', 'Payment schedule entry deleted successfully.');
    }

    public function storeCommission(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'broker_name' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|string|in:Pending,Paid,Cancelled',
        ]);

        $contract->commission()->updateOrCreate([], $validated);

        return back()->with('success', 'Commission saved successfully.');
    }

    public function destroyCommission(Contract $contract, ContractCommission $contractCommission)
    {
        $contractCommission->delete();

        return back()->with('success', 'Commission deleted successfully.');
    }

    public function storeModification(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'notes' => 'required|string',
        ]);

        $contract->modification()->updateOrCreate([], $validated);

        return back()->with('success', 'Observation saved successfully.');
    }

    public function destroyModification(Contract $contract, ContractModification $contractModification)
    {
        $contractModification->delete();

        return back()->with('success', 'Observation deleted successfully.');

    public function getAllProperties()
    {
        return response()->json(Property::with(['propertyType', 'bloc.tranche.project'])->get());

    }
}
