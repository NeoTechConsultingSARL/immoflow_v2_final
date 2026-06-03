<?php

namespace App\Http\Controllers;

use App\Models\SyndicChargeType;
use App\Http\Requests\StoreSyndicChargeTypeRequest;
use App\Http\Requests\UpdateSyndicChargeTypeRequest;

class SyndicChargeTypeController extends Controller
{
    public function index()
    {
        return response()->json(SyndicChargeType::all());
    }

    public function store(StoreSyndicChargeTypeRequest $request)
    {
        $validated = $request->validated();

        SyndicChargeType::create($validated);

        return redirect()->back()->with('success', 'Type de charge ajouté avec succès.');
    }

    public function update(UpdateSyndicChargeTypeRequest $request, SyndicChargeType $syndicChargeType)
    {
        $validated = $request->validated();

        $syndicChargeType->update($validated);

        return redirect()->back()->with('success', 'Type de charge mis à jour avec succès.');
    }

    public function destroy(SyndicChargeType $syndicChargeType)
    {
        $syndicChargeType->delete();

        return redirect()->back()->with('success', 'Type de charge supprimé avec succès.');
    }
}
