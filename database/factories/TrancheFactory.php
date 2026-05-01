<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Tranche;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tranche>
 */
class TrancheFactory extends Factory
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
            'project_id' => Project::factory(),
            'status' => 'active',
        ];
    }
}
