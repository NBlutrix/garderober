<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ItemController;
use App\Http\Controllers\API\OutfitController;
use App\Http\Controllers\AuthController;

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

    // Specijalna ruta za predlog outfita na osnovu event_type i temperature
    Route::get('outfits/suggest', [OutfitController::class, 'suggest']);

    // Primer dodatnih ruta za paginaciju/pretragu/filter
    // Route::get('items/search', [ItemController::class, 'search']);
    // Route::get('outfits/filter', [OutfitController::class, 'filter']);
});
