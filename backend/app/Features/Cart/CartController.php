<?php

namespace App\Features\Cart;

use App\Features\Cart\Cart;
use App\Features\Cart\CartItem;
use App\Features\Cart\CartResource;
use App\Features\Product\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Get current user's cart.
     */
    public function index(Request $request): JsonResponse
    {
        $cart = Cart::with('items.product')
            ->firstOrCreate(['user_id' => $request->user()->id]);

        return $this->sendResponse(new CartResource($cart), 'Cart fetched successfully');
    }

    /**
     * Add item to cart.
     */
    public function addItem(Request $request): JsonResponse
    {
        // Normalize product_id if given as string like "prod_1"
        $productId = $request->input('product_id');
        if (is_string($productId) && str_starts_with($productId, 'prod_')) {
            $productId = (int) str_replace('prod_', '', $productId);
            $request->merge(['product_id' => $productId]);
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);

        $item = $cart->items()->where('product_id', $validated['product_id'])->first();

        if ($item) {
            $item->increment('quantity', $validated['quantity']);
        } else {
            $cart->items()->create([
                'product_id' => $validated['product_id'],
                'quantity'   => $validated['quantity'],
            ]);
        }

        $cart->load('items.product');

        return $this->sendResponse(new CartResource($cart), 'Item added to cart');
    }

    /**
     * Update item quantity in cart.
     */
    public function updateItem(Request $request, int|string $itemId): JsonResponse
    {
        // Support prod_1 or string IDs
        if (is_string($itemId) && str_starts_with($itemId, 'prod_')) {
            $itemId = (int) str_replace('prod_', '', $itemId);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $item = $cart->items()->where('id', $itemId)->orWhere('product_id', $itemId)->first();

        if (!$item) {
            return $this->sendError('Cart item not found', 404);
        }

        if ($validated['quantity'] <= 0) {
            $item->delete();
        } else {
            $item->update(['quantity' => $validated['quantity']]);
        }
        $cart->load('items.product');

        return $this->sendResponse(new CartResource($cart), 'Cart item updated');
    }

    /**
     * Remove item from cart.
     */
    public function removeItem(Request $request, int|string $itemId): JsonResponse
    {
        if (is_string($itemId) && str_starts_with($itemId, 'prod_')) {
            $itemId = (int) str_replace('prod_', '', $itemId);
        }

        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $item = $cart->items()->where('id', $itemId)->orWhere('product_id', $itemId)->first();

        if (!$item) {
            return $this->sendError('Cart item not found', 404);
        }

        $item->delete();
        $cart->load('items.product');

        return $this->sendResponse(new CartResource($cart), 'Item removed from cart');
    }

    /**
     * Clear entire cart.
     */
    public function clear(Request $request): JsonResponse
    {
        $cart = Cart::where('user_id', $request->user()->id)->first();

        if ($cart) {
            $cart->items()->delete();
        }

        return $this->sendResponse(null, 'Cart cleared');
    }
}
