<?php

use App\Models\Property;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$properties = Property::where('bloc_id', 13)->get(['id', 'name', 'status']);
foreach ($properties as $p) {
    $status = is_object($p->status) ? $p->status->value : $p->status;
    echo "ID: {$p->id}, Name: {$p->name}, Status: {$status}\n";
}
