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

        // 👕 Dodaj nekoliko itema i outfita za korisnike
        Item::factory(10)->create(['user_id' => $admin->id]);
        Item::factory(10)->create(['user_id' => $user->id]);

        Outfit::factory(5)->create(['user_id' => $admin->id]);
        Outfit::factory(5)->create(['user_id' => $user->id]);
    }
}
