<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

echo "=== CRÉATION DES COMPTES DE TEST ===\n";

// Create activated admin account
$activatedAdmin = App\Models\User::updateOrCreate(
    ['email' => 'admin@test.com'],
    [
        'name' => 'Admin Activated',
        'password' => Hash::make('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
    ]
);

// Create non-activated admin account
$nonActivatedAdmin = App\Models\User::updateOrCreate(
    ['email' => 'admin_nonactive@test.com'],
    [
        'name' => 'Admin Non-Activated',
        'password' => Hash::make('password'),
        'role' => 'admin',
        'email_verified_at' => null, // Non-activated
    ]
);

// Create activated manager account
$activatedManager = App\Models\User::updateOrCreate(
    ['email' => 'manager@test.com'],
    [
        'name' => 'Manager Activated',
        'password' => Hash::make('password'),
        'role' => 'manager',
        'email_verified_at' => now(),
    ]
);

// Create non-activated manager account
$nonActivatedManager = App\Models\User::updateOrCreate(
    ['email' => 'manager_nonactive@test.com'],
    [
        'name' => 'Manager Non-Activated',
        'password' => Hash::make('password'),
        'role' => 'manager',
        'email_verified_at' => null, // Non-activated
    ]
);

echo "✅ Comptes de test créés avec succès!\n\n";
echo "=== COMPTES ACTIVÉS (peuvent accéder aux Companies) ===\n";
echo "Admin Activé: admin@test.com / password\n";
echo "Manager Activé: manager@test.com / password\n\n";
echo "=== COMPTES NON-ACTIVÉS (accès refusé) ===\n";
echo "Admin Non-Activé: admin_nonactive@test.com / password\n";
echo "Manager Non-Activé: manager_nonactive@test.com / password\n\n";
echo "=== TESTS À EFFECTUER ===\n";
echo "1. Connectez-vous avec admin@test.com → Accès Companies OK\n";
echo "2. Connectez-vous avec admin_nonactive@test.com → Accès Companies REFUSÉ\n";
echo "3. Connectez-vous avec manager@test.com → Accès Companies OK\n";
echo "4. Connectez-vous avec manager_nonactive@test.com → Accès Companies REFUSÉ\n";
