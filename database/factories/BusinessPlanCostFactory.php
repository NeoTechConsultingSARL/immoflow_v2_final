<?php

namespace Database\Factories;

use App\Models\Bloc;
use App\Models\BusinessPlanCost;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BusinessPlanCost>
 */
class BusinessPlanCostFactory extends Factory
{
    protected $model = BusinessPlanCost::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $landSize = $this->faker->randomFloat(2, 100, 5000);
        $unitPrice = $this->faker->randomFloat(2, 1000, 10000);

        return [
            'cost_type' => 'CONSTRUCTION 1ER ETAGE',
            'land_size' => $landSize,
            'unit_price' => $unitPrice,
            'amount' => round($landSize * $unitPrice, 2),
            'description' => null,
            'bloc_id' => Bloc::factory(),
        ];
    }
}
