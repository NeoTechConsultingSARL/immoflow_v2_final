<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTrancheRequest;
use App\Http\Requests\UpdateTrancheRequest;
use App\Models\Project;
use App\Models\Tranche;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrancheController extends Controller
{
    /**
     * Display a listing of tranches.
     */
    public function index(Request $request): Response
    {
        $projectId = $request->query('project');

        $query = Tranche::with('project')->orderBy('created_at', 'desc');

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $tranches = $query->get()
            ->map(function ($tranche) {
                return [
                    'id' => (string) $tranche->id,
                    'name' => $tranche->name,
                    'projectId' => (string) $tranche->project_id,
                    'projectName' => $tranche->project->name ?? 'N/A',
                    'status' => $tranche->status,
                    'blocsCount' => $tranche->blocs()->count(),
                    'unitsCount' => (int) $tranche->blocs()->sum('units'),
                ];
            });

        $projects = Project::select('id', 'name')->orderBy('name', 'asc')->get()->map(function ($project) {
            return [
                'id' => (string) $project->id,
                'name' => $project->name,
            ];
        });

        return Inertia::render('Tranches', [
            'tranches' => $tranches,
            'projects' => $projects,
            'filters' => [
                'project' => $projectId,
            ],
        ]);
    }

    /**
     * Store a newly created tranche.
     */
    public function store(StoreTrancheRequest $request): RedirectResponse
    {
        Tranche::create($request->validated());

        return redirect()
            ->route('tranches')
            ->with('success', 'Tranche created successfully.');
    }

    /**
     * Update the specified tranche.
     */
    public function update(UpdateTrancheRequest $request, Tranche $tranche): RedirectResponse
    {
        $tranche->update($request->validated());

        return redirect()
            ->route('tranches')
            ->with('success', 'Tranche updated successfully.');
    }

    /**
     * Remove the specified tranche.
     */
    public function destroy(Tranche $tranche): RedirectResponse
    {
        $tranche->delete();

        return redirect()
            ->route('tranches')
            ->with('success', 'Tranche deleted successfully.');
    }
}
