<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Contract;
use App\Models\Property;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ClientContractSeeder extends Seeder
{
    public function run(): void
    {

        $client1 = Client::create([
            'full_name' => 'Yassine Mounir',
            'email' => 'yassine.m@example.com',
            'phone' => '+212611223344',
            'identity_number' => 'AB987654',
            'address' => '45 Avenue Hassan II, Casablanca',
        ]);

        $client2 = Client::create([
            'full_name' => 'Sara Alaoui',
            'email' => 'sara.alaoui@example.com',
            'phone' => '+212699887766',
            'identity_number' => 'CD456123',
            'address' => '12 Boulevard Mohammed V, Rabat',
        ]);

        $properties = Property::take(2)->get();

        if ($properties->count() >= 1) {
            Contract::create([
                'client_id' => $client1->id,
                'property_id' => $properties[0]->id,
                'status' => 'active',
                'price' => $properties[0]->price,
                'date' => Carbon::now()->subDays(5),
            ]);
        }

        if ($properties->count() >= 2) {
            Contract::create([
                'client_id' => $client2->id,
                'property_id' => $properties[1]->id,
                'status' => 'draft',
                'price' => $properties[1]->price,
                'date' => Carbon::now(),
            ]);
        }
    }
}
