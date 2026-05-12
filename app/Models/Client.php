<?php

namespace App\Models;

use App\Enums\ClientType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'identity_number',
        'address',
        'type',
    ];

    protected $casts = [
        'type' => ClientType::class,
    ];

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
}
