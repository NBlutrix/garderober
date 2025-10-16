<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Outfit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OutfitController extends Controller
{
    // Prikazuje sve outfite ulogovanog korisnika
    public function index()
    {
        $outfits = Outfit::where('user_id', Auth::id())
            ->with('items')
            ->get();

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

    // Predlaže outfite po event_type i temperaturi/sezoni
    public function suggest(Request $request)
    {
        $eventType = $request->query('event_type');
        $temperature = floatval($request->query('temperature', 0));

        $query = Outfit::with('items')->where('user_id', Auth::id());

        if ($eventType) {
            $query->whereRaw('LOWER(event_type) = ?', [strtolower($eventType)]);
        }

        $outfits = $query->get()->filter(function ($outfit) use ($temperature) {
            // Outfit se predlaže ako bar jedan item odgovara temperaturi/sezoni
            return $outfit->items->contains(function ($item) use ($temperature) {
                switch ($item->season) {
                    case 'winter':
                        return $temperature < 10; // zima: ispod 10°C
                    case 'autumn':
                        return $temperature >= 10 && $temperature < 15; // jesen: 10-15°C
                    case 'spring':
                        return $temperature >= 15 && $temperature < 24; // proleće: 15-24°C
                    case 'summer':
                        return $temperature >= 24; // leto: 24°C i više
                    default:
                        return true;
                }
            });
        });

        return response()->json($outfits->values(), 200);
    }
}
