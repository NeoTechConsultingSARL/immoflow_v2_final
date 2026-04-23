<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer les utilisateurs
        $users = [
            [
                'name' => 'Ahmed Benali',
                'email' => 'ahmed.benali@immoflow.com',
                'role' => 'admin',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Sara El Amrani',
                'email' => 'sara.elamrani@immoflow.com',
                'role' => 'manager',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Youssef Idrissi',
                'email' => 'youssef.idrissi@immoflow.com',
                'role' => 'user',
                'password' => Hash::make('password'),
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        
        $this->command->info('Users seeded successfully!');
    }
}
