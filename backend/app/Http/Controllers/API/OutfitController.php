<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Outfit;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OutfitController extends Controller
{
    // Prikazuje sve outfite ulogovanog korisnika
    public function index()
    {
        $outfits = Outfit::where('user_id', Auth::id())
            ->with('items') // Učitava povezane iteme
            ->get();

        return response()->json($outfits, 200);
    }

    // Kreira novi outfit
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'item_ids' => 'nullable|array', // lista item ID-jeva za outfit
            'item_ids.*' => 'exists:items,id'
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
            'item_ids' => 'nullable|array',
            'item_ids.*' => 'exists:items,id'
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
}
