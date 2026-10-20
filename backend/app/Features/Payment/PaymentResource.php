<?php

namespace App\Features\Payment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'order_id'       => $this->order_id,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'amount'         => (float) $this->amount,
            'transaction_id' => $this->transaction_id,
            'notes'          => $this->notes,
            'paid_at'        => $this->paid_at?->toIso8601String(),
            'created_at'     => $this->created_at?->toIso8601String(),
        ];
    }
}
