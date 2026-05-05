<?php

namespace App\Models;

use Database\Factories\PropertyTypeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'description', 'icon'])]
class PropertyType extends Model
{
    /** @use HasFactory<PropertyTypeFactory> */
    use HasFactory;
}
