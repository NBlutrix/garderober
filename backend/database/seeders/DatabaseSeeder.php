<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Item;
use App\Models\Outfit;
use Illuminate\Support\Facades\DB;

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

        // 👕 Dodaj nekoliko itema za korisnike
        $adminItems = Item::factory(10)->create(['user_id' => $admin->id]);
        $userItems = Item::factory(10)->create(['user_id' => $user->id]);

        // 👗 Outfit-i sa event_type i povezani sa itemima
        $outfits = [
            ['title' => 'Winter Casual', 'description' => 'Warm winter outfit for casual events', 'event_type' => 'casual'],
            ['title' => 'Summer Party', 'description' => 'Light outfit for a summer party', 'event_type' => 'party'],
            ['title' => 'Spring Work', 'description' => 'Professional outfit for work in spring', 'event_type' => 'work'],
        ];

        foreach ($outfits as $data) {
            $outfit = Outfit::create(array_merge($data, ['user_id' => $user->id]));
            
            // Poveži outfit sa nekoliko itema istog korisnika
            $randomItems = $userItems->random(3)->pluck('id')->toArray();
            $outfit->items()->sync($randomItems);
        }

        // Možeš isto dodati i za admina
        foreach ($outfits as $data) {
            $outfit = Outfit::create(array_merge($data, ['user_id' => $admin->id]));
            $randomItems = $adminItems->random(3)->pluck('id')->toArray();
            $outfit->items()->sync($randomItems);
        }
    }
}
