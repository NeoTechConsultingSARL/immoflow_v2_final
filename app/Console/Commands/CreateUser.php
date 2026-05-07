<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

#[Signature('app:create-user')]
#[Description('Create a simple admin user for testing')]
class CreateUser extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Creating admin user...');
        
        // Delete existing users with same email
        User::where('email', 'admin@admin.com')->delete();
        
        // Create new user
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
        
        $this->info('Admin user created successfully!');
        $this->line('Email: admin@admin.com');
        $this->line('Password: admin123');
        $this->line('User ID: ' . $user->id);
        
        // Test authentication immediately
        $this->info('Testing authentication...');
        $credentials = ['email' => 'admin@admin.com', 'password' => 'admin123'];
        $authResult = \Illuminate\Support\Facades\Auth::attempt($credentials);
        $this->info('Authentication test: ' . ($authResult ? 'SUCCESS' : 'FAILED'));
        
        return 0;
    }
}
