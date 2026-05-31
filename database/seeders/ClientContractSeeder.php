<?php

namespace Database\Seeders;

use App\Models\Bloc;
use App\Models\Client;
use App\Models\Contract;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\Tranche;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ClientContractSeeder extends Seeder
{
    public function run(): void
    {
        Contract::query()->forceDelete();
        Client::query()->delete();

        $bloc = Bloc::first();
        if (! $bloc) {
            $bloc = Bloc::create([
                'name' => 'Bloc 1',
                'tranche_id' => Tranche::first()?->id ?? 1,
            ]);
        }

        $propertyTypeMap = [];
        foreach (PropertyType::all() as $pt) {
            $propertyTypeMap[strtolower($pt->name)] = $pt->id;
        }

        $seedingData = [
            [
                'client' => [
                    'full_name' => 'Anna Müller',
                    'email' => 'anna.mueller@email.com',
                    'phone' => '+49 170 1234567',
                    'identity_number' => 'DE-A123456',
                    'address' => 'Leopoldstraße 12, München',
                ],
                'contract' => [
                    'contract_number' => 'CT-2026-001',
                    'property_name' => 'Unit A1',
                    'property_type' => 'apartment',
                    'status' => 'active',
                    'price' => 485000,
                    'date' => '2026-01-15',
                    'payment_duration' => 2,
                    'payment_frequency' => 1,
                ],
            ],
            [
                'client' => [
                    'full_name' => 'Thomas Braun',
                    'email' => 'thomas.braun@email.com',
                    'phone' => '+49 171 2345678',
                    'identity_number' => 'DE-B234567',
                    'address' => 'Kantstraße 88, Berlin',
                ],
                'contract' => [
                    'contract_number' => 'CT-2026-002',
                    'property_name' => 'Loft 101',
                    'property_type' => 'apartment',
                    'status' => 'active',
                    'price' => 1450,
                    'date' => '2026-02-01',
                    'payment_duration' => 12,
                    'payment_frequency' => 1,
                ],
            ],
            [
                'client' => [
                    'full_name' => 'Lisa Weber',
                    'email' => 'lisa.weber@email.com',
                    'phone' => '+49 172 3456789',
                    'identity_number' => 'DE-W345678',
                    'address' => 'Hauptstraße 5, Hamburg',
                ],
                'contract' => [
                    'contract_number' => 'CT-2026-003',
                    'property_name' => 'Unit B1',
                    'property_type' => 'penthouse',
                    'status' => 'draft',
                    'price' => 25000,
                    'date' => '2026-02-10',
                    'payment_duration' => 2,
                    'payment_frequency' => 1,
                ],
            ],
            [
                'client' => [
                    'full_name' => 'Erik Hoffmann',
                    'email' => 'erik.hoffmann@email.com',
                    'phone' => '+49 173 4567890',
                    'identity_number' => 'DE-H456789',
                    'address' => 'Marienplatz 3, München',
                ],
                'contract' => [
                    'contract_number' => 'CT-2025-098',
                    'property_name' => 'Villa Rosengarten',
                    'property_type' => 'villa',
                    'status' => 'completed',
                    'price' => 2100000,
                    'date' => '2025-11-20',
                    'payment_duration' => 2,
                    'payment_frequency' => 1,
                ],
            ],
            [
                'client' => [
                    'full_name' => 'Sarah Klein',
                    'email' => 'sarah.klein@email.com',
                    'phone' => '+49 174 5678901',
                    'identity_number' => 'DE-S567890',
                    'address' => 'Sendlinger Str. 18, München',
                ],
                'contract' => [
                    'contract_number' => 'CT-2026-004',
                    'property_name' => 'Sky Penthouse',
                    'property_type' => 'penthouse',
                    'status' => 'active',
                    'price' => 1450000,
                    'date' => '2026-03-01',
                    'payment_duration' => 2,
                    'payment_frequency' => 1,
                ],
            ],
            [
                'client' => [
                    'full_name' => 'Maximilian Schwarz',
                    'email' => 'max.schwarz@email.com',
                    'phone' => '+49 175 6789012',
                    'identity_number' => 'DE-M567890',
                    'address' => 'Kaufingerstraße 15, München',
                ],
                'contract' => [
                    'contract_number' => 'CT-2026-005',
                    'property_name' => 'Office 101',
                    'property_type' => 'office',
                    'status' => 'active',
                    'price' => 3200,
                    'date' => '2026-01-01',
                    'payment_duration' => 24,
                    'payment_frequency' => 1,
                ],
            ],
            [
                'client' => [
                    'full_name' => 'Julia Fischer',
                    'email' => 'julia.fischer@email.com',
                    'phone' => '+49 176 7890123',
                    'identity_number' => 'DE-J567890',
                    'address' => 'Brienner Str. 45, München',
                ],
                'contract' => [
                    'contract_number' => 'CT-2025-076',
                    'property_name' => 'Studio 201',
                    'property_type' => 'studio',
                    'status' => 'cancelled',
                    'price' => 890,
                    'date' => '2025-06-01',
                    'payment_duration' => 8,
                    'payment_frequency' => 1,
                ],
            ],
            [
                'client' => [
                    'full_name' => 'Daniel Krüger',
                    'email' => 'daniel.krueger@email.com',
                    'phone' => '+49 177 8901234',
                    'identity_number' => 'DE-D567890',
                    'address' => 'Theatinerstraße 8, München',
                ],
                'contract' => [
                    'contract_number' => 'CT-2026-006',
                    'property_name' => 'Plot B-7',
                    'property_type' => 'land',
                    'status' => 'draft',
                    'price' => 480000,
                    'date' => '2026-02-20',
                    'payment_duration' => 2,
                    'payment_frequency' => 1,
                ],
            ],
        ];

        foreach ($seedingData as $data) {
            $client = Client::firstOrCreate(
                ['email' => $data['client']['email']],
                [
                    'full_name' => $data['client']['full_name'],
                    'phone' => $data['client']['phone'],
                    'identity_number' => $data['client']['identity_number'],
                    'address' => $data['client']['address'],
                    'type' => 'individual',
                ]
            );

            $c = $data['contract'];
            $property = Property::where('name', $c['property_name'])->first();

            if (! $property) {
                $typeId = $propertyTypeMap[strtolower($c['property_type'])] ?? null;
                if (! $typeId) {
                    $pt = PropertyType::firstOrCreate(
                        ['name' => ucfirst($c['property_type'])]
                    );
                    $typeId = $pt->id;
                    $propertyTypeMap[strtolower($c['property_type'])] = $typeId;
                }

                $property = Property::create([
                    'name' => $c['property_name'],
                    'bloc_id' => $bloc->id,
                    'property_type_id' => $typeId,
                    'price' => $c['price'],
                    'status' => $c['status'] === 'active' ? 'sold' : 'available',
                ]);
            }

            Contract::create([
                'client_id' => $client->id,
                'property_id' => $property->id,
                'contract_number' => $c['contract_number'],
                'status' => $c['status'],
                'price' => $c['price'],
                'date' => Carbon::parse($c['date']),
                'payment_duration' => $c['payment_duration'],
                'payment_frequency' => $c['payment_frequency'],
            ]);
        }
    }
}
