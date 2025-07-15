<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\APIController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:api');

Route::post('/register-machine', [APIController::class, 'registerMachine']);
Route::post('/check-machine', [APIController::class, 'checkMachine']);
Route::post('/validate-license', [APIController::class, 'validateLicense']);


