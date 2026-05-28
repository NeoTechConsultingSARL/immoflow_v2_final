<?php

namespace App\Http\Controllers;

use App\Models\Bloc;
use App\Models\Parking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParkingController extends Controller
{
    /**
     * Display a listing of parkings for a bloc.
     */
    public function index(Request $request): Response
    {
        $blocId = $request->query('bloc');
        $search = $request->query('search');

        $query = Parking::with(['bloc.tranche.project'])->orderBy('name', 'asc');

        if ($blocId) {
            $query->where('bloc_id', $blocId);
        }

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $parkings = $query->get()
            ->map(function ($parking) {
                return [
                    'id' => (string) $parking->id,
                    'name' => $parking->name,
                    'status' => $parking->status,
                    'blocId' => (string) $parking->bloc_id,
                    'blocName' => $parking->bloc->name ?? 'N/A',
                    'trancheName' => $parking->bloc && $parking->bloc->tranche ? $parking->bloc->tranche->name : 'N/A',
                    'projectName' => $parking->bloc && $parking->bloc->tranche && $parking->bloc->tranche->project ? $parking->bloc->tranche->project->name : 'N/A',
                ];
            });

        $bloc = null;
        if ($blocId) {
            $bloc = Bloc::with(['tranche.project'])->find($blocId);
        }

        return Inertia::render('Parkings', [
            'parkings' => $parkings,
            'bloc' => $bloc ? [
                'id' => (string) $bloc->id,
                'name' => $bloc->name,
                'trancheName' => $bloc->tranche->name ?? 'N/A',
                'projectName' => $bloc->tranche->project->name ?? 'N/A',
            ] : null,
            'filters' => [
                'bloc' => $blocId,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store newly created parking spaces in bulk.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bloc_id' => 'required|exists:blocs,id',
            'count' => 'required|integer|min:1|max:100',
            'status' => 'required|in:free,reserved',
        ]);

        $bloc = Bloc::with(['tranche.project'])->findOrFail($validated['bloc_id']);

        // Generate prefix: Project_Tranche_Bloc
        $prefix = $this->generatePrefix($bloc);

        // Create parking spaces in bulk
        $parkings = [];
        for ($i = 1; $i <= $validated['count']; $i++) {
            $name = "{$prefix}_{$i}";
            // Check for duplicates
            if (! Parking::where('name', $name)->where('bloc_id', $validated['bloc_id'])->exists()) {
                $parkings[] = [
                    'name' => $name,
                    'status' => $validated['status'],
                    'bloc_id' => $validated['bloc_id'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (! empty($parkings)) {
            Parking::insert($parkings);
        }

        return back()
            ->with('success', count($parkings).' parking spaces created successfully.');
    }

    /**
     * Update the specified parking.
     */
    public function update(Request $request, Parking $parking): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|unique:parkings,name,'.$parking->id,
            'status' => 'sometimes|required|in:free,reserved',
        ]);

        $parking->update($validated);

        return back()
            ->with('success', 'Parking updated successfully.');
    }

    /**
     * Remove the specified parking.
     */
    public function destroy(Parking $parking): RedirectResponse
    {
        $parking->delete();

        return back()
            ->with('success', 'Parking deleted successfully.');
    }

    /**
     * Generate parking prefix from bloc hierarchy.
     */
    private function generatePrefix(Bloc $bloc): string
    {
        $projectName = $bloc->tranche->project->name ?? 'Project';
        $trancheName = $bloc->tranche->name ?? 'T';
        $blocName = $bloc->name ?? 'B';

        // Create abbreviated prefix: e.g., PrSA_TB_B2
        $projectAbbr = substr($projectName, 0, 2).substr($projectName, -2);

        // Extract meaningful part from tranche name (letters or numbers)
        $trancheAbbr = preg_replace('/[^A-Za-z0-9]/', '', $trancheName) ?: '1';
        // If it's a word like "Tranche", extract the last letter/number
        if (preg_match('/[A-Za-z0-9]$/', $trancheName, $matches)) {
            $trancheAbbr = $matches[0];
        }

        // Extract meaningful part from bloc name (letters or numbers)
        $blocAbbr = preg_replace('/[^A-Za-z0-9]/', '', $blocName) ?: '1';
        // If it's a word like "Bloc", extract the last letter/number
        if (preg_match('/[A-Za-z0-9]$/', $blocName, $matches)) {
            $blocAbbr = $matches[0];
        }

        return "{$projectAbbr}_T{$trancheAbbr}_B{$blocAbbr}";
    }
}
