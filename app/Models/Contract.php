<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'property_id',
        'status',
        'price',
        'date',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'date' => 'date',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Scope a query to only include contracts of a given company.
     */
    public function scopeByCompany(Builder $query, int $companyId): Builder
    {
        return $query->whereHas('property.bloc.tranche.project', function ($q) use ($companyId) {
            $q->where('company_id', $companyId);
        });
    }

    /**
     * Scope a query to only include contracts of a given project.
     */
    public function scopeByProject(Builder $query, int $projectId): Builder
    {
        return $query->whereHas('property.bloc.tranche', function ($q) use ($projectId) {
            $q->where('project_id', $projectId);
        });
    }
}
