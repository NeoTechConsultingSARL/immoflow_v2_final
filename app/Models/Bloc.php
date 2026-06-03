<?php

namespace App\Models;

use Database\Factories\BlocFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'tranche_id', 'floors', 'units', 'status'])]
class Bloc extends Model
{
    use HasFactory;

    /** @use HasFactory<BlocFactory> */
    use HasFactory, SoftDeletes;

    public function tranche(): BelongsTo
    {
        return $this->belongsTo(Tranche::class);
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    public function shareholders(): HasMany
    {
        return $this->hasMany(Shareholder::class);
    }
}
