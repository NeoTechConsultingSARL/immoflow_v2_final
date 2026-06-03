<?php

namespace Database\Factories;

use App\Models\Bloc;
use App\Models\BusinessPlanProduct;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BusinessPlanProduct>
 */
class BusinessPlanProductFactory extends Factory
{
    protected $model = BusinessPlanProduct::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $landSize = $this->faker->randomFloat(2, 50, 2000);
        $unitPrice = $this->faker->randomFloat(2, 5000, 15000);

        return [
            'product_type' => 'APPARTEMENT VENDU',
            'land_size' => $landSize,
            'unit_price' => $unitPrice,
            'amount' => round($landSize * $unitPrice, 2),
            'description' => null,
            'bloc_id' => Bloc::factory(),
        ];
    }
}
