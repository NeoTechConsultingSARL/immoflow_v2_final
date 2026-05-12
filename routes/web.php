<?php

use App\Http\Controllers\BlocController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyTypeController;
use App\Http\Controllers\TrancheController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClientController;

use App\Http\Controllers\ContractController;

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


    // Contracts
    Route::resource('contracts', ContractController::class);

    // Clients
    Route::resource('clients', ClientController::class)->except(['destroy']);

    // Contracts
    Route::resource('contracts', ContractController::class)->except(['destroy']);
    Route::get('/contracts/{contract}/pdf', [ContractController::class, 'generatePdf'])->name('contracts.pdf');
    Route::get('/api/companies/{company}/projects', [ContractController::class, 'getProjects'])->name('api.companies.projects');
    Route::get('/api/projects/{project}/tranches', [ContractController::class, 'getTranches'])->name('api.projects.tranches');
    Route::get('/api/tranches/{tranche}/blocs', [ContractController::class, 'getBlocs'])->name('api.tranches.blocs');
    Route::get('/api/blocs/{bloc}/properties', [ContractController::class, 'getProperties'])->name('api.blocs.properties');

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

    Route::get('/property-types', [PropertyTypeController::class, 'index'])
        ->name('property-types')->middleware('role:admin,manager');
    Route::post('/property-types', [PropertyTypeController::class, 'store'])
        ->name('property-types.store')->middleware('role:admin,manager');
    Route::put('/property-types/{propertyType}', [PropertyTypeController::class, 'update'])
        ->name('property-types.update')->middleware('role:admin,manager');
    Route::delete('/property-types/{propertyType}', [PropertyTypeController::class, 'destroy'])
        ->name('property-types.destroy')->middleware('role:admin,manager');

    Route::get('/properties', [PropertyController::class, 'index'])
        ->name('properties')->middleware('role:admin,manager');
    Route::post('/properties', [PropertyController::class, 'store'])
        ->name('properties.store')->middleware('role:admin,manager');
    Route::put('/properties/{property}', [PropertyController::class, 'update'])
        ->name('properties.update')->middleware('role:admin,manager');
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy'])
        ->name('properties.destroy')->middleware('role:admin,manager');

    Route::get('/settings', function () {
        return Inertia::render('Settings');
    })->name('settings')->middleware('role:admin');

    Route::get('/settings/property-types', [PropertyTypeController::class, 'index'])
        ->name('settings.property-types')->middleware('role:admin');

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
