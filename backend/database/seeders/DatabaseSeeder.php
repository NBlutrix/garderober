<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Item;
use App\Models\Outfit;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 🧍 Demo korisnici
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
        ]);

        $user = User::factory()->create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => bcrypt('user123'),
            'role' => 'user',
        ]);

        $guest = User::factory()->create([
            'name' => 'Guest User',
            'email' => 'guest@example.com',
            'password' => bcrypt('guest123'),
            'role' => 'guest',
        ]);

        // 👕 Items sa realnim nazivima i sezonama
        $itemData = [
            ['name' => 'Blue T-Shirt', 'type' => 'shirt', 'season' => 'summer', 'color' => 'blue'],
            ['name' => 'White Shirt', 'type' => 'shirt', 'season' => 'spring', 'color' => 'white'],
            ['name' => 'Black Jeans', 'type' => 'pants', 'season' => 'all', 'color' => 'black'],
            ['name' => 'Blue Jeans', 'type' => 'pants', 'season' => 'all', 'color' => 'blue'],
            ['name' => 'Winter Jacket', 'type' => 'jacket', 'season' => 'winter', 'color' => 'black'],
            ['name' => 'Leather Jacket', 'type' => 'jacket', 'season' => 'autumn', 'color' => 'brown'],
            ['name' => 'Hoodie', 'type' => 'sweater', 'season' => 'spring', 'color' => 'gray'],
            ['name' => 'Shorts', 'type' => 'pants', 'season' => 'summer', 'color' => 'khaki'],
            ['name' => 'Sweater', 'type' => 'sweater', 'season' => 'winter', 'color' => 'red'],
            ['name' => 'Summer Dress', 'type' => 'dress', 'season' => 'summer', 'color' => 'yellow'],
        ];

        // Kreiraj iteme za admina i usera
        $adminItems = collect($itemData)->map(function ($i) use ($admin) {
            return Item::factory()->create(array_merge($i, ['user_id' => $admin->id]));
        });

        $userItems = collect($itemData)->map(function ($i) use ($user) {
            return Item::factory()->create(array_merge($i, ['user_id' => $user->id]));
        });

        // 👗 Outfit-i (bez 'season' kolone)
        $outfitData = [
            ['title' => 'Winter Casual', 'description' => 'Warm casual winter outfit', 'event_type' => 'casual'],
            ['title' => 'Winter Work', 'description' => 'Professional winter work outfit', 'event_type' => 'work'],
            ['title' => 'Autumn Walk', 'description' => 'Comfy autumn outfit for a walk', 'event_type' => 'casual'],
            ['title' => 'Spring Meeting', 'description' => 'Light outfit for spring office', 'event_type' => 'work'],
            ['title' => 'Summer Party', 'description' => 'Fun outfit for summer party', 'event_type' => 'party'],
            ['title' => 'Summer Vacation', 'description' => 'Relaxed summer outfit', 'event_type' => 'casual'],
            ['title' => 'Autumn Work', 'description' => 'Formal outfit for autumn work', 'event_type' => 'work'],
            ['title' => 'Spring Casual', 'description' => 'Casual spring outfit', 'event_type' => 'casual'],
            ['title' => 'Winter Party', 'description' => 'Cozy winter outfit for party', 'event_type' => 'party'],
            ['title' => 'Summer Work', 'description' => 'Professional summer outfit', 'event_type' => 'work'],
        ];

        // Kreiraj outfit-e za usera i poveži sa itemima
        foreach ($outfitData as $data) {
            $outfit = Outfit::create(array_merge($data, ['user_id' => $user->id]));
            $randomItems = $userItems->random(3)->pluck('id')->toArray();
            $outfit->items()->sync($randomItems);
        }

        // Kreiraj outfit-e za admina i poveži sa itemima
        foreach ($outfitData as $data) {
            $outfit = Outfit::create(array_merge($data, ['user_id' => $admin->id]));
            $randomItems = $adminItems->random(3)->pluck('id')->toArray();
            $outfit->items()->sync($randomItems);
        }
    }
}
