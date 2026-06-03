<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBusinessPlanCostRequest;
use App\Http\Requests\StoreBusinessPlanProductRequest;
use App\Http\Requests\UpdateBusinessPlanCostRequest;
use App\Http\Requests\UpdateBusinessPlanProductRequest;
use App\Models\Bloc;
use App\Models\BusinessPlanCost;
use App\Models\BusinessPlanCostType;
use App\Models\BusinessPlanProduct;
use App\Models\BusinessPlanProductType;
use App\Services\BusinessPlanCalculationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BusinessPlanController extends Controller
{
    public function __construct(
        private readonly BusinessPlanCalculationService $calculations,
    ) {}

    public function show(Request $request, Bloc $bloc): Response
    {
        $this->authorize('viewAny', BusinessPlanCost::class);

        $bloc->load('tranche.project.company');

        $products = BusinessPlanProduct::where('bloc_id', $bloc->id)
            ->orderByDesc('id')
            ->get()
            ->map(fn (BusinessPlanProduct $item) => $this->formatLineItem($item, 'product_type'));

        $costs = BusinessPlanCost::where('bloc_id', $bloc->id)
            ->orderByDesc('id')
            ->get()
            ->map(fn (BusinessPlanCost $item) => $this->formatLineItem($item, 'cost_type'));

        $summary = $this->calculations->aggregate($bloc);

        return Inertia::render('BusinessPlan', array_merge($this->blocContext($bloc), [
            'products' => $products,
            'costs' => $costs,
            'productTypes' => BusinessPlanProductType::orderBy('name')->pluck('name'),
            'costTypes' => BusinessPlanCostType::orderBy('name')->pluck('name'),
            'summary' => $summary,
        ]));
    }

    public function storeProduct(StoreBusinessPlanProductRequest $request, Bloc $bloc): RedirectResponse
    {
        BusinessPlanProduct::create([
            ...$request->validated(),
            'bloc_id' => $bloc->id,
        ]);

        return back()->with('success', 'Product line added successfully.');
    }

    public function updateProduct(UpdateBusinessPlanProductRequest $request, BusinessPlanProduct $product): RedirectResponse
    {
        $this->ensureBlocScoped($product->bloc_id);

        $product->update($request->validated());

        return back()->with('success', 'Product line updated successfully.');
    }

    public function destroyProduct(BusinessPlanProduct $product): RedirectResponse
    {
        $this->authorize('delete', BusinessPlanProduct::class);
        $this->ensureBlocScoped($product->bloc_id);

        $product->delete();

        return back()->with('success', 'Product line deleted successfully.');
    }

    public function storeCost(StoreBusinessPlanCostRequest $request, Bloc $bloc): RedirectResponse
    {
        BusinessPlanCost::create([
            ...$request->validated(),
            'bloc_id' => $bloc->id,
        ]);

        return back()->with('success', 'Cost line added successfully.');
    }

    public function updateCost(UpdateBusinessPlanCostRequest $request, BusinessPlanCost $cost): RedirectResponse
    {
        $this->ensureBlocScoped($cost->bloc_id);

        $cost->update($request->validated());

        return back()->with('success', 'Cost line updated successfully.');
    }

    public function destroyCost(BusinessPlanCost $cost): RedirectResponse
    {
        $this->authorize('delete', BusinessPlanCost::class);
        $this->ensureBlocScoped($cost->bloc_id);

        $cost->delete();

        return back()->with('success', 'Cost line deleted successfully.');
    }

    private function ensureBlocScoped(int $blocId): void
    {
        // Structural guard: line items must belong to a valid bloc (never project/tranche direct binding).
        if (! Bloc::whereKey($blocId)->exists()) {
            abort(404);
        }
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
    private function formatLineItem(BusinessPlanCost|BusinessPlanProduct $item, string $typeKey): array
    {
        return [
            'id' => (string) $item->id,
            'type' => $item->{$typeKey},
            'landSize' => $item->land_size !== null ? (float) $item->land_size : null,
            'unitPrice' => $item->unit_price !== null ? (float) $item->unit_price : null,
            'amount' => (float) $item->amount,
            'description' => $item->description ?? '',
            'blocId' => (string) $item->bloc_id,
        ];
    }
}
