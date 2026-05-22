<?php

namespace App\Models;

use Database\Factories\ParkingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['name', 'status', 'bloc_id'])]
class Parking extends Model
{
    /** @use HasFactory<ParkingFactory> */
    use HasFactory;

    protected $attributes = [
        'status' => 'free',
    ];

    public function bloc(): BelongsTo
    {
        return $this->belongsTo(Bloc::class);
    }
}
