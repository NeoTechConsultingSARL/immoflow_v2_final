<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BusinessPlanTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productTypes = [
            ['name' => 'Vente Appartements'],
            ['name' => 'Vente Magasins'],
            ['name' => 'Vente Caves'],
            ['name' => 'Vente Parkings'],
            ['name' => 'Vente Lots de Terrain'],
            ['name' => 'Autres Recettes'],
        ];

        $costTypes = [
            ['name' => 'Achat Terrain'],
            ['name' => 'Frais Notaire & Enregistrement'],
            ['name' => 'Construction & Gros Oeuvres'],
            ['name' => 'Finition'],
            ['name' => 'Frais Architecte & BET'],
            ['name' => 'Taxes & Impôts'],
            ['name' => 'Marketing & Commercialisation'],
            ['name' => 'Imprévus / Divers'],
        ];

        DB::table('business_plan_product_types')->insertOrIgnore(
            array_map(fn($item) => array_merge($item, ['created_at' => now(), 'updated_at' => now()]), $productTypes)
        );

        DB::table('business_plan_cost_types')->insertOrIgnore(
            array_map(fn($item) => array_merge($item, ['created_at' => now(), 'updated_at' => now()]), $costTypes)
        );
    }
}
