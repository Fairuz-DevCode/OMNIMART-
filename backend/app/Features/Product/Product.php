<?php

namespace App\Features\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'price',
        'old_price',
        'rating',
        'reviews_count',
        'image_url',
        'badge',
        'description',
        'is_popular',
    ];

    protected $casts = [
        'price' => 'float',
        'old_price' => 'float',
        'rating' => 'float',
        'reviews_count' => 'integer',
        'is_popular' => 'boolean',
    ];
}
