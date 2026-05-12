<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$status = $kernel->call('migrate:fresh', ['--seed' => true]);
echo "Status: " . $status . "\n";
echo "Output: \n" . $kernel->output();
