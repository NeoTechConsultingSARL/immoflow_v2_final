<?php

namespace Database\Seeders;

use App\Models\Bloc;
use App\Models\Property;
use App\Models\PropertyType;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing blocs and property types
        $blocs = Bloc::with(['tranche.project'])->get();
        $propertyTypes = PropertyType::all();

        // Create a mapping for property types
        $typeMap = [];
        foreach ($propertyTypes as $type) {
            $typeMap[strtolower($type->name)] = $type->id;
        }

        // Map old type names to new type IDs
        $typeMapping = [
            'apartment' => $typeMap['apartment'] ?? null,
            'villa' => $typeMap['villa'] ?? null,
            'land' => $typeMap['land'] ?? null,
            'duplex' => $typeMap['duplex'] ?? null,
            'store' => $typeMap['store'] ?? null,
            'office' => $typeMap['office'] ?? null,
            'penthouse' => $typeMap['penthouse'] ?? null,
            'studio' => $typeMap['studio'] ?? null,
        ];

        // Distribute properties across all available blocs
        if ($blocs->isEmpty()) {
            $this->command->warn('No blocs found. Please create blocs first.');

            return;
        }

        // Old dummy data from Properties.tsx
        $oldProperties = [
            // Apartments
            ['name' => 'Unit A1', 'type' => 'apartment', 'price' => 485000, 'status' => 'sold'],
            ['name' => 'Loft 101', 'type' => 'apartment', 'price' => 390000, 'status' => 'available'],
            ['name' => 'Unit 302', 'type' => 'apartment', 'price' => 520000, 'status' => 'available'],
            ['name' => 'Skyline A1', 'type' => 'apartment', 'price' => 680000, 'status' => 'available'],
            ['name' => 'Unit C3', 'type' => 'apartment', 'price' => 395000, 'status' => 'reserved'],
            // Villas
            ['name' => 'Villa Rosengarten', 'type' => 'villa', 'price' => 2100000, 'status' => 'available'],
            ['name' => 'Villa am Ufer', 'type' => 'villa', 'price' => 1850000, 'status' => 'reserved'],
            ['name' => 'Alster Villa', 'type' => 'villa', 'price' => 2500000, 'status' => 'sold'],
            ['name' => 'Main Villa', 'type' => 'villa', 'price' => 1950000, 'status' => 'available'],
            ['name' => 'Villa Sonnenhof', 'type' => 'villa', 'price' => 2250000, 'status' => 'available'],
            // Land
            ['name' => 'Plot A-12', 'type' => 'land', 'price' => 320000, 'status' => 'available'],
            ['name' => 'Plot B-7', 'type' => 'land', 'price' => 480000, 'status' => 'sold'],
            ['name' => 'Waterfront Plot', 'type' => 'land', 'price' => 890000, 'status' => 'reserved'],
            ['name' => 'Corner Plot C3', 'type' => 'land', 'price' => 410000, 'status' => 'available'],
            ['name' => 'Garden Plot D1', 'type' => 'land', 'price' => 290000, 'status' => 'available'],
            // Duplexes
            ['name' => 'Unit B2', 'type' => 'duplex', 'price' => 720000, 'status' => 'available'],
            ['name' => 'Skyline B3', 'type' => 'duplex', 'price' => 950000, 'status' => 'sold'],
            ['name' => 'Spree Duplex 1', 'type' => 'duplex', 'price' => 680000, 'status' => 'available'],
            ['name' => 'Terrace Duplex', 'type' => 'duplex', 'price' => 820000, 'status' => 'reserved'],
            ['name' => 'Garden Duplex', 'type' => 'duplex', 'price' => 650000, 'status' => 'available'],
            // Stores
            ['name' => 'Shop A1', 'type' => 'store', 'price' => 280000, 'status' => 'available'],
            ['name' => 'Retail Space 1', 'type' => 'store', 'price' => 520000, 'status' => 'sold'],
            ['name' => 'Corner Shop', 'type' => 'store', 'price' => 350000, 'status' => 'available'],
            ['name' => 'Main Street Shop', 'type' => 'store', 'price' => 410000, 'status' => 'reserved'],
            ['name' => 'Boutique B2', 'type' => 'store', 'price' => 220000, 'status' => 'available'],
            // Offices
            ['name' => 'Office 101', 'type' => 'office', 'price' => 450000, 'status' => 'available'],
            ['name' => 'Co-Working Suite', 'type' => 'office', 'price' => 780000, 'status' => 'reserved'],
            ['name' => 'Executive Office', 'type' => 'office', 'price' => 620000, 'status' => 'sold'],
            ['name' => 'Skyline Office', 'type' => 'office', 'price' => 850000, 'status' => 'available'],
            ['name' => 'Studio Office', 'type' => 'office', 'price' => 320000, 'status' => 'available'],
            // Penthouses
            ['name' => 'Unit B1', 'type' => 'penthouse', 'price' => 1250000, 'status' => 'reserved'],
            ['name' => 'Terrace Suite 1', 'type' => 'penthouse', 'price' => 1800000, 'status' => 'reserved'],
            ['name' => 'Sky Penthouse', 'type' => 'penthouse', 'price' => 1450000, 'status' => 'available'],
            ['name' => 'Main Penthouse', 'type' => 'penthouse', 'price' => 2200000, 'status' => 'sold'],
            ['name' => 'Garden Penthouse', 'type' => 'penthouse', 'price' => 1380000, 'status' => 'available'],
            // Studios
            ['name' => 'Unit A2', 'type' => 'studio', 'price' => 245000, 'status' => 'available'],
            ['name' => 'Loft 201', 'type' => 'studio', 'price' => 275000, 'status' => 'sold'],
            ['name' => 'Compact Studio', 'type' => 'studio', 'price' => 195000, 'status' => 'available'],
            ['name' => 'City Studio', 'type' => 'studio', 'price' => 230000, 'status' => 'reserved'],
            ['name' => 'Garden Studio', 'type' => 'studio', 'price' => 260000, 'status' => 'available'],
        ];

        // Clear existing properties
        Property::query()->delete();

        // Distribute properties across blocs
        $blocIndex = 0;
        foreach ($oldProperties as $prop) {
            $propertyTypeId = $typeMapping[$prop['type']] ?? $typeMapping['apartment'];
            $bloc = $blocs[$blocIndex % $blocs->count()];

            if ($propertyTypeId) {
                Property::create([
                    'name' => $prop['name'],
                    'bloc_id' => $bloc->id,
                    'property_type_id' => $propertyTypeId,
                    'price' => $prop['price'],
                    'status' => $prop['status'],
                ]);
            }

            $blocIndex++;
        }

        $this->command->info('Seeded '.count($oldProperties).' properties.');
    }
}
