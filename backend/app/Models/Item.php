<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'season',
        'warmth',
        'waterproof',
        'color',
        'image_url',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function outfits()
    {
        return $this->belongsToMany(Outfit::class, 'outfit_item', 'item_id', 'outfit_id');
    }
}
