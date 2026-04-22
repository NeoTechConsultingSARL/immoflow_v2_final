<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Index');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/companies', function () {
    return Inertia::render('Companies');
})->name('companies');

Route::get('/projects', function () {
    return Inertia::render('Projects');
})->name('projects');

Route::get('/project-management', function () {
    return Inertia::render('ProjectManagement');
})->name('project-management');

Route::get('/management/{project}', function () {
    return Inertia::render('ProjectManagement');
})->name('management');

Route::get('/tranches', function () {
    return Inertia::render('Tranches');
})->name('tranches');

Route::get('/projects/{project}/blocs', function () {
    return Inertia::render('Blocs');
})->name('projects.blocs');

Route::get('/blocs', function () {
    return Inertia::render('Blocs');
})->name('blocs');

Route::get('/property-types', function () {
    return Inertia::render('PropertyTypes');
})->name('property-types');

Route::get('/properties', function () {
    return Inertia::render('Properties');
})->name('properties');

Route::get('/settings', function () {
    return Inertia::render('Settings');
})->name('settings');

Route::get('/settings/property-types', function () {
    return Inertia::render('SettingsPropertyTypes');
})->name('settings.property-types');

Route::get('/settings/users', function () {
    return Inertia::render('SettingsUsers');
})->name('settings.users');

Route::get('/settings/profiles', function () {
    return Inertia::render('SettingsProfiles');
})->name('settings.profiles');

Route::get('/settings/profiles/create', function () {
    return Inertia::render('CreateEditRole');
})->name('settings.profiles.create');

Route::get('/settings/profiles/edit/{roleId}', function ($roleId) {
    return Inertia::render('CreateEditRole', ['roleId' => $roleId]);
})->name('settings.profiles.edit');

Route::get('/history', function () {
    return Inertia::render('History');
})->name('history');

Route::get('/news', function () {
    return Inertia::render('NewsArticle');
})->name('news');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
