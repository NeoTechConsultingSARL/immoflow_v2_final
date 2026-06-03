<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class SyndicChargeType extends Model
{
    protected $fillable = [
        'nom',
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

    public function syndicCharges(): HasMany
    {
        return $this->hasMany(SyndicCharge::class);
    }
}
