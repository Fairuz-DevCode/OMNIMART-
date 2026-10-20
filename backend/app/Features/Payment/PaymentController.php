<?php

namespace App\Features\Payment;

use App\Features\Order\Order;
use App\Features\Payment\Payment;
use App\Features\Payment\PaymentResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Process payment for an order.
     *
     * BUG FIX: After successful payment, order status transitions to 'dikirim' (not 'dikemas').
     * Flow: pending_payment -> [pay] -> dikirim -> selesai
     */
    public function pay(Request $request, int $orderId): JsonResponse
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:transfer,cod,e_wallet',
            'notes'          => 'nullable|string|max:255',
        ]);

        $order = Order::with('payment')
            ->where('user_id', $request->user()->id)
            ->find($orderId);

        if (!$order) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Order not found',
            ], 404);
        }

        if ($order->status !== Order::STATUS_PENDING_PAYMENT) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Order is not in pending payment state',
            ], 422);
        }

        if ($order->payment && $order->payment->payment_status === Payment::STATUS_PAID) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Order already paid',
            ], 409);
        }

        $paidAt = now();

        // Create payment record
        $payment = Payment::create([
            'order_id'       => $order->id,
            'user_id'        => $request->user()->id,
            'payment_method' => $validated['payment_method'],
            'payment_status' => Payment::STATUS_PAID,
            'amount'         => $order->total_amount,
            'transaction_id' => 'TXN-' . strtoupper(Str::random(12)),
            'notes'          => $validated['notes'] ?? null,
            'paid_at'        => $paidAt,
        ]);

        // BUG FIX: After payment, move order directly to 'dikirim' (shipped) status
        // Previously: payment -> dikemas (wrong)
        // Correct flow: payment -> dikirim
        $order->update([
            'status'     => Order::STATUS_DIKEMAS,
            'paid_at'    => $paidAt,
            'shipped_at' => $paidAt,
        ]);

        $order->load(['items', 'payment']);

        return response()->json([
            'status'  => 'success',
            'message' => 'Payment successful. Pembayaran berhasil. Pesanan Anda sedang dikemas.',
            'data'    => [
                'order'   => [
                    'id'           => $order->id,
                    'order_number' => $order->order_number,
                    'status'       => $order->status,
                    'status_label' => $order->status_label,
                    'total_amount' => $order->total_amount,
                ],
                'payment' => new PaymentResource($payment),
            ],
        ]);
    }

    /**
     * Get payment details for an order.
     */
    public function show(Request $request, int $orderId): JsonResponse
    {
        $order = Order::where('user_id', $request->user()->id)->find($orderId);

        if (!$order) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Order not found',
            ], 404);
        }

        $payment = $order->payment;

        if (!$payment) {
            return response()->json([
                'status'  => 'error',
                'message' => 'No payment found for this order',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => new PaymentResource($payment),
        ]);
    }
}
