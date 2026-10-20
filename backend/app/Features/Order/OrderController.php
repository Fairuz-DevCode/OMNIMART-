<?php

namespace App\Features\Order;

use App\Features\Cart\Cart;
use App\Features\Order\Order;
use App\Features\Order\OrderItem;
use App\Features\Order\OrderResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * List all orders for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['items', 'payment'])
            ->where('user_id', $request->user()->id)
            ->latest();

        // Filter by status tab
        if ($request->has('status') && !empty($request->status)) {
            $statusMap = [
                'belum_bayar'   => Order::STATUS_PENDING_PAYMENT,
                'dikemas'       => Order::STATUS_DIKEMAS,
                'dikirim'       => Order::STATUS_DIKIRIM,
                'selesai'       => Order::STATUS_SELESAI,
                'dibatalkan'    => Order::STATUS_DIBATALKAN,
                'pengembalian'  => Order::STATUS_PENGEMBALIAN,
            ];
            $status = $statusMap[$request->status] ?? $request->status;
            $query->where('status', $status);
        }

        $orders = $query->get();

        return response()->json([
            'status'  => 'success',
            'message' => 'Orders fetched successfully',
            'total'   => $orders->count(),
            'data'    => OrderResource::collection($orders),
        ]);
    }

    /**
     * Get a specific order detail.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $order = Order::with(['items.product', 'payment'])
            ->where('user_id', $request->user()->id)
            ->find($id);

        if (!$order) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Order not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => new OrderResource($order),
        ]);
    }

    /**
     * Create order from cart items.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shipping_address' => 'required|string|max:500',
            'shipping_fee'     => 'nullable|numeric|min:0',
            'notes'            => 'nullable|string|max:255',
        ]);

        $cart = Cart::with('items.product')
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Cart is empty',
            ], 422);
        }

        $subtotal    = 0;
        $shippingFee = $validated['shipping_fee'] ?? 12000;
        $orderItems  = [];

        foreach ($cart->items as $item) {
            $unitPrice  = $item->product->price;
            $lineTotal  = $unitPrice * $item->quantity;
            $subtotal  += $lineTotal;

            $orderItems[] = [
                'product_id'    => $item->product_id,
                'product_name'  => $item->product->name,
                'product_image' => $item->product->image_url,
                'quantity'      => $item->quantity,
                'unit_price'    => $unitPrice,
                'subtotal'      => $lineTotal,
            ];
        }

        $totalAmount = $subtotal + $shippingFee;

        $order = Order::create([
            'user_id'          => $request->user()->id,
            'order_number'     => 'ORD-' . strtoupper(Str::random(8)) . '-' . now()->format('YmdHis'),
            'status'           => Order::STATUS_PENDING_PAYMENT,
            'subtotal'         => $subtotal,
            'shipping_fee'     => $shippingFee,
            'total_amount'     => $totalAmount,
            'shipping_address' => $validated['shipping_address'],
            'notes'            => $validated['notes'] ?? null,
        ]);

        $order->items()->createMany($orderItems);

        // Clear the cart after creating the order
        $cart->items()->delete();

        $order->load(['items', 'payment']);

        return response()->json([
            'status'  => 'success',
            'message' => 'Order created successfully',
            'data'    => new OrderResource($order),
        ], 201);
    }

    /**
     * Cancel an order.
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $order = Order::where('user_id', $request->user()->id)->find($id);

        if (!$order) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Order not found',
            ], 404);
        }

        if (!in_array($order->status, [Order::STATUS_PENDING_PAYMENT, Order::STATUS_DIKEMAS])) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Order cannot be cancelled at this stage',
            ], 422);
        }

        $order->update([
            'status'       => Order::STATUS_DIBATALKAN,
            'cancelled_at' => now(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Order cancelled successfully',
            'data'    => new OrderResource($order->fresh()),
        ]);
    }
    /**
     * Mark order as completed (Pesanan Diterima).
     */
    public function complete(Request $request, int $id): JsonResponse
    {
        $order = Order::where('user_id', $request->user()->id)->find($id);

        if (!$order) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Order not found',
            ], 404);
        }

        $order->update([
            'status'       => Order::STATUS_SELESAI,
            'completed_at' => now(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Pesanan berhasil diselesaikan.',
            'data'    => new OrderResource($order->fresh()),
        ]);
    }
}
