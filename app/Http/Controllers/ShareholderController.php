<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShareholderRequest;
use App\Http\Requests\UpdateShareholderRequest;
use App\Models\Bloc;
use App\Models\Shareholder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShareholderController extends Controller
{
    public function finance(Request $request, Bloc $bloc): Response
    {
        $this->authorize('viewAny', Shareholder::class);

        $bloc->load('tranche.project.company');

        return Inertia::render('ProjectFinance', $this->blocContext($bloc));
    }

    public function index(Request $request, Bloc $bloc): Response
    {
        $this->authorize('viewAny', Shareholder::class);

        $bloc->load('tranche.project.company');

        $shareholders = Shareholder::where('bloc_id', $bloc->id)
            ->orderBy('name')
            ->get()
            ->map(fn (Shareholder $shareholder) => $this->formatShareholder($shareholder));

        $totalCapital = (float) Shareholder::where('bloc_id', $bloc->id)->sum('amount');

        return Inertia::render('Shareholders', array_merge($this->blocContext($bloc), [
            'shareholders' => $shareholders,
            'totalCapital' => $totalCapital,
        ]));
    }

    public function store(StoreShareholderRequest $request, Bloc $bloc): RedirectResponse
    {
        Shareholder::create([
            ...$request->validated(),
            'bloc_id' => $bloc->id,
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Shareholder contribution added successfully.');
    }

    public function update(UpdateShareholderRequest $request, Shareholder $shareholder): RedirectResponse
    {
        $shareholder->update([
            ...$request->validated(),
            'updated_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Shareholder contribution updated successfully.');
    }

    public function destroy(Shareholder $shareholder): RedirectResponse
    {
        $this->authorize('delete', $shareholder);

        $shareholder->delete();

        return back()->with('success', 'Shareholder contribution deleted successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function blocContext(Bloc $bloc): array
    {
        $project = $bloc->tranche?->project;
        $company = $project?->company;

        return [
            'bloc' => [
                'id' => (string) $bloc->id,
                'name' => $bloc->name,
                'trancheId' => (string) ($bloc->tranche_id ?? ''),
                'trancheName' => $bloc->tranche?->name ?? '',
                'projectId' => (string) ($project?->id ?? ''),
                'projectName' => $project?->name ?? '',
                'companyId' => (string) ($company?->id ?? ''),
                'companyName' => $company?->name ?? '',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatShareholder(Shareholder $shareholder): array
    {
        return [
            'id' => (string) $shareholder->id,
            'name' => $shareholder->name,
            'amount' => (float) $shareholder->amount,
            'blocId' => (string) $shareholder->bloc_id,
        ];
    }
}
