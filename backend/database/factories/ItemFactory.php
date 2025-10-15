<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'name' => $this->faker->word(),
            'type' => $this->faker->randomElement(['shirt', 'pants', 'jacket', 'shoes']),
            'season' => $this->faker->randomElement(['summer', 'winter', 'spring', 'autumn']),
            'warmth' => $this->faker->numberBetween(1, 10),
            'waterproof' => $this->faker->boolean(),
            'color' => $this->faker->safeColorName(),
            'image_url' => $this->faker->imageUrl(200, 200, 'clothes', true),
        ];
    }
}
