<?php

use App\Http\Controllers\Auth\TwoFactorAuthenticationController;
use App\Http\Controllers\BlocController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ContractArticleController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\ParkingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyTypeController;
use App\Http\Controllers\ShareholderController;
use App\Http\Controllers\TrancheController;
use App\Http\Controllers\UserController;
use App\Models\Contract;
use Illuminate\Http\Request;
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

    // Contracts - nested under blocs
    Route::get('/blocs/{bloc}/contracts', [ContractController::class, 'index'])->name('blocs.contracts.index');
    Route::get('/blocs/{bloc}/contracts/create', [ContractController::class, 'create'])->name('blocs.contracts.create');
    Route::post('/blocs/{bloc}/contracts', [ContractController::class, 'store'])->name('blocs.contracts.store');
    Route::get('/blocs/{bloc}/contracts/{contract}', [ContractController::class, 'show'])->name('blocs.contracts.show');
    Route::get('/blocs/{bloc}/contracts/{contract}/edit', [ContractController::class, 'edit'])->name('blocs.contracts.edit');
    Route::put('/blocs/{bloc}/contracts/{contract}', [ContractController::class, 'update'])->name('blocs.contracts.update');
    Route::delete('/blocs/{bloc}/contracts/{contract}', [ContractController::class, 'destroy'])->name('blocs.contracts.destroy');
    Route::get('/blocs/{bloc}/contracts/{contract}/pdf', [ContractController::class, 'generatePdf'])->name('blocs.contracts.pdf');

    // Global Contract Create (not nested under bloc)
    Route::post('/contracts', [ContractController::class, 'storeGlobal'])->name('contracts.store');

    // Contract Sub-Resources (for details view actions)
    Route::post('/contracts/{contract}/payments', [ContractController::class, 'storePayment'])->name('contracts.payments.store');
    Route::delete('/contracts/{contract}/payments/{paymentSchedule}', [ContractController::class, 'destroyPayment'])->name('contracts.payments.destroy');

    Route::post('/contracts/{contract}/commissions', [ContractController::class, 'storeCommission'])->name('contracts.commissions.store');
    Route::delete('/contracts/{contract}/commissions/{contractCommission}', [ContractController::class, 'destroyCommission'])->name('contracts.commissions.destroy');

    Route::post('/contracts/{contract}/modifications', [ContractController::class, 'storeModification'])->name('contracts.modifications.store');
    Route::delete('/contracts/{contract}/modifications/{contractModification}', [ContractController::class, 'destroyModification'])->name('contracts.modifications.destroy');

    Route::put('/contracts/{contract}/client', [ContractController::class, 'updateClientFromDetails'])->name('contracts.client.update');
    Route::put('/contracts/{contract}/summary', [ContractController::class, 'updateSummaryFromDetails'])->name('contracts.summary.update');

    // Clients
    Route::resource('clients', ClientController::class)->except(['destroy']);
    Route::middleware('throttle:api')->group(function () {
        Route::get('/api/companies/{company}/projects', [ContractController::class, 'getProjects'])->name('api.companies.projects');
        Route::get('/api/projects/{project}/tranches', [ContractController::class, 'getTranches'])->name('api.projects.tranches');
        Route::get('/api/tranches/{tranche}/blocs', [ContractController::class, 'getBlocs'])->name('api.tranches.blocs');
        Route::get('/api/blocs/{bloc}/properties', [ContractController::class, 'getProperties'])->name('api.blocs.properties');
        Route::get('/api/clients-lookup', [ContractController::class, 'clientsLookup'])->name('api.clients.lookup');
        Route::get('/api/contracts/next-number', [ContractController::class, 'getNextContractNumber'])->name('api.contracts.next-number');
        Route::get('/api/property-types', [ContractController::class, 'getPropertyTypes'])->name('api.property-types');
        Route::get('/api/blocs/{bloc}/parkings', [ContractController::class, 'getParkings'])->name('api.blocs.parkings');
        Route::get('/api/properties', [ContractController::class, 'getAllProperties'])->name('api.properties');
    });

    Route::get('/companies', [CompanyController::class, 'index'])
        ->name('companies')->middleware('role:admin,manager');

    Route::post('/companies', [CompanyController::class, 'store'])
        ->name('companies.store')->middleware('role:admin,manager');

    Route::put('/companies/{company}', [CompanyController::class, 'update'])
        ->name('companies.update')->middleware('role:admin,manager');

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

    Route::get('/blocs/{bloc}/finance', [ShareholderController::class, 'finance'])
        ->name('blocs.finance');
    Route::get('/blocs/{bloc}/shareholders', [ShareholderController::class, 'index'])
        ->name('blocs.shareholders.index');
    Route::post('/blocs/{bloc}/shareholders', [ShareholderController::class, 'store'])
        ->name('blocs.shareholders.store');
    Route::put('/shareholders/{shareholder}', [ShareholderController::class, 'update'])
        ->name('shareholders.update');
    Route::delete('/shareholders/{shareholder}', [ShareholderController::class, 'destroy'])
        ->name('shareholders.destroy');

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

    Route::get('/parkings', [ParkingController::class, 'index'])
        ->name('parkings')->middleware('role:admin,manager');
    Route::post('/parkings', [ParkingController::class, 'store'])
        ->name('parkings.store')->middleware('role:admin,manager');
    Route::put('/parkings/{parking}', [ParkingController::class, 'update'])
        ->name('parkings.update')->middleware('role:admin,manager');
    Route::delete('/parkings/{parking}', [ParkingController::class, 'destroy'])
        ->name('parkings.destroy')->middleware('role:admin,manager');

    Route::get('/settings', function () {
        return Inertia::render('Settings');
    })->name('settings')->middleware('role:admin');

    Route::get('/settings/property-types', [PropertyTypeController::class, 'index'])
        ->name('settings.property-types')->middleware('role:admin');

    Route::get('/settings/users', [UserController::class, 'index'])
        ->name('settings.users')->middleware('role:admin');

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

    // Contract Articles settings routes
    Route::get('/settings/contract-articles', [ContractArticleController::class, 'index'])
        ->name('settings.contract-articles.index')->middleware('role:admin');
    Route::post('/settings/contract-articles', [ContractArticleController::class, 'store'])
        ->name('settings.contract-articles.store')->middleware('role:admin');
    Route::put('/settings/contract-articles/{contractArticle}', [ContractArticleController::class, 'update'])
        ->name('settings.contract-articles.update')->middleware('role:admin');
    Route::delete('/settings/contract-articles/{contractArticle}', [ContractArticleController::class, 'destroy'])
        ->name('settings.contract-articles.destroy')->middleware('role:admin');
    Route::patch('/settings/contract-articles/{contractArticle}/toggle-status', [ContractArticleController::class, 'toggleStatus'])
        ->name('settings.contract-articles.toggle-status')->middleware('role:admin');
    Route::post('/settings/contract-articles/reorder', [ContractArticleController::class, 'reorder'])
        ->name('settings.contract-articles.reorder')->middleware('role:admin');

    Route::get('/history', function () {
        return Inertia::render('History');
    })->name('history');

    Route::get('/news', function () {
        return Inertia::render('NewsArticle');
    })->name('news');

    // ✅ FIXED: Single /client-contracts route with query logic
    Route::get('/client-contracts', function (Request $request) {
        $blocId = $request->query('bloc');

        $query = Contract::with(['client', 'property.bloc.tranche.project.company']);

        if ($blocId) {
            $query->whereHas('property', function ($q) use ($blocId) {
                $q->where('bloc_id', $blocId);
            });
        }

        $dbContracts = $query->latest()->get()->map(function ($contract) {
            $startDate = $contract->date ? $contract->date->format('Y-m-d') : '';
            $endDate = '';
            if ($contract->date && $contract->payment_duration) {
                $endDate = $contract->date->copy()->addMonths($contract->payment_duration)->format('Y-m-d');
            }

            $amount = $contract->price ? '€'.number_format($contract->price) : '';
            if ($contract->payment_frequency && $contract->payment_frequency < 12 && $contract->price < 10000) {
                $amount .= ' / mo';
            }

            $type = 'Sale';
            if ($contract->status === 'draft') {
                $type = 'Reservation';
            } elseif ($contract->payment_duration > 0 && $contract->price < 20000) {
                $type = 'Rental';
            }

            $status = 'Active';
            if ($contract->status === 'draft') {
                $status = 'Pending';
            } elseif ($contract->status === 'completed') {
                $status = 'Completed';
            } elseif ($contract->status === 'cancelled') {
                $status = 'Expired';
            }

            return [
                'id' => (string) $contract->id,
                'contractNumber' => $contract->contract_number ?: 'CT-'.$contract->id,
                'clientName' => $contract->client ? $contract->client->full_name : 'Unknown',
                'clientId' => (string) $contract->client_id,
                'email' => $contract->client ? $contract->client->email : '',
                'phone' => $contract->client ? $contract->client->phone : '',
                'property' => $contract->property ? ($contract->property->name.' — '.($contract->property->bloc->tranche->project->name ?? '')) : '',
                'propertyId' => (string) $contract->property_id,
                'blocId' => (string) ($contract->property ? $contract->property->bloc_id : ''),
                'type' => $type,
                'startDate' => $startDate,
                'endDate' => $endDate,
                'amount' => $amount,
                'status' => $status,
            ];
        });

        return Inertia::render('ClientContracts', [
            'dbContracts' => $dbContracts,
        ]);
    })->name('client-contracts')->middleware('role:admin,manager');

    Route::get('/contract-create', function () {
        return Inertia::render('ContractCreate');
    })->name('contract-create')->middleware('role:admin,manager');

    Route::get('/contract-details', [ContractController::class, 'details'])->name('contract-details')->middleware('role:admin,manager');

    Route::get('/contracts/{contract}/edit', [ContractController::class, 'editStandalone'])
        ->name('contracts.edit')->middleware('role:admin,manager');

    Route::get('/admin-only', function () {
        return response('Admin only access', 200);
    })->name('admin-only')->middleware('role:admin');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Syndic Routes
    Route::get('/syndic', [\App\Http\Controllers\SyndicController::class, 'index'])->name('syndic.index');
    Route::get('/api/syndic/clients/search', [\App\Http\Controllers\SyndicController::class, 'searchClients'])->name('syndic.clients.search');
    Route::post('/syndic', [\App\Http\Controllers\SyndicController::class, 'store'])->name('syndic.store');
    Route::put('/syndic/{syndic}', [\App\Http\Controllers\SyndicController::class, 'update'])->name('syndic.update');
    Route::patch('/syndic/{syndic}/status', [\App\Http\Controllers\SyndicController::class, 'updateStatus'])->name('syndic.update-status')->middleware('role:admin');
    Route::delete('/syndic/{syndic}', [\App\Http\Controllers\SyndicController::class, 'destroy'])->name('syndic.destroy')->middleware('role:admin');
    Route::get('/syndic/{syndic}/receipt', [\App\Http\Controllers\SyndicController::class, 'printReceipt'])->name('syndic.receipt');

    Route::post('/syndic-charges', [\App\Http\Controllers\SyndicChargeController::class, 'store'])->name('syndic-charges.store');
    Route::put('/syndic-charges/{syndicCharge}', [\App\Http\Controllers\SyndicChargeController::class, 'update'])->name('syndic-charges.update');
    Route::delete('/syndic-charges/{syndicCharge}', [\App\Http\Controllers\SyndicChargeController::class, 'destroy'])->name('syndic-charges.destroy')->middleware('role:admin');

    Route::apiResource('syndic-charge-types', \App\Http\Controllers\SyndicChargeTypeController::class);
    
    Route::get('/syndic/bilan', [\App\Http\Controllers\SyndicBilanController::class, 'printBilan'])->name('syndic.bilan');

    // Two-Factor Authentication routes
    Route::post('/user/two-factor-authentication', [TwoFactorAuthenticationController::class, 'store'])
        ->name('two-factor.enable');
    Route::delete('/user/two-factor-authentication', [TwoFactorAuthenticationController::class, 'destroy'])
        ->name('two-factor.disable');
    Route::post('/user/confirmed-two-factor-authentication', [TwoFactorAuthenticationController::class, 'confirm'])
        ->name('two-factor.confirm');
    Route::post('/user/two-factor-recovery-codes', [TwoFactorAuthenticationController::class, 'showRecoveryCodes'])
        ->middleware('throttle:auth')
        ->name('two-factor.recovery-codes');
    Route::post('/user/two-factor-recovery-codes/regenerate', [TwoFactorAuthenticationController::class, 'generateRecoveryCodes'])
        ->name('two-factor.regenerate-recovery-codes');
});

require __DIR__.'/auth.php';
