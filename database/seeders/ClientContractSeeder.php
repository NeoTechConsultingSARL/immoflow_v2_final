<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Contract;
use App\Models\Property;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ClientContractSeeder extends Seeder
{
    public function run(): void
    {
        // Ajouter 3 Clients
        $client1 = Client::create([
            'full_name' => 'Fatima Zzahrae Astitou',
            'email' => 'astitouf9@gmail.com',
            'phone' => '+212644477573',
            'identity_number' => 'KB123456',
            'address' => '123 Rue de la Liberté, Tanger',
        ]);

        $client2 = Client::create([
            'full_name' => 'Yassine Mounir',
            'email' => 'yassine.m@example.com',
            'phone' => '+212611223344',
            'identity_number' => 'AB987654',
            'address' => '45 Avenue Hassan II, Casablanca',
        ]);

        $client3 = Client::create([
            'full_name' => 'Sara Alaoui',
            'email' => 'sara.alaoui@example.com',
            'phone' => '+212699887766',
            'identity_number' => 'CD456123',
            'address' => '12 Boulevard Mohammed V, Rabat',
        ]);

        // Récupérer 3 propriétés disponibles
        $properties = Property::take(3)->get();

        if ($properties->count() >= 1) {
            Contract::create([
                'client_id' => $client1->id,
                'property_id' => $properties[0]->id,
                'status' => 'completed',
                'price' => $properties[0]->price * 0.9,
                'date' => Carbon::now()->subDays(10),
            ]);
        }

        if ($properties->count() >= 2) {
            Contract::create([
                'client_id' => $client2->id,
                'property_id' => $properties[1]->id,
                'status' => 'active',
                'price' => $properties[1]->price,
                'date' => Carbon::now()->subDays(5),
            ]);
        }

        if ($properties->count() >= 3) {
            Contract::create([
                'client_id' => $client3->id,
                'property_id' => $properties[2]->id,
                'status' => 'draft',
                'price' => $properties[2]->price,
                'date' => Carbon::now(),
            ]);
        }
    }
}
