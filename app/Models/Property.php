<?php

namespace App\Models;

use Database\Factories\PropertyFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'bloc_id', 'property_type_id', 'price', 'status'])]
class Property extends Model
{
    use HasFactory;

    /** @use HasFactory<PropertyFactory> */
    use HasFactory, SoftDeletes;

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function bloc(): BelongsTo
    {
        return $this->belongsTo(Bloc::class);
    }

    public function propertyType(): BelongsTo
    {
        return $this->belongsTo(PropertyType::class, 'property_type_id');
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
}
