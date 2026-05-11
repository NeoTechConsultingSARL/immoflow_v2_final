<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Company;
use App\Models\Project;
use App\Models\Tranche;
use App\Models\Bloc;
use App\Models\Property;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class ContractController extends Controller
{
    public function index(Request $request)
    {
        $query = Contract::with(['client', 'property.bloc.tranche.project.company']);

        if ($request->has('company_id')) {
            $query->byCompany($request->company_id);
        }

        if ($request->has('project_id')) {
            $query->byProject($request->project_id);
        }

        $contracts = $query->latest()->paginate(10);

        return Inertia::render('Contracts/Index', [
            'contracts' => $contracts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Contracts/Create', [
            'companies' => Company::all(),
            'clients' => Client::all(),
        ]);
    }

    public function store(Request $request)
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

        return redirect()->route('contracts.index')->with('success', 'Contract created successfully.');
    }

    public function show(Contract $contract)
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
            if ($company) $parts[] = $company->name;
            if ($project) $parts[] = $project->name;
            if ($tranche) $parts[] = $tranche->name;
            if ($bloc) $parts[] = $bloc->name;
            $parts[] = $property->name;

            $path = implode(' > ', $parts);
        }

        return Inertia::render('Contracts/Show', [
            'contract' => $contract,
            'path' => $path,
        ]);
    }

    public function edit(Contract $contract)
    {
        $contract->load(['property.bloc.tranche.project.company']);
        return Inertia::render('Contracts/Create', [
            'contract' => $contract,
            'companies' => Company::all(),
            'clients' => Client::all(),
        ]);
    }

    public function update(Request $request, Contract $contract)
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
        } else if ($contract->status === 'cancelled') {
            $contract->property->update(['status' => 'Available']); // Assuming 'Available' is a valid status
        }

        return redirect()->route('contracts.index')->with('success', 'Contract updated successfully.');
    }

    public function destroy(Contract $contract)
    {
        $contract->delete(); // Soft delete
        return redirect()->route('contracts.index')->with('success', 'Contract deleted successfully.');
    }

    public function generatePdf(Contract $contract)
    {
        $contract->load(['client', 'property.bloc.tranche.project.company']);
        
        $pdf = Pdf::loadView('contracts.pdf', compact('contract'));
        
        $fileName = 'Contract_' . $contract->id . '_' . Str::slug($contract->client->full_name) . '.pdf';
        
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
