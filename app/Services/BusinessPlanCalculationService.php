<?php

namespace App\Services;

use App\Models\Bloc;
use App\Models\BusinessPlanCost;
use App\Models\BusinessPlanProduct;
use App\Models\Shareholder;

class BusinessPlanCalculationService
{
    /**
     * @return array{
     *     totalProducts: float,
     *     totalCosts: float,
     *     estimatedProfit: float,
     *     totalShareholderCapital: float,
     *     companyGap: float,
     *     companyName: string,
     *     shareholderDistributions: list<array{name: string, contribution: float, percentage: float, dividend: float}>,
     *     companyDistribution: array{name: string, contribution: float, percentage: float, dividend: float}
     * }
     */
    public function aggregate(Bloc $bloc): array
    {
        $totalProducts = (float) BusinessPlanProduct::where('bloc_id', $bloc->id)->sum('amount');
        $totalCosts = (float) BusinessPlanCost::where('bloc_id', $bloc->id)->sum('amount');
        $estimatedProfit = $totalProducts - $totalCosts;

        $shareholders = Shareholder::where('bloc_id', $bloc->id)->orderBy('name')->get();
        $totalShareholderCapital = (float) $shareholders->sum('amount');
        $companyGap = max(0, $totalCosts - $totalShareholderCapital);

        $bloc->loadMissing('tranche.project.company');
        $companyName = $bloc->tranche?->project?->company?->name ?? 'Société';

        $shareholderDistributions = $shareholders->map(function (Shareholder $shareholder) use ($totalCosts, $estimatedProfit) {
            $percentage = $totalCosts > 0
                ? round(((float) $shareholder->amount / $totalCosts) * 100, 2)
                : 0.0;

            $dividend = round(($estimatedProfit * $percentage) / 100, 2);

            return [
                'name' => $shareholder->name,
                'contribution' => (float) $shareholder->amount,
                'percentage' => $percentage,
                'dividend' => $dividend,
            ];
        })->values()->all();

        $companyPercentage = $totalCosts > 0
            ? round(($companyGap / $totalCosts) * 100, 2)
            : 0.0;

        $companyDividend = round(($estimatedProfit * $companyPercentage) / 100, 2);

        return [
            'totalProducts' => $totalProducts,
            'totalCosts' => $totalCosts,
            'estimatedProfit' => $estimatedProfit,
            'totalShareholderCapital' => $totalShareholderCapital,
            'companyGap' => $companyGap,
            'companyName' => $companyName,
            'shareholderDistributions' => $shareholderDistributions,
            'companyDistribution' => [
                'name' => $companyName,
                'contribution' => $companyGap,
                'percentage' => $companyPercentage,
                'dividend' => $companyDividend,
            ],
        ];
    }
}
