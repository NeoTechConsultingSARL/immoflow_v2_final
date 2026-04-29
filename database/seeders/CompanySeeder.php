<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Company::create([
            'name' => 'Keller Immobilien GmbH',
            'status' => 'active',
        ]);

        Company::create([
            'name' => 'BerlinWohnen AG',
            'status' => 'active',
        ]);

        Company::create([
            'name' => 'Hanseatische Hausverwaltung',
            'status' => 'inactive',
        ]);

        Company::create([
            'name' => 'Rhein-Main Properties',
            'status' => 'active',
        ]);
    }
}
