<?php

namespace Database\Factories;

use App\Models\Bloc;
use App\Models\Shareholder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Shareholder>
 */
class ShareholderFactory extends Factory
{
    protected $model = Shareholder::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'amount' => $this->faker->randomFloat(2, 1000, 500000),
            'bloc_id' => Bloc::factory(),
        ];
    }
}
