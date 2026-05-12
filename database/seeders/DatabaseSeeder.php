<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        User::updateOrCreate(
            ['email' => 'ahmed.benali@immoflow.com'],
            [
                'name' => 'Ahmed Benali',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'sara.elamrani@immoflow.com'],
            [
                'name' => 'Sara El Amrani',
                'password' => bcrypt('password'),
                'role' => 'manager',
            ]
        );

        User::updateOrCreate(
            ['email' => 'youssef.idrissi@immoflow.com'],
            [
                'name' => 'Youssef Idrissi',
                'password' => bcrypt('password'),
                'role' => 'user',
            ]
        );

        $this->call([
            PropertyTypeSeeder::class,
            CompanySeeder::class,
            ProjectSeeder::class,
            TrancheSeeder::class,
            BlocSeeder::class,
            PropertySeeder::class,

            ClientSeeder::class,
        ]);

        Schema::enableForeignKeyConstraints();
    }
}
