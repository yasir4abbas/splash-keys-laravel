<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\LicenseController;
use App\Http\Controllers\PackageController;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('clients', [ClientController::class, 'index'])->name('clients');
    Route::get('clients/create', [ClientController::class, 'create'])->name('clients.create');
    Route::get('clients/create/{id}', [ClientController::class, 'edit'])->name('clients.edit');
    Route::get('clients/list', [ClientController::class, 'list'])->name('clients.list');
    Route::post('clients', [ClientController::class, 'store'])->name('clients.store');
    Route::patch('clients/{id}', [ClientController::class, 'update'])->name('clients.update');
    Route::delete('clients/{id}', [ClientController::class, 'destroy'])->name('clients.destroy');

    Route::get('machines', [MachineController::class, 'index'])->name('machines');
    Route::get('machines/list', [MachineController::class, 'list'])->name('machines.list');
    Route::post('machines', [MachineController::class, 'store'])->name('machines.store');
    Route::patch('machines/{id}', [MachineController::class, 'update'])->name('machines.update');
    Route::delete('machines/{id}', [MachineController::class, 'destroy'])->name('machines.destroy');

    Route::get('licenses', [LicenseController::class, 'index'])->name('licenses');
    Route::get('licenses/create', [LicenseController::class, 'create'])->name('licenses.create');
    Route::get('licenses/create/{id}', [LicenseController::class, 'edit'])->name('licenses.edit');
    
    Route::get('licenses/list', [LicenseController::class, 'list'])->name('licenses.list');
    Route::get('licenses/packages', [LicenseController::class, 'getPackages'])->name('licenses.packages');
    Route::post('licenses', [LicenseController::class, 'store'])->name('licenses.store');
    Route::patch('licenses/{id}', [LicenseController::class, 'update'])->name('licenses.update');
    Route::delete('licenses/{id}', [LicenseController::class, 'destroy'])->name('licenses.destroy');

    Route::get('packages', [PackageController::class, 'index'])->name('packages');
    Route::get('packages/create', [PackageController::class, 'create'])->name('packages.create');
    Route::get('packages/create/{id}', [PackageController::class, 'edit'])->name('packages.edit');
    Route::get('packages/list', [PackageController::class, 'list'])->name('packages.list');
    Route::post('packages', [PackageController::class, 'store'])->name('packages.store');
    Route::patch('packages/{id}', [PackageController::class, 'update'])->name('packages.update');
    Route::delete('packages/{id}', [PackageController::class, 'destroy'])->name('packages.destroy');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
