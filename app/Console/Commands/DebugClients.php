<?php

namespace App\Console\Commands;

use App\Models\Client;
use Illuminate\Console\Command;
use Illuminate\Http\Request;

class DebugClients extends Command
{
    protected $signature = 'debug:clients';

    protected $description = 'Debug client controller functionality';

    public function handle()
    {
        try {
            $this->info('Debugging ClientController@index...');

            // Simulate request
            $request = new Request;

            // Test the exact same logic as in controller
            $query = Client::query();
            $this->info('Query created successfully');

            // Search functionality
            if ($request->has('search')) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('identity_number', 'like', "%{$search}%");
                });
            }

            // Filter by type
            if ($request->has('type') && $request->get('type')) {
                $query->where('type', $request->get('type'));
            }

            $clients = $query->latest()->paginate(10);
            $this->info('Clients paginated: '.$clients->count());

            // Test Inertia render data
            $data = [
                'clients' => $clients,
                'filters' => $request->only(['search', 'type']),
            ];
            $this->info('Data prepared for Inertia render');

            return 0;
        } catch (\Exception $e) {
            $this->error('Error: '.$e->getMessage());
            $this->error('File: '.$e->getFile());
            $this->error('Line: '.$e->getLine());

            return 1;
        }
    }
}
