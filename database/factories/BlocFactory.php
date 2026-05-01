<?php

namespace Database\Factories;

use App\Models\Bloc;
use App\Models\Tranche;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Bloc>
 */
class BlocFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'tranche_id' => Tranche::factory(),
            'floors' => rand(1, 10),
            'units' => rand(5, 50),
            'status' => 'active',
        ];
    }
}
