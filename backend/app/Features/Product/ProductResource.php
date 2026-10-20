<?php

namespace App\Features\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => (string) $this->id,
            'name'         => $this->name,
            'category'     => $this->category,
            'price'        => (float) $this->price,
            'oldPrice'     => $this->old_price !== null ? (float) $this->old_price : null,
            'old_price'    => $this->old_price !== null ? (float) $this->old_price : null,
            'rating'       => (float) $this->rating,
            'reviewsCount' => (int) $this->reviews_count,
            'reviews_count'=> (int) $this->reviews_count,
            'imageUrl'     => $this->image_url,
            'image_url'    => $this->image_url,
            'badge'        => $this->badge,
            'description'  => $this->description,
            'isPopular'    => (bool) $this->is_popular,
            'is_popular'   => (bool) $this->is_popular,
            'createdAt'    => $this->created_at?->toIso8601String(),
            'updatedAt'    => $this->updated_at?->toIso8601String(),
        ];
    }
}
