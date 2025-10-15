<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ItemController extends Controller
{
    // Prikazuje sve iteme ulogovanog korisnika
    public function index()
    {
        $items = Item::where('user_id', Auth::id())->get();
        return response()->json($items, 200);
    }

    // Kreira novi item
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'season' => 'nullable|string',
            'warmth' => 'nullable|integer',
            'waterproof' => 'nullable|boolean',
            'color' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();

        $item = Item::create($validated);

        return response()->json($item, 201);
    }

    // Prikazuje jedan item
    public function show($id)
    {
        $item = Item::where('user_id', Auth::id())->findOrFail($id);
        return response()->json($item, 200);
    }

    // Ažurira postojeći item
    public function update(Request $request, $id)
    {
        $item = Item::where('user_id', Auth::id())->findOrFail($id);

        $item->update($request->only([
            'name', 'type', 'season', 'warmth', 'waterproof', 'color', 'image_url'
        ]));

        return response()->json($item, 200);
    }

    // Briše item
    public function destroy($id)
    {
        $item = Item::where('user_id', Auth::id())->findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item deleted successfully'], 200);
    }
}
