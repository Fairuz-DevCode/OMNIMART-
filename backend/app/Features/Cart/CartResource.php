<?php

namespace App\Features\Cart;

use App\Features\Cart\CartItemResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items      = $this->items ?? collect();
        $totalItems = $items->sum('quantity');
        $totalPrice = $items->sum(fn($item) => $item->product->price * $item->quantity);

        return [
            'id'          => $this->id,
            'user_id'     => $this->user_id,
            'items'       => CartItemResource::collection($items),
            'total_items' => $totalItems,
            'total_price' => (float) $totalPrice,
        ];
    }
}
