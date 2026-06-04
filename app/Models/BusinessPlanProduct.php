<?php

namespace App\Models;

use Database\Factories\BusinessPlanProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['product_type', 'land_size', 'unit_price', 'amount', 'description', 'bloc_id', 'created_by', 'updated_by'])]
class BusinessPlanProduct extends Model
{
    /** @use HasFactory<BusinessPlanProductFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'land_size' => 'decimal:2',
            'unit_price' => 'decimal:2',
            'amount' => 'decimal:2',
        ];
    }

    public function bloc(): BelongsTo
    {
        return $this->belongsTo(Bloc::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
