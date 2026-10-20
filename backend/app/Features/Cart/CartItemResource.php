<?php

namespace App\Features\Cart;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'product_id' => (string) $this->product_id,
            'quantity'   => $this->quantity,
            'product'    => [
                'id'        => (string) $this->product->id,
                'name'      => $this->product->name,
                'category'  => $this->product->category,
                'price'     => (float) $this->product->price,
                'imageUrl'  => $this->product->image_url,
                'image_url' => $this->product->image_url,
            ],
            'line_total'  => (float) ($this->product->price * $this->quantity),
        ];
    }
}
