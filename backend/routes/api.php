<?php

use App\Features\Auth\AuthController;
use App\Features\Cart\CartController;
use App\Features\Order\OrderController;
use App\Features\Payment\PaymentController;
use App\Features\Product\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Feature-Based Architecture
|--------------------------------------------------------------------------
|
| Auth     → App\Features\Auth\AuthController
| Product  → App\Features\Product\ProductController
| Cart     → App\Features\Cart\CartController
| Order    → App\Features\Order\OrderController
| Payment  → App\Features\Payment\PaymentController
|
*/

// ─── Auth (Public) ────────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ─── Products (Public) ────────────────────────────────────────────────────────
Route::prefix('products')->group(function () {
    Route::get('/',       [ProductController::class, 'index']);
    Route::get('/{id}',   [ProductController::class, 'show']);
});

// ─── Protected Routes ─────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
    });

    // Products (admin create/update/delete)
    Route::prefix('products')->group(function () {
        Route::post('/',        [ProductController::class, 'store']);
        Route::put('/{id}',     [ProductController::class, 'update']);
        Route::patch('/{id}',   [ProductController::class, 'update']);
        Route::delete('/{id}',  [ProductController::class, 'destroy']);
    });

    // Cart
    Route::prefix('cart')->group(function () {
        Route::get('/',                [CartController::class, 'index']);
        Route::post('/items',          [CartController::class, 'addItem']);
        Route::put('/items/{itemId}',  [CartController::class, 'updateItem']);
        Route::delete('/items/{itemId}', [CartController::class, 'removeItem']);
        Route::delete('/',             [CartController::class, 'clear']);
    });

    // Orders
    Route::prefix('orders')->group(function () {
        Route::get('/',                [OrderController::class, 'index']);
        Route::post('/',               [OrderController::class, 'store']);
        Route::get('/{id}',            [OrderController::class, 'show']);
        Route::post('/{id}/cancel',    [OrderController::class, 'cancel']);
        Route::post('/{id}/complete',  [OrderController::class, 'complete']);
    });

    // Payments
    Route::prefix('payments')->group(function () {
        Route::post('/orders/{orderId}',  [PaymentController::class, 'pay']);
        Route::get('/orders/{orderId}',   [PaymentController::class, 'show']);
    });
});

// ─── Legacy compatibility aliases (keep old URLs working) ────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    Route::get('/user',    [AuthController::class, 'me']);
});
Route::apiResource('products', ProductController::class);
