<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ItemController;
use App\Http\Controllers\API\OutfitController;

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

// Ruta za dobijanje podataka o prijavljenom korisniku
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ✅ Naša resource ruta za ItemController
Route::apiResource('items', ItemController::class);
// Resource ruta za OutfitController
Route::apiResource('outfits', OutfitController::class);


