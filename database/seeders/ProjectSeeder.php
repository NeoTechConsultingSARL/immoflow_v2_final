<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing projects to avoid duplicates if running multiple times
        Project::truncate();

        $projects = [
            [
                'name' => 'Residenz am Englischen Garten',
                'company_name' => 'Keller Immobilien GmbH',
                'address' => 'Lerchenfeldstraße 11, Munich',
                'description' => 'Luxury residential complex with 24 units, underground parking, and rooftop terrace.',
                'status' => 'In Progress',
                'budget' => '€12.5M',
                'start_date' => 'Jan 2025',
                'units' => 24,
                'property_allocations' => [['propertyType' => 'Apartments', 'units' => 20], ['propertyType' => 'Parking Lots', 'units' => 4]],
            ],
            [
                'name' => 'Spree Lofts',
                'company_name' => 'BerlinWohnen AG',
                'address' => 'Köpenicker Str. 40, Berlin',
                'description' => 'Industrial loft conversion into modern living spaces along the Spree river.',
                'status' => 'Planning',
                'budget' => '€8.2M',
                'start_date' => 'Apr 2026',
                'units' => 18,
                'property_allocations' => [['propertyType' => 'Apartments', 'units' => 18]],
            ],
            [
                'name' => 'Alster Terrassen',
                'company_name' => 'Hanseatische Hausverwaltung',
                'address' => 'An der Alster 28, Hamburg',
                'description' => 'Waterfront apartments with panoramic views of the Alster lake.',
                'status' => 'Completed',
                'budget' => '€15.0M',
                'start_date' => 'Mar 2023',
                'units' => 36,
                'property_allocations' => [['propertyType' => 'Apartments', 'units' => 30], ['propertyType' => 'Villas', 'units' => 6]],
            ],
            [
                'name' => 'Maintor Quartier',
                'company_name' => 'Rhein-Main Properties',
                'address' => 'Mainzer Landstraße 78, Frankfurt',
                'description' => 'Mixed-use development combining office and residential space in the financial district.',
                'status' => 'In Progress',
                'budget' => '€22.0M',
                'start_date' => 'Sep 2024',
                'units' => 42,
                'property_allocations' => [['propertyType' => 'Offices', 'units' => 20], ['propertyType' => 'Apartments', 'units' => 22]],
            ],
            [
                'name' => 'Viktualien Höfe',
                'company_name' => 'Keller Immobilien GmbH',
                'address' => 'Frauenstraße 9, Munich',
                'description' => 'Boutique residential project near the Viktualienmarkt with traditional Bavarian charm.',
                'status' => 'On Hold',
                'budget' => '€6.8M',
                'start_date' => 'Jul 2025',
                'units' => 12,
                'property_allocations' => [['propertyType' => 'Apartments', 'units' => 12]],
            ],
            [
                'name' => 'Prenzlauer Berg Studios',
                'company_name' => 'BerlinWohnen AG',
                'address' => 'Schönhauser Allee 55, Berlin',
                'description' => 'Compact studio apartments designed for young professionals and creatives.',
                'status' => 'Planning',
                'budget' => '€4.1M',
                'start_date' => 'Jun 2026',
                'units' => 30,
                'property_allocations' => [['propertyType' => 'Apartments', 'units' => 30]],
            ],
        ];

        foreach ($projects as $projectData) {
            $company = Company::where('name', $projectData['company_name'])->first();
            
            if ($company) {
                Project::create([
                    'name' => $projectData['name'],
                    'company_id' => $company->id,
                    'address' => $projectData['address'],
                    'description' => $projectData['description'],
                    'status' => $projectData['status'],
                    'budget' => $projectData['budget'],
                    'start_date' => $projectData['start_date'],
                    'units' => $projectData['units'],
                    'property_allocations' => $projectData['property_allocations'],
                ]);
            }
        }
    }
}
