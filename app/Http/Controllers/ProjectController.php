<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Company;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(): Response
    {
        $projects = Project::with('company')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($project) {
                return [
                    'id' => (string) $project->id,
                    'name' => $project->name,
                    'companyId' => (string) $project->company_id,
                    'companyName' => $project->company->name ?? 'N/A',
                    'address' => $project->address ?? '',
                    'description' => $project->description ?? '',
                    'status' => $project->status ?? 'Planning',
                    'budget' => $project->budget ?? '',
                    'startDate' => $project->start_date ?? '',
                    'units' => (int) $project->units,
                    'propertyAllocations' => $project->property_allocations ?? [],
                ];
            });

        $companies = Company::select('id', 'name')->orderBy('name', 'asc')->get()->map(function ($company) {
            return [
                'id' => (string) $company->id,
                'name' => $company->name,
            ];
        });

        return Inertia::render('Projects', [
            'projects' => $projects,
            'companies' => $companies,
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $data = $request->validated();
        
        // Calculate total units from property allocations if units is not provided or is 0
        if (isset($data['property_allocations']) && is_array($data['property_allocations'])) {
            $data['units'] = array_reduce($data['property_allocations'], function ($carry, $item) {
                return $carry + (int) ($item['units'] ?? 0);
            }, 0);
        }

        Project::create($data);

        return redirect()
            ->route('projects')
            ->with('success', 'Project created successfully.');
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $data = $request->validated();

        // Calculate total units from property allocations if units is not provided or is 0
        if (isset($data['property_allocations']) && is_array($data['property_allocations'])) {
            $data['units'] = array_reduce($data['property_allocations'], function ($carry, $item) {
                return $carry + (int) ($item['units'] ?? 0);
            }, 0);
        }

        $project->update($data);

        return redirect()
            ->route('projects')
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()
            ->route('projects')
            ->with('success', 'Project deleted successfully.');
    }
}
