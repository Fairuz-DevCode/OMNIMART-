<?php

namespace App\Features\Payment;

use App\Features\Auth\User;
use App\Features\Order\Order;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    const STATUS_PENDING  = 'pending';
    const STATUS_PAID     = 'paid';
    const STATUS_FAILED   = 'failed';
    const STATUS_REFUNDED = 'refunded';

    const METHOD_TRANSFER  = 'transfer';
    const METHOD_COD       = 'cod';
    const METHOD_E_WALLET  = 'e_wallet';

    protected $fillable = [
        'order_id',
        'user_id',
        'payment_method',
        'payment_status',
        'amount',
        'transaction_id',
        'notes',
        'paid_at',
    ];

    protected $casts = [
        'amount'  => 'float',
        'paid_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
