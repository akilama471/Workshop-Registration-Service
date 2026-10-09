<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

use App\Http\Controllers\WorkshopController;
use App\Http\Controllers\RegistrationController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('workshops.index');
    })->name('dashboard');

    Route::get('/workshops', [WorkshopController::class, 'index'])->name('workshops.index');
    Route::post('/workshops', [WorkshopController::class, 'store'])->name('workshops.store');
    Route::get('/workshops/{workshop}', [WorkshopController::class, 'show'])->name('workshops.show');
    Route::put('/workshops/{workshop}', [WorkshopController::class, 'update'])->name('workshops.update');

    Route::post('/workshops/{workshop}/registrations', [RegistrationController::class, 'store'])->name('registrations.store');
    Route::delete('/workshops/{workshop}/registrations/{registration}', [RegistrationController::class, 'destroy'])->name('registrations.destroy');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
