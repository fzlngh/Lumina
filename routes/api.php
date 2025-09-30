<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FaceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RegisterController;

// Login & Register
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);

// Worker routes (tanpa API Key karna darurat okkay)
Route::get('/faces/pending', [FaceController::class, 'getPendingFaces']);
Route::post('/face/{hash}/result', [FaceController::class, 'updateResult']);
Route::get('/orders/validating', [OrderController::class, 'getValidatingOrders']);
Route::post('/orders/{id}/validate', [OrderController::class, 'validateOrder']);

// User routes pakai Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders/{id}/confirm', [OrderController::class, 'confirmOrder']);
    Route::post('/face/upload', [FaceController::class, 'upload']);
    Route::get('/face/logs', [FaceController::class, 'getLogs']);
    Route::get('/face/{hash}', [FaceController::class, 'getLogByHash']);
});
