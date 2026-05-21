<?php

namespace App\Console\Commands;

use App\Models\Client;
use Illuminate\Console\Command;

class TestClients extends Command
{
    protected $signature = 'test:clients';

    protected $description = 'Test client functionality';

    public function handle()
    {
        try {
            $this->info('Testing Client model...');

            // Test basic query
            $count = Client::count();
            $this->info("Found {$count} clients in database");

            // Test pagination
            $clients = Client::latest()->paginate(10);
            $this->info('Pagination works: '.$clients->count().' clients loaded');

            // Test first client
            $firstClient = Client::first();
            if ($firstClient) {
                $this->info('First client: '.$firstClient->full_name);
            }

            $this->info('All tests passed!');

            return 0;
        } catch (\Exception $e) {
            $this->error('Error: '.$e->getMessage());

            return 1;
        }
    }
}
