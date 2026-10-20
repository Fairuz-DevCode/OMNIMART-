<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class Controller
{
    /**
     * Return a standardized success JSON response.
     */
    protected function sendResponse(mixed $data = null, string $message = 'Success', int $code = 200, array $extra = []): JsonResponse
    {
        $payload = array_merge([
            'status'  => 'success',
            'message' => $message,
            'data'    => $data,
        ], $extra);

        return response()->json($payload, $code);
    }

    /**
     * Return a standardized error JSON response.
     */
    protected function sendError(string $message = 'Error', int $code = 400, mixed $errors = null): JsonResponse
    {
        $payload = [
            'status'  => 'error',
            'message' => $message,
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $code);
    }
}
