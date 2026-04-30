<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Ahmed Benali',
            'email' => 'ahmed.benali@immoflow.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Sara El Amrani',
            'email' => 'sara.elamrani@immoflow.com',
            'password' => bcrypt('password'),
            'role' => 'manager',
        ]);

        User::factory()->create([
            'name' => 'Youssef Idrissi',
            'email' => 'youssef.idrissi@immoflow.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        $this->call([
            CompanySeeder::class,
        ]);
    }
}
