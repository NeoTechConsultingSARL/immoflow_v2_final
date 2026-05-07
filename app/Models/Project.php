<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'description', 'address', 'budget', 'start_date', 'units', 'status', 'company_id', 'property_allocations'])]
class Project extends Model
{
    use HasFactory;

    protected $casts = [
        'property_allocations' => 'array',
    ];

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    protected $attributes = [
        'status' => self::STATUS_ACTIVE,
    ];

    /**
     * Get the company that owns the project.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Check if the project is active.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Check if the project is inactive.
     */
    public function isInactive(): bool
    {
        return $this->status === self::STATUS_INACTIVE;
    }

    /**
     * Get the tranches for the project.
     */
    public function tranches(): HasMany
    {
        return $this->hasMany(Tranche::class);
    }
}
