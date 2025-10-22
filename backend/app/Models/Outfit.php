<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Outfit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'event_type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
         return $this->belongsToMany(Item::class, 'outfit_item', 'outfit_id', 'item_id');
    }
}
