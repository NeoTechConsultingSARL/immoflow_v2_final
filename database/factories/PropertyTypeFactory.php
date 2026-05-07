<?php

namespace Database\Factories;

use App\Models\PropertyType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PropertyType>
 */
class PropertyTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['Apartment', 'Villa', 'Land', 'Duplex', 'Store', 'Office', 'Penthouse', 'Studio', 'Townhouse', 'Loft'];
        $icons = ['Building', 'Home', 'MapPin', 'Building2', 'Store', 'Briefcase', 'Star', 'Bed', 'House', 'Layers'];

        return [
            'name' => fake()->unique()->randomElement($types),
            'description' => fake()->sentence(),
            'icon' => fake()->randomElement($icons),
        ];
    }
}
