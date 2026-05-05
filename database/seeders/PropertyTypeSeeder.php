<?php

namespace Database\Seeders;

use App\Models\PropertyType;
use Illuminate\Database\Seeder;

class PropertyTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['name' => 'Apartment', 'description' => 'Residential apartment units', 'icon' => 'Building'],
            ['name' => 'Villa', 'description' => 'Detached luxury villas', 'icon' => 'Home'],
            ['name' => 'Land', 'description' => 'Vacant land plots', 'icon' => 'MapPin'],
            ['name' => 'Duplex', 'description' => 'Two-level residential units', 'icon' => 'Building2'],
            ['name' => 'Store', 'description' => 'Commercial retail spaces', 'icon' => 'Store'],
            ['name' => 'Office', 'description' => 'Business office spaces', 'icon' => 'Briefcase'],
            ['name' => 'Penthouse', 'description' => 'Luxury top-floor apartments', 'icon' => 'Star'],
            ['name' => 'Studio', 'description' => 'Single-room apartments', 'icon' => 'Bed'],
        ];

        foreach ($types as $type) {
            PropertyType::updateOrCreate(
                ['name' => $type['name']],
                $type
            );
        }
    }
}
