<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ItemController;
use App\Http\Controllers\API\OutfitController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WeatherController;

// 🌤 Ruta za vremensku prognozu (nezaštićena)
Route::get('/weather', [WeatherController::class, 'getWeather']);

// 🔐 Autentifikacija korisnika
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

//  Ruta za dobijanje podataka o prijavljenom korisniku
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//  Zaštićene CRUD rute i specijalne rute za outfite i iteme
Route::middleware(['auth:sanctum', 'role:admin,user'])->group(function () {

    //  Specijalna ruta za predlog outfita
    // VAŽNO: mora biti pre apiResource, da je Laravel ne prepozna kao {outfit} parametar
    Route::get('outfits/suggest', [OutfitController::class, 'suggest']);

    // Resource rute za Outfit
    Route::apiResource('outfits', OutfitController::class);

    // Resource rute za Item
    Route::apiResource('items', ItemController::class);

  
});
