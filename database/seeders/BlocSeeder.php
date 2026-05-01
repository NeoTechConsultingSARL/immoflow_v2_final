<?php

namespace Database\Seeders;

use App\Models\Bloc;
use App\Models\Tranche;
use Illuminate\Database\Seeder;

class BlocSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Bloc::truncate();

        $tranches = Tranche::all();

        if ($tranches->isEmpty()) {
            return;
        }

        foreach ($tranches as $tranche) {
            Bloc::create([
                'name' => 'Bloc 1',
                'tranche_id' => $tranche->id,
                'floors' => rand(3, 10),
                'units' => rand(20, 60),
                'status' => 'active',
            ]);

            Bloc::create([
                'name' => 'Bloc 2',
                'tranche_id' => $tranche->id,
                'floors' => rand(3, 10),
                'units' => rand(20, 60),
                'status' => 'active',
            ]);
        }
    }
}
