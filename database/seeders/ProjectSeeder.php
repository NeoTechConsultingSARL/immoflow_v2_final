<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::all();
        
        // Create some sample projects for testing cascade delete
        if ($companies->count() >= 2) {
            Project::create([
                'name' => 'Residential Complex Berlin',
                'status' => 'active',
                'company_id' => $companies[0]->id,
            ]);

            Project::create([
                'name' => 'Commercial Building Hamburg',
                'status' => 'active',
                'company_id' => $companies[0]->id,
            ]);

            Project::create([
                'name' => 'Office Tower Munich',
                'status' => 'inactive',
                'company_id' => $companies[1]->id,
            ]);
        }
    }
}
