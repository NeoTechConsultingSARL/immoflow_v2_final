<?php

namespace Database\Seeders;

use App\Models\BusinessPlanCostType;
use App\Models\BusinessPlanProductType;
use Illuminate\Database\Seeder;

class BusinessPlanTypeSeeder extends Seeder
{
    public function run(): void
    {
        $costTypes = [
            "PRIX D'ACHAT DE TERRAIN",
            'AGENCE URBAINE',
            'ARCHITECTE',
            'AUTORISATION',
            'CONSTRUCTION 1ER ETAGE',
            'CONSTRUCTION 2EME ETAGE',
            'FRAIS DIVERS',
        ];

        foreach ($costTypes as $name) {
            BusinessPlanCostType::firstOrCreate(['name' => $name]);
        }

        $productTypes = [
            'APPARTEMENT VENDU',
            'LOCAL COMMERCIAL MZN',
            'PARKING',
            'VILLA',
            'BUREAU',
        ];

        foreach ($productTypes as $name) {
            BusinessPlanProductType::firstOrCreate(['name' => $name]);
        }
    }
}
