<?php

namespace App\Observers;

use App\Models\Shareholder;
use App\Models\THistory;
use Illuminate\Support\Facades\Auth;

class ShareholderObserver
{
    public function created(Shareholder $shareholder): void
    {
        $this->log($shareholder, 'Ajout');
    }

    public function updated(Shareholder $shareholder): void
    {
        $this->log($shareholder, 'Modification');
    }

    public function deleted(Shareholder $shareholder): void
    {
        $this->log($shareholder, 'Suppression');
    }

    private function log(Shareholder $shareholder, string $action): void
    {
        $shareholder->loadMissing('bloc.tranche.project');

        $blocName = $shareholder->bloc?->name ?? 'N/A';
        $projectName = $shareholder->bloc?->tranche?->project?->name ?? 'N/A';
        $amount = number_format((float) $shareholder->amount, 2, '.', ' ');

        $description = sprintf(
            '%s d\'une operation au Apports des Associés - Bloc: %s (Projet: %s) - Associé : %s - Montant : %s DH',
            $action,
            $blocName,
            $projectName,
            $shareholder->name,
            $amount
        );

        THistory::create([
            'description' => $description,
            'user_id' => Auth::id(),
        ]);
    }
}
