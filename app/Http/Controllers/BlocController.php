<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBlocRequest;
use App\Http\Requests\UpdateBlocRequest;
use App\Models\Bloc;
use App\Models\Project;
use App\Models\Tranche;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlocController extends Controller
{
    /**
     * Display a listing of blocs.
     */
    public function index(Request $request): Response
    {
        $projectId = $request->query('project');
        $trancheId = $request->query('tranche');

        $query = Bloc::with(['tranche.project'])->orderBy('created_at', 'desc');

        if ($trancheId) {
            $query->where('tranche_id', $trancheId);
        } elseif ($projectId) {
            $query->whereHas('tranche', function ($q) use ($projectId) {
                $q->where('project_id', $projectId);
            });
        }

        $blocs = $query->get()
            ->map(function ($bloc) {
                return [
                    'id' => (string) $bloc->id,
                    'name' => $bloc->name,
                    'description' => $bloc->description ?? '',
                    'floors' => (int) $bloc->floors,
                    'status' => $bloc->status,
                    'trancheId' => (string) $bloc->tranche_id,
                    'trancheName' => $bloc->tranche->name ?? 'N/A',
                    'projectId' => (string) ($bloc->tranche->project_id ?? ''),
                    'projectName' => $bloc->tranche->project->name ?? 'N/A',
                    'unitsCount' => (int) $bloc->units,
                ];
            });

        $projects = Project::select('id', 'name')->orderBy('name', 'asc')->get()->map(function ($project) {
            return [
                'id' => (string) $project->id,
                'name' => $project->name,
            ];
        });

        $tranches = Tranche::select('id', 'name', 'project_id')->orderBy('name', 'asc')->get()->map(function ($tranche) {
            return [
                'id' => (string) $tranche->id,
                'name' => $tranche->name,
                'projectId' => (string) $tranche->project_id,
            ];
        });

        return Inertia::render('Blocs', [
            'blocs' => $blocs,
            'projects' => $projects,
            'tranches' => $tranches,
            'filters' => [
                'project' => $projectId,
                'tranche' => $trancheId,
            ],
        ]);
    }

    /**
     * Store a newly created bloc.
     */
    public function store(StoreBlocRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Remove project_id as it doesn't belong in the blocs table
        unset($validated['project_id']);

        Bloc::create($validated);

        return redirect()
            ->route('blocs')
            ->with('success', 'Bloc created successfully.');
    }

    /**
     * Update the specified bloc.
     */
    public function update(UpdateBlocRequest $request, Bloc $bloc): RedirectResponse
    {
        $validated = $request->validated();

        // Remove project_id as it doesn't belong in the blocs table
        unset($validated['project_id']);

        $bloc->update($validated);

        return redirect()
            ->route('blocs')
            ->with('success', 'Bloc updated successfully.');
    }

    /**
     * Remove the specified bloc.
     */
    public function destroy(Bloc $bloc): RedirectResponse
    {
        $bloc->delete();

        return redirect()
            ->route('blocs')
            ->with('success', 'Bloc deleted successfully.');
    }
}
