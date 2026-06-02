<?php

namespace App\Http\Controllers;

use App\Models\Bloc;
use App\Models\Client;
use App\Models\Syndic;
use App\Models\SyndicCharge;
use App\Models\SyndicChargeType;
use App\Http\Requests\StoreSyndicRequest;
use App\Http\Requests\UpdateSyndicRequest;
use App\Http\Requests\UpdateSyndicStatusRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class SyndicController extends Controller
{
    public function index(Request $request)
    {
        $blocId = $request->query('bloc_id');

        $syndics = [];
        $charges = [];
        $totalPayments = 0;
        $totalCharges = 0;
        $solde = 0;

        if ($blocId && Schema::hasTable((new Syndic())->getTable()) && Schema::hasTable((new SyndicCharge())->getTable()) && Schema::hasTable((new SyndicChargeType())->getTable())) {
            Bloc::findOrFail($blocId);

            $syndics = Syndic::with('client')->where('bloc_id', $blocId)->get();
            $charges = SyndicCharge::with('syndicChargeType')->where('bloc_id', $blocId)->get();

            // Calculate aggregations at the database level
            $totalPayments = Syndic::where('bloc_id', $blocId)->sum('montant');
            $totalCharges = SyndicCharge::where('bloc_id', $blocId)->sum('montant');
            $solde = $totalPayments - $totalCharges;
        }

        $projects = \App\Models\Project::with('tranches.blocs')->get();
        $clients = \App\Models\Client::all();
        $chargeTypes = $this->safeChargeTypes();

        return Inertia::render('Syndic/Index', [
            'projects' => $projects,
            'syndics' => $syndics,
            'charges' => $charges,
            'clients' => $clients,
            'chargeTypes' => $chargeTypes,
            'total_payments_client' => $totalPayments,
            'total_charges' => $totalCharges,
            'solde' => $solde,
            'selected_bloc_id' => $blocId,
        ]);
    }

    public function store(StoreSyndicRequest $request)
    {
        $validated = $request->validated();

        $validated['status'] = 'Non Valide'; // Default status
        
        Syndic::create($validated);

        return redirect()->back()->with('success', 'Paiement syndic ajouté avec succès.');
    }

    public function update(UpdateSyndicRequest $request, Syndic $syndic)
    {
        $validated = $request->validated();

        $syndic->update($validated);

        return redirect()->back()->with('success', 'Paiement syndic mis à jour avec succès.');
    }

    public function updateStatus(UpdateSyndicStatusRequest $request, Syndic $syndic)
    {
        if (! auth()->user()?->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validated();

        $syndic->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Statut du paiement mis à jour.');
    }

    public function destroy(Syndic $syndic)
    {
        if (! auth()->user()?->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $syndic->delete();

        return redirect()->back()->with('success', 'Paiement syndic supprimé avec succès.');
    }

    public function printReceipt(Syndic $syndic)
    {
        // Stub for PDF receipt generator
        return response('Receipt PDF Stub for Syndic ID: ' . $syndic->id, 200)
            ->header('Content-Type', 'text/plain');
    }

    public function searchClients(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('q', ''));

        /** @var Collection<int, array{id:int,full_name:string}> $results */
        $results = Client::query()
            ->select(['id', 'full_name'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery->where('full_name', 'like', "%{$search}%");
                });
            })
            ->orderBy('full_name')
            ->limit(20)
            ->get()
            ->map(fn (Client $client): array => [
                'id' => $client->id,
                'full_name' => $client->full_name,
            ]);

        return response()->json($results);
    }

    protected function safeChargeTypes(): Collection
    {
        $tableName = (new SyndicChargeType())->getTable();

        if (! Schema::hasTable($tableName)) {
            return collect();
        }

        return SyndicChargeType::query()->orderBy('nom')->get();
    }
}
