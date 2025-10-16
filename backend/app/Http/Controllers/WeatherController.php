<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function getWeather(Request $request)
    {
        $city = $request->query('city', 'Belgrade');
        $apiKey = env('OPENWEATHER_API_KEY'); // dodaj u .env

        $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
            'q' => $city,
            'units' => 'metric',
            'appid' => $apiKey,
        ]);

        return response()->json($response->json());
    }
}
