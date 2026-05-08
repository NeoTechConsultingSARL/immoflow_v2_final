<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'identity_number',
        'address',
        'type',
    ];

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
}
