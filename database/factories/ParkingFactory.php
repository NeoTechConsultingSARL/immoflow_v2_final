<?php

namespace Database\Factories;

use App\Models\Bloc;
use App\Models\Parking;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Parking>
 */
class ParkingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'status' => fake()->randomElement(['free', 'reserved']),
            'bloc_id' => Bloc::factory(),
        ];
    }
}
