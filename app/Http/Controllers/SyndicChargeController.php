<?php

namespace App\Http\Controllers;

use App\Models\SyndicCharge;
use App\Http\Requests\StoreSyndicChargeRequest;
use App\Http\Requests\UpdateSyndicChargeRequest;

class SyndicChargeController extends Controller
{
    public function store(StoreSyndicChargeRequest $request)
    {
        $validated = $request->validated();

        SyndicCharge::create($validated);

        return redirect()->back()->with('success', 'Charge ajoutée avec succès.');
    }

    public function update(UpdateSyndicChargeRequest $request, SyndicCharge $syndicCharge)
    {
        $validated = $request->validated();

        $syndicCharge->update($validated);

        return redirect()->back()->with('success', 'Charge mise à jour avec succès.');
    }

    public function destroy(SyndicCharge $syndicCharge)
    {
        if (! auth()->user()?->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $syndicCharge->delete();

        return redirect()->back()->with('success', 'Charge supprimée avec succès.');
    }
}
