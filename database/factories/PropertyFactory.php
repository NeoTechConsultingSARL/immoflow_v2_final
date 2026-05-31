<?php

namespace Database\Factories;

use App\Models\Bloc;
use App\Models\Property;
use App\Models\PropertyType;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Property::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Unité '.$this->faker->unique()->numberBetween(100, 999),
            'bloc_id' => Bloc::factory(),
            'property_type_id' => PropertyType::factory(),
            'price' => $this->faker->randomFloat(2, 50000, 500000),
            'status' => 'Disponible',
        ];
    }
}
