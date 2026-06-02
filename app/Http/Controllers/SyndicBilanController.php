<?php

namespace App\Http\Controllers;

use App\Models\Syndic;
use App\Models\SyndicCharge;
use Illuminate\Http\Request;

class SyndicBilanController extends Controller
{
    public function printBilan(Request $request)
    {
        $validated = $request->validate([
            'bloc_id' => 'required|exists:blocs,id',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $blocId = $validated['bloc_id'];
        
        $syndicsQuery = Syndic::with('client')->where('bloc_id', $blocId)->where('status', 'Valide');
        $chargesQuery = SyndicCharge::with('syndicChargeType')->where('bloc_id', $blocId);

        if (!empty($validated['date_from'])) {
            $syndicsQuery->where('date', '>=', $validated['date_from']);
            $chargesQuery->where('date_operation', '>=', $validated['date_from']);
        }

        if (!empty($validated['date_to'])) {
            $syndicsQuery->where('date', '<=', $validated['date_to']);
            $chargesQuery->where('date_operation', '<=', $validated['date_to']);
        }

        $bloc = \App\Models\Bloc::with(['tranche.project'])->findOrFail($blocId);

        $syndics = $syndicsQuery->get();
        $charges = $chargesQuery->get();

        $totalPayments = (clone $syndicsQuery)->sum('montant');
        $totalCharges = (clone $chargesQuery)->sum('montant');
        $solde = $totalPayments - $totalCharges;

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('syndic_bilan_pdf', [
            'bloc' => $bloc,
            'totalPayments' => $totalPayments,
            'totalCharges' => $totalCharges,
            'solde' => $solde,
            'syndics' => $syndics,
            'charges' => $charges,
        ]);

        return $pdf->stream('bilan_syndic_' . $bloc->id . '.pdf');
    }
}
