<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'address' => $this->faker->address(),
            'budget' => '€'.$this->faker->numberBetween(1, 50).'M',
            'start_date' => $this->faker->monthName().' '.$this->faker->year(),
            'units' => $this->faker->numberBetween(10, 100),
            'status' => $this->faker->randomElement(['Planning', 'In Progress', 'Completed', 'On Hold']),
            'company_id' => Company::factory(),
            'property_allocations' => [
                ['propertyType' => 'Apartments', 'units' => $this->faker->numberBetween(5, 50)],
            ],
        ];
    }
}
