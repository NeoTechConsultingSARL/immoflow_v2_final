<?php

use App\Models\Contract;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$contract = Contract::with('client', 'property')->latest()->first();

if (! $contract) {
    echo "No contracts found in the database.\n";
    exit;
}

echo "=== LAST INSERTED CONTRACT ===\n";
echo 'ID: '.$contract->id."\n";
echo 'Contract Number: '.$contract->contract_number."\n";
echo 'Client Name: '.($contract->client->full_name ?? 'N/A')."\n";
echo 'Client Email: '.($contract->client->email ?? 'N/A')."\n";
echo 'Property Name: '.($contract->property->name ?? 'N/A')."\n";
echo 'Price: '.$contract->price."\n";
echo 'Status: '.$contract->status."\n";
echo 'Advance: '.$contract->advance."\n";
echo 'Payment Duration: '.$contract->payment_duration."\n";
echo 'Created At: '.$contract->created_at."\n";
