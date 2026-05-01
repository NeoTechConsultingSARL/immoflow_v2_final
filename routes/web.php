<?php

use App\Http\Controllers\BlocController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TrancheController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

// Protected routes - require authentication
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/companies', [CompanyController::class, 'index'])
        ->name('companies')->middleware('role:admin,manager');

    // Company CRUD routes
    Route::post('/companies', [CompanyController::class, 'store'])
        ->name('companies.store')->middleware('role:admin,manager');

    Route::put('/companies/{company}', [CompanyController::class, 'update'])
        ->name('companies.update')->middleware('role:admin,manager');

    // Route::delete('/companies/{company}', [CompanyController::class, 'destroy'])
    //     ->name('companies.destroy')->middleware('role:admin,manager');

    Route::get('/projects', [ProjectController::class, 'index'])
        ->name('projects')->middleware('role:admin,manager');

    Route::post('/projects', [ProjectController::class, 'store'])
        ->name('projects.store')->middleware('role:admin,manager');

    Route::put('/projects/{project}', [ProjectController::class, 'update'])
        ->name('projects.update')->middleware('role:admin,manager');

    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])
        ->name('projects.destroy')->middleware('role:admin,manager');

    Route::get('/project-management', function () {
        return Inertia::render('ProjectManagement');
    })->name('project-management')->middleware('role:admin,manager');

    Route::get('/management/{project}', function () {
        return Inertia::render('ProjectManagement');
    })->name('management')->middleware('role:admin,manager');

    Route::get('/tranches', [TrancheController::class, 'index'])
        ->name('tranches')->middleware('role:admin,manager');
    Route::post('/tranches', [TrancheController::class, 'store'])
        ->name('tranches.store')->middleware('role:admin,manager');
    Route::put('/tranches/{tranche}', [TrancheController::class, 'update'])
        ->name('tranches.update')->middleware('role:admin,manager');
    Route::delete('/tranches/{tranche}', [TrancheController::class, 'destroy'])
        ->name('tranches.destroy')->middleware('role:admin,manager');

    Route::get('/projects/{project}/blocs', [BlocController::class, 'index'])
        ->name('projects.blocs')->middleware('role:admin,manager');

    Route::get('/blocs', [BlocController::class, 'index'])
        ->name('blocs')->middleware('role:admin,manager');
    Route::post('/blocs', [BlocController::class, 'store'])
        ->name('blocs.store')->middleware('role:admin,manager');
    Route::put('/blocs/{bloc}', [BlocController::class, 'update'])
        ->name('blocs.update')->middleware('role:admin,manager');
    Route::delete('/blocs/{bloc}', [BlocController::class, 'destroy'])
        ->name('blocs.destroy')->middleware('role:admin,manager');

    Route::get('/property-types', function () {
        return Inertia::render('PropertyTypes');
    })->name('property-types')->middleware('role:admin,manager');

    Route::get('/properties', function () {
        return Inertia::render('Properties');
    })->name('properties');

    Route::get('/settings', function () {
        return Inertia::render('Settings');
    })->name('settings')->middleware('role:admin');

    Route::get('/settings/property-types', function () {
        return Inertia::render('SettingsPropertyTypes');
    })->name('settings.property-types')->middleware('role:admin');

    Route::get('/settings/users', [UserController::class, 'index'])
        ->name('settings.users')->middleware('role:admin');

    // User CRUD routes
    Route::post('/users', [UserController::class, 'store'])
        ->name('users.store')->middleware('role:admin');

    Route::put('/users/{user}', [UserController::class, 'update'])
        ->name('users.update')->middleware('role:admin');

    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->name('users.destroy')->middleware('role:admin');

    Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive'])
        ->name('users.toggle-active')->middleware('role:admin');

    Route::get('/settings/profiles', function () {
        return Inertia::render('SettingsProfiles');
    })->name('settings.profiles')->middleware('role:admin');

    Route::get('/settings/profiles/create', function () {
        return Inertia::render('CreateEditRole');
    })->name('settings.profiles.create')->middleware('role:admin');

    Route::get('/settings/profiles/edit/{roleId}', function ($roleId) {
        return Inertia::render('CreateEditRole', ['roleId' => $roleId]);
    })->name('settings.profiles.edit')->middleware('role:admin');

    Route::get('/history', function () {
        return Inertia::render('History');
    })->name('history');

    Route::get('/news', function () {
        return Inertia::render('NewsArticle');
    })->name('news');

    Route::get('/admin-only', function () {
        return response('Admin only access', 200);
    })->name('admin-only')->middleware('role:admin');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
