<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Outfit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OutfitController extends Controller
{
    // Prikazuje sve outfite ulogovanog korisnika
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);

        $outfits = Outfit::where('user_id', Auth::id())
            ->with('items')
            ->paginate($perPage);

        return response()->json($outfits, 200);
    }

    // Kreira novi outfit
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_type' => 'nullable|string|max:255',
            'item_ids' => 'nullable|array',
            'item_ids.*' => 'exists:items,id',
        ]);

        $validated['user_id'] = Auth::id();
        $outfit = Outfit::create($validated);

        if (!empty($validated['item_ids'])) {
            $outfit->items()->sync($validated['item_ids']);
        }

        return response()->json($outfit->load('items'), 201);
    }

    // Prikazuje jedan outfit
    public function show($id)
    {
        $outfit = Outfit::where('user_id', Auth::id())->with('items')->findOrFail($id);
        return response()->json($outfit, 200);
    }

    // Ažurira outfit
    public function update(Request $request, $id)
    {
        $outfit = Outfit::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'event_type' => 'nullable|string|max:255',
            'item_ids' => 'nullable|array',
            'item_ids.*' => 'exists:items,id',
        ]);

        $outfit->update($validated);

        if (isset($validated['item_ids'])) {
            $outfit->items()->sync($validated['item_ids']);
        }

        return response()->json($outfit->load('items'), 200);
    }

    // Briše outfit
    public function destroy($id)
    {
        $outfit = Outfit::where('user_id', Auth::id())->findOrFail($id);
        $outfit->items()->detach();
        $outfit->delete();

        return response()->json(['message' => 'Outfit deleted successfully'], 200);
    }

    public function suggest(Request $request)
{
    $user = $request->user();
    $eventType = $request->query('event_type');
    $temperature = floatval($request->query('temperature'));

    $query = Outfit::with('items')->where('user_id', $user->id);

    if ($eventType) {
        $query->where('event_type', $eventType);
    }

    $outfits = $query->get()->filter(function ($outfit) use ($temperature) {
        // Odredi sezonu na osnovu temperature
        $season = match (true) {
            $temperature < 10 => 'winter',
            $temperature >= 10 && $temperature < 15 => 'autumn',
            $temperature >= 15 && $temperature < 24 => 'spring',
            $temperature >= 24 => 'summer',
            default => 'all',
        };

        // Outfit je validan samo ako svi itemi imaju season == trenutna sezona ili 'all'
        return $outfit->items->every(function ($item) use ($season) {
            return in_array($item->season, [$season, 'all']);
        });
    });

    return response()->json($outfits->values(), 200);
}

}
