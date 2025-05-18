<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ShipmentController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('register', [AuthController::class, 'register']);
Route::post('login',    [AuthController::class, 'login']);

// Protected (any authenticated user)
Route::middleware('auth:sanctum')->group(function(){
    Route::post('logout', [AuthController::class, 'logout']);

    // User-only
    Route::get('shipments',      [ShipmentController::class, 'index']);
    Route::post('shipments',     [ShipmentController::class, 'store']);
    Route::get('shipments/{id}', [ShipmentController::class, 'show']);

    // Admin-only (we’ll check is_admin inside the controller)
    Route::get('admin/shipments', [ShipmentController::class, 'all']);
    Route::put('shipments/{id}',   [ShipmentController::class, 'update']);
});
