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

// 🔐 Autentifikacija korisnika (register, login, logout)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// 👤 Ruta za dobijanje podataka o prijavljenom korisniku
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// 🔒 Zaštićene rute — dostupne samo autentifikovanim korisnicima sa rolom admin ili user
Route::middleware(['auth:sanctum', 'role:admin,user'])->group(function () {
    Route::apiResource('items', ItemController::class);
    Route::apiResource('outfits', OutfitController::class);
});
