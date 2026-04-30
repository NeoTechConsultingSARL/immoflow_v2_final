<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

#[Signature('app:debug-auth')]
#[Description('Debug authentication process')]
class DebugAuth extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== Authentication Debug ===');
        
        // Check user exists
        $user = User::where('email', 'admin@admin.com')->first();
        if (!$user) {
            $this->error('User not found!');
            return 1;
        }
        
        $this->info('User found:');
        $this->line('ID: ' . $user->id);
        $this->line('Email: ' . $user->email);
        $this->line('Name: ' . $user->name);
        $this->line('Role: ' . $user->role);
        
        // Check password hash
        $this->info('Password verification:');
        $this->line('Plain password: admin123');
        $this->line('Hash starts with: ' . substr($user->password, 0, 20) . '...');
        $passwordCheck = Hash::check('admin123', $user->password);
        $this->line('Hash check: ' . ($passwordCheck ? 'PASS' : 'FAIL'));
        
        // Test Auth::attempt
        $this->info('Auth::attempt test:');
        $credentials = ['email' => 'admin@admin.com', 'password' => 'admin123'];
        $this->line('Credentials: ' . json_encode($credentials));
        $authResult = Auth::attempt($credentials);
        $this->line('Result: ' . ($authResult ? 'SUCCESS' : 'FAILED'));
        
        // Check current auth user
        $this->info('Current auth user:');
        $currentUser = Auth::user();
        $this->line('Auth user: ' . ($currentUser ? $currentUser->email : 'None'));
        
        // Test manual validation
        $this->info('Manual validation test:');
        $request = new \App\Http\Requests\Auth\LoginRequest();
        $request->merge([
            'email' => 'admin@admin.com',
            'password' => 'admin123'
        ]);
        
        try {
            $request->authenticate();
            $this->line('LoginRequest authenticate: SUCCESS');
        } catch (\Exception $e) {
            $this->line('LoginRequest authenticate: FAILED - ' . $e->getMessage());
        }
        
        return 0;
    }
}
