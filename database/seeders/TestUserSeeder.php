<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => Hash::make('test123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
    }
}
