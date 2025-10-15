<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Outfit;
use App\Models\Item;

class OutfitController extends Controller
{
    // GET /api/outfits
    public function index()
    {
        // vraća sve outfite sa pripadajućim itemima
        return response()->json(Outfit::with('items')->get());
    }

    // POST /api/outfits
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'item_ids' => 'array', // očekujemo niz item ID-jeva
            'item_ids.*' => 'exists:items,id'
        ]);

        $outfit = Outfit::create([
            'user_id' => $validated['user_id'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        // ako postoje item_ids, poveži ih u pivot tabeli
        if (!empty($validated['item_ids'])) {
            $outfit->items()->attach($validated['item_ids']);
        }

        return response()->json($outfit->load('items'), 201);
    }

    // GET /api/outfits/{id}
    public function show($id)
    {
        $outfit = Outfit::with('items')->findOrFail($id);
        return response()->json($outfit);
    }

    // PUT /api/outfits/{id}
    public function update(Request $request, $id)
    {
        $outfit = Outfit::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'item_ids' => 'array',
            'item_ids.*' => 'exists:items,id'
        ]);

        $outfit->update($validated);

        if (isset($validated['item_ids'])) {
            // sinhronizuje pivot relaciju
            $outfit->items()->sync($validated['item_ids']);
        }

        return response()->json($outfit->load('items'));
    }

    // DELETE /api/outfits/{id}
    public function destroy($id)
    {
        $outfit = Outfit::findOrFail($id);
        $outfit->items()->detach(); // briše veze iz pivot tabele
        $outfit->delete();

        return response()->json(['message' => 'Outfit deleted successfully']);
    }
}
