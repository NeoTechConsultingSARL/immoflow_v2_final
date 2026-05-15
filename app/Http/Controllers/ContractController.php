<?php

namespace App\Http\Controllers;

use App\Models\Bloc;
use App\Models\Client;
use App\Models\Company;
use App\Models\Contract;
use App\Models\Project;
use App\Models\Tranche;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Services\ContractPdfService;

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

    public function store(Request $request, Bloc $bloc)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'property_id' => 'required|exists:properties,id',
            'status' => 'nullable|string|in:active,completed,cancelled,draft',
            'price' => 'nullable|numeric|min:0',
            'date' => 'nullable|date',
        ]);

        DB::transaction(function () use ($validated) {
            $contract = Contract::create($validated);

            if ($contract->status === 'active') {
                $contract->property->update(['status' => 'Reserved']);
            }
        });

        return redirect()->route('blocs.contracts.index', $bloc->id)->with('success', 'Contract created successfully.');
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

        $contractNumber = 'ct' . $contract->id;
        
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
        
        $date = $contract->date ? \Carbon\Carbon::parse($contract->date)->format('dmY') : now()->format('dmY');

        $fileName = 'contrat_' . $contractNumber . '_' . $projectName . '_' . $clientName . '_' . $date . '.pdf';

        return $pdf->download($fileName);
    }

    // API endpoints for cascading dropdowns
    public function getProjects(Company $company)
    {
        return response()->json($company->projects);
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
