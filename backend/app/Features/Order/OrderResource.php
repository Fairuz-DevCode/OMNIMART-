<?php

namespace App\Features\Order;

use App\Features\Order\OrderItemResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'order_number'     => $this->order_number,
            'status'           => $this->status,
            'status_label'     => $this->status_label,
            'subtotal'         => (float) $this->subtotal,
            'shipping_fee'     => (float) $this->shipping_fee,
            'total_amount'     => (float) $this->total_amount,
            'shipping_address' => $this->shipping_address,
            'notes'            => $this->notes,
            'paid_at'          => $this->paid_at?->toIso8601String(),
            'shipped_at'       => $this->shipped_at?->toIso8601String(),
            'completed_at'     => $this->completed_at?->toIso8601String(),
            'cancelled_at'     => $this->cancelled_at?->toIso8601String(),
            'items'            => OrderItemResource::collection($this->whenLoaded('items')),
            'payment'          => $this->whenLoaded('payment') ? [
                'id'             => $this->payment?->id,
                'payment_method' => $this->payment?->payment_method,
                'payment_status' => $this->payment?->payment_status,
                'amount'         => (float) ($this->payment?->amount ?? 0),
                'transaction_id' => $this->payment?->transaction_id,
                'paid_at'        => $this->payment?->paid_at?->toIso8601String(),
            ] : null,
            'created_at'       => $this->created_at?->toIso8601String(),
            'updated_at'       => $this->updated_at?->toIso8601String(),
        ];
    }
}
