<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FaceController;
use App\Http\Controllers\OrderController;

// Login user
Route::post('/login', [AuthController::class, 'login']);

// Worker routes pakai API Key
Route::middleware('apikey')->group(function () {
        Route::get('/faces/pending', [OrderController::class, 'getPendingFaces']);
            Route::get('/faces/pending', [FaceController::class, 'getPendingFaces']);
    Route::get('/orders/validating', [OrderController::class, 'getValidatingOrders']); 
    Route::post('/face/{hash}/result', [FaceController::class, 'updateResult']);
    Route::post('/orders/{id}/validate', [OrderController::class, 'validateOrder']);
});


// User routes pakai Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Orders
    Route::post('/orders/{id}/confirm', [OrderController::class, 'confirmOrder']);

    // Faces
    Route::post('/face/upload', [FaceController::class, 'upload']);
    Route::get('/face/logs', [FaceController::class, 'getLogs']);
    Route::get('/face/{hash}', [FaceController::class, 'getLogByHash']);
});
