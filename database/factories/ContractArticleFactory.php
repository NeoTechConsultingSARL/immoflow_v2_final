<?php

namespace Database\Factories;

use App\Models\ContractArticle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContractArticle>
 */
class ContractArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => 'ARTICLE '.fake()->unique()->numberBetween(1, 100),
            'description' => fake()->paragraph(),
            'article_order' => fake()->unique()->numberBetween(1, 100),
            'status' => fake()->randomElement(['active', 'inactive']),
        ];
    }
}
