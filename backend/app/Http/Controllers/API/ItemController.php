<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
            'season' => 'required|in:winter,autumn,spring,summer',
            'color' => 'required|string|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('items', 'public');
            $validated['image_url'] = $path;
        }

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

    // Ažurira item
    public function update(Request $request, $id)
    {
        $item = Item::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|max:255',
            'season' => 'sometimes|required|in:winter,autumn,spring,summer',
            'color' => 'sometimes|required|string|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Briše prethodnu sliku ako postoji
            if ($item->image) Storage::disk('public')->delete($item->image);
            $path = $request->file('image')->store('items', 'public');
            $validated['image'] = $path;
        }

        $item->update($validated);

        return response()->json($item, 200);
    }

    // Briše item
    public function destroy($id)
    {
        $item = Item::where('user_id', Auth::id())->findOrFail($id);
        if ($item->image) Storage::disk('public')->delete($item->image);
        $item->delete();

        return response()->json(['message' => 'Item deleted successfully'], 200);
    }
}
