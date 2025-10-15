<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ItemController;
use App\Http\Controllers\API\OutfitController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Ovde registruješ sve API rute aplikacije.
| Laravel ih automatski učitava preko RouteServiceProvider-a
| i prefiksira sa /api.
|
*/

// 🔐 Autentifikacija korisnika
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// 👤 Ruta za dobijanje podataka o prijavljenom korisniku
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// 🔒 Zaštićene CRUD rute za item i outfit resurse
Route::middleware(['auth:sanctum', 'role:admin,user'])->group(function () {
    // Resource rute za Item
    Route::apiResource('items', ItemController::class);

    // Resource rute za Outfit
    Route::apiResource('outfits', OutfitController::class);

    // Ako želiš da dodaš rute za paginaciju, filtriranje ili specijalne akcije:
    // Route::get('items/search', [ItemController::class, 'search']);
    // Route::get('outfits/recommend', [OutfitController::class, 'recommend']);
});
