<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    /**
     * Display a listing of companies.
     */
    public function index(): Response
    {
        $companies = Company::select('id', 'name', 'status', 'description', 'email', 'address', 'phone', 'website', 'properties', 'rc', 'if', 'patent', 'fax', 'created_at')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'status' => $company->status,
                    'status_label' => $company->isActive() ? 'Active' : 'Inactive',
                    'description' => $company->description,
                    'email' => $company->email,
                    'address' => $company->address,
                    'phone' => $company->phone,
                    'website' => $company->website,
                    'properties' => $company->properties,
                    'rc' => $company->rc,
                    'if' => $company->if,
                    'patent' => $company->patent,
                    'fax' => $company->fax,
                    'created_at' => $company->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
            'statusOptions' => Company::getStatusOptions(),
        ]);
    }

    /**
     * Store a newly created company.
     */
    public function store(StoreCompanyRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Company::create([
            'name' => $validated['name'],
            'status' => $validated['status'],
            'description' => $validated['description'] ?? null,
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'website' => $validated['website'] ?? null,
            'properties' => $validated['properties'] ?? 0,
            'rc' => $validated['rc'] ?? null,
            'if' => $validated['if'] ?? null,
            'patent' => $validated['patent'] ?? null,
            'fax' => $validated['fax'] ?? null,
        ]);

        return redirect()
            ->route('companies')
            ->with('success', 'Company created successfully.');
    }

    /**
     * Update the specified company.
     */
    public function update(UpdateCompanyRequest $request, Company $company): RedirectResponse
    {
        $validated = $request->validated();

        $company->update([
            'name' => $validated['name'],
            'status' => $validated['status'],
            'description' => $validated['description'] ?? null,
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'website' => $validated['website'] ?? null,
            'properties' => $validated['properties'] ?? 0,
            'rc' => $validated['rc'] ?? null,
            'if' => $validated['if'] ?? null,
            'patent' => $validated['patent'] ?? null,
            'fax' => $validated['fax'] ?? null,
        ]);

        return redirect()
            ->route('companies')
            ->with('success', 'Company updated successfully.');
    }

    // Delete functionality has been disabled for companies
    // public function destroy(Company $company): RedirectResponse
    // {
    //     // Check if company has projects before deletion
    //     if ($company->projects()->exists()) {
    //         return redirect()
    //             ->route('companies')
    //             ->with('error', 'Cannot delete company with existing projects. Please delete projects first.');
    //     }

    //     $company->delete();

    //     return redirect()
    //         ->route('companies')
    //         ->with('success', 'Company deleted successfully.');
    // }
}
