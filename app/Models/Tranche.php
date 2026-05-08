<?php

namespace App\Models;

use Database\Factories\TrancheFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'project_id', 'status'])]
class Tranche extends Model
{
    /** @use HasFactory<TrancheFactory> */
    use HasFactory, SoftDeletes;

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function blocs(): HasMany
    {
        return $this->hasMany(Bloc::class);
    }
}
