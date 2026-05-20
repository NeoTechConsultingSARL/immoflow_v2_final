<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Company>
 */
class CompanyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'description' => $this->faker->realText(100),
            'email' => $this->faker->unique()->companyEmail(),
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
            'website' => $this->faker->url(),
            'properties' => $this->faker->numberBetween(0, 100),
            'rc' => $this->faker->numerify('RC-######'),
            'if' => $this->faker->numerify('IF-######'),
            'patent' => $this->faker->numerify('PAT-######'),
            'fax' => $this->faker->phoneNumber(),
        ];
    }
}
