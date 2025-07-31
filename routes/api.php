<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\APIController;

Route::middleware(['throttle:10,1'])->group(function () {
    Route::post('/register-machine', [APIController::class, 'registerMachine']);
    Route::post('/check-machine', [APIController::class, 'checkMachine']);
    Route::post('/validate-license', [APIController::class, 'validateLicense']);
});


