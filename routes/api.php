<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FaceController;
use App\Http\Controllers\OrderController;

Route::middleware('api.key')->group(function () {
    // Orders
    Route::post('/orders/{id}/validate', [OrderController::class, 'validateOrder']);
    Route::post('/orders/{id}/confirm', [OrderController::class, 'confirmOrder']);

    // Faces
    Route::post('/face/upload', [FaceController::class, 'upload']);
    Route::get('/face/logs', [FaceController::class, 'getLogs']);
    Route::get('/face/{hash}', [FaceController::class, 'getLogByHash']);
    Route::post('/face/{hash}/result', [FaceController::class, 'updateResult']);
});
