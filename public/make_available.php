<?php

use App\Models\Property;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$prop = Property::find(93);
if ($prop) {
    $prop->status = 'available';
    $prop->save();
    echo "Property 93 ({$prop->name}) is now AVAILABLE!\n";
} else {
    echo "Property 93 not found.\n";
}

$prop2 = Property::find(117);
if ($prop2) {
    $prop2->status = 'available';
    $prop2->save();
    echo "Property 117 ({$prop2->name}) is now AVAILABLE!\n";
}
