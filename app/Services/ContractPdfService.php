<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\ContractArticle;

class ContractPdfService
{
    public function getClauses(Contract $contract)
    {
        $property = $contract->property;
        $bloc = $property ? $property->bloc : null;
        $tranche = $bloc ? $bloc->tranche : null;
        $project = $tranche ? $tranche->project : null;

        $projectName = $project ? $project->name : 'N/A';
        $propertyName = $property ? $property->name : 'N/A';
        $area = $property ? $property->area : '0.00';
        $price = $contract->price ? number_format($contract->price, 2, ',', ' ') : '0,00';

        $articles = ContractArticle::active()
            ->orderBy('article_order', 'asc')
            ->get();

        return $articles->map(function ($article) use ($projectName, $propertyName, $area, $price) {
            $description = str_replace(
                ['{projectName}', '{propertyName}', '{area}', '{price}'],
                [$projectName, $propertyName, $area, $price],
                $article->description
            );

            return [
                'title' => $article->title,
                'description' => $description,
            ];
        })->toArray();
    }
}
