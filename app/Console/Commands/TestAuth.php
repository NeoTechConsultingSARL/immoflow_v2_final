<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

#[Signature('app:test-auth')]
#[Description('Test authentication')]
class TestAuth extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing authentication...');

        $user = User::where('email', 'ahmed.benali@immoflow.com')->first();

        if (! $user) {
            $this->error('User not found!');

            return 1;
        }

        $this->info('User found:');
        $this->line('ID: '.$user->id);
        $this->line('Email: '.$user->email);
        $this->line('Name: '.$user->name);
        $this->line('Role: '.$user->role);

        // Test password verification
        $passwordCheck = Hash::check('password', $user->password);
        $this->info('Password verification: '.($passwordCheck ? 'PASS' : 'FAIL'));

        // Test authentication
        $credentials = ['email' => 'ahmed.benali@immoflow.com', 'password' => 'password'];
        $authResult = Auth::attempt($credentials);
        $this->info('Authentication test: '.($authResult ? 'SUCCESS' : 'FAILED'));

        return 0;
    }
}
