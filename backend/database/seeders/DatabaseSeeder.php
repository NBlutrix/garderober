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
        // Demo korisnici
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

        // Items - obuhvataju sve sezone i tipove
        $itemData = [
            //  Summer
            ['name' => 'Blue T-Shirt', 'type' => 'shirt', 'season' => 'summer', 'color' => 'blue'],
            ['name' => 'White Shorts', 'type' => 'pants', 'season' => 'summer', 'color' => 'white'],
            ['name' => 'Flip Flops', 'type' => 'shoes', 'season' => 'summer', 'color' => 'brown'],
            ['name' => 'Summer Hat', 'type' => 'accessory', 'season' => 'summer', 'color' => 'beige'],

            //  Spring
            ['name' => 'Light Hoodie', 'type' => 'sweater', 'season' => 'spring', 'color' => 'gray'],
            ['name' => 'Chino Pants', 'type' => 'pants', 'season' => 'spring', 'color' => 'beige'],
            ['name' => 'Sneakers', 'type' => 'shoes', 'season' => 'spring', 'color' => 'white'],
            ['name' => 'Denim Jacket', 'type' => 'jacket', 'season' => 'spring', 'color' => 'blue'],

            //  Autumn
            ['name' => 'Leather Jacket', 'type' => 'jacket', 'season' => 'autumn', 'color' => 'brown'],
            ['name' => 'Dark Jeans', 'type' => 'pants', 'season' => 'autumn', 'color' => 'navy'],
            ['name' => 'Scarf', 'type' => 'accessory', 'season' => 'autumn', 'color' => 'gray'],
            ['name' => 'Chelsea Boots', 'type' => 'shoes', 'season' => 'autumn', 'color' => 'black'],

            //  Winter
            ['name' => 'Wool Sweater', 'type' => 'sweater', 'season' => 'winter', 'color' => 'red'],
            ['name' => 'Winter Jacket', 'type' => 'jacket', 'season' => 'winter', 'color' => 'black'],
            ['name' => 'Gloves', 'type' => 'accessory', 'season' => 'winter', 'color' => 'black'],
            ['name' => 'Snow Boots', 'type' => 'shoes', 'season' => 'winter', 'color' => 'brown'],

            //  All seasons
            ['name' => 'Black T-Shirt', 'type' => 'shirt', 'season' => 'all', 'color' => 'black'],
            ['name' => 'Blue Jeans', 'type' => 'pants', 'season' => 'all', 'color' => 'blue'],
            ['name' => 'White Sneakers', 'type' => 'shoes', 'season' => 'all', 'color' => 'white'],
            ['name' => 'Black Belt', 'type' => 'accessory', 'season' => 'all', 'color' => 'black'],
        ];

        // Kreiraj iteme za admina i usera
        $adminItems = collect($itemData)->map(fn($i) => Item::factory()->create(array_merge($i, ['user_id' => $admin->id])));
        $userItems = collect($itemData)->map(fn($i) => Item::factory()->create(array_merge($i, ['user_id' => $user->id])));

        //  Outfit-i za sve kombinacije sezona i događaja
        $outfitData = [
            // Winter
            ['title' => 'Winter Casual', 'description' => 'Warm casual winter outfit', 'event_type' => 'casual'],
            ['title' => 'Winter Work', 'description' => 'Professional winter work outfit', 'event_type' => 'work'],
            ['title' => 'Winter Party', 'description' => 'Cozy outfit for a winter party', 'event_type' => 'party'],
            ['title' => 'Winter Formal', 'description' => 'Elegant formal outfit for winter events', 'event_type' => 'formal'],

            //  Spring
            ['title' => 'Spring Casual', 'description' => 'Relaxed spring outfit for daily wear', 'event_type' => 'casual'],
            ['title' => 'Spring Work', 'description' => 'Light office outfit for spring', 'event_type' => 'work'],
            ['title' => 'Spring Party', 'description' => 'Colorful spring party outfit', 'event_type' => 'party'],
            ['title' => 'Spring Formal', 'description' => 'Formal outfit with spring tones', 'event_type' => 'formal'],

            //  Summer
            ['title' => 'Summer Casual', 'description' => 'Casual and light summer look', 'event_type' => 'casual'],
            ['title' => 'Summer Work', 'description' => 'Professional but comfortable outfit', 'event_type' => 'work'],
            ['title' => 'Summer Party', 'description' => 'Fun beach-style party outfit', 'event_type' => 'party'],
            ['title' => 'Summer Formal', 'description' => 'Formal outfit for summer weddings', 'event_type' => 'formal'],

            //  Autumn
            ['title' => 'Autumn Casual', 'description' => 'Warm layers for casual fall days', 'event_type' => 'casual'],
            ['title' => 'Autumn Work', 'description' => 'Office look with autumn tones', 'event_type' => 'work'],
            ['title' => 'Autumn Party', 'description' => 'Chic outfit for autumn gatherings', 'event_type' => 'party'],
            ['title' => 'Autumn Formal', 'description' => 'Formal outfit for autumn occasions', 'event_type' => 'formal'],

            //  All-season outfits
            ['title' => 'Everyday Casual', 'description' => 'Simple and comfy for all seasons', 'event_type' => 'casual'],
            ['title' => 'Universal Work', 'description' => 'Business-casual for any weather', 'event_type' => 'work'],
            ['title' => 'All-Season Party', 'description' => 'Stylish combo for any party', 'event_type' => 'party'],
            ['title' => 'Timeless Formal', 'description' => 'Elegant and season-proof outfit', 'event_type' => 'formal'],
        ];

        // Kreiraj outfite za usera i admina
        foreach ([$admin, $user] as $account) {
            $items = $account->id === $admin->id ? $adminItems : $userItems;

            foreach ($outfitData as $data) {
                $outfit = Outfit::create(array_merge($data, ['user_id' => $account->id]));
                $randomItems = $items->random(rand(3, 5))->pluck('id')->toArray();
                $outfit->items()->sync($randomItems);
            }
        }
    }
}
