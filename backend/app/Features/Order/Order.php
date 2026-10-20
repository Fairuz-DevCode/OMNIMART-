<?php

namespace App\Features\Order;

use App\Features\Auth\User;
use App\Features\Order\OrderItem;
use App\Features\Payment\Payment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    const STATUS_PENDING_PAYMENT = 'pending_payment'; // Belum Bayar
    const STATUS_DIKEMAS         = 'dikemas';          // Dikemas
    const STATUS_DIKIRIM         = 'dikirim';          // Dikirim
    const STATUS_SELESAI         = 'selesai';          // Selesai
    const STATUS_DIBATALKAN      = 'dibatalkan';       // Dibatalkan
    const STATUS_PENGEMBALIAN    = 'pengembalian';     // Pengembalian

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'subtotal',
        'shipping_fee',
        'total_amount',
        'shipping_address',
        'notes',
        'paid_at',
        'shipped_at',
        'completed_at',
        'cancelled_at',
    ];

    protected $casts = [
        'subtotal'      => 'float',
        'shipping_fee'  => 'float',
        'total_amount'  => 'float',
        'paid_at'       => 'datetime',
        'shipped_at'    => 'datetime',
        'completed_at'  => 'datetime',
        'cancelled_at'  => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Map DB status to display label (Indonesian)
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_PENDING_PAYMENT => 'Belum Bayar',
            self::STATUS_DIKEMAS         => 'Dikemas',
            self::STATUS_DIKIRIM         => 'Dikirim',
            self::STATUS_SELESAI         => 'Selesai',
            self::STATUS_DIBATALKAN      => 'Dibatalkan',
            self::STATUS_PENGEMBALIAN    => 'Pengembalian',
            default                      => ucfirst($this->status),
        };
    }
}
