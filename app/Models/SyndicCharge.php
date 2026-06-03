<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class SyndicCharge extends Model
{
    protected $fillable = [
        'syndic_charge_type_id',
        'date_operation',
        'montant',
        'designation',
        'societe',
        'bloc_id',
        'created_by',
        'updated_by',
    ];

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (empty($model->created_by)) {
                $model->created_by = Auth::id();
            }
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }

    public function bloc(): BelongsTo
    {
        return $this->belongsTo(Bloc::class);
    }

    public function syndicChargeType(): BelongsTo
    {
        return $this->belongsTo(SyndicChargeType::class);
    }
}
