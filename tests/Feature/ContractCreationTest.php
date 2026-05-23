<?php

namespace Tests\Feature;

use App\Models\Bloc;
use App\Models\Client;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContractCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_contract_with_auto_generated_schedule()
    {
        // 1. Préparation des données de test
        $user = User::factory()->create();
        
        // Créer les entités nécessaires
        $property = Property::factory()->create([
            'status' => 'available',
            'price' => 100000,
        ]);
        $blocId = $property->bloc_id; // Récupère le bloc de la propriété
        
        $client = Client::factory()->create();

        // 2. Préparation du payload (les données du formulaire)
        $payload = [
            'client_id' => $client->id,
            'property_id' => $property->id,
            'contract_number' => 'CTR-TEST-001',
            'price' => 100000,
            'advance' => 20000,
            'paymentDuration' => 12, // 12 mois
            'paymentFrequency' => 3, // Tous les 3 mois
            'withDetails' => false, // Auto-génération de l'échéancier
        ];

        // 3. Exécution de la requête POST comme si on était sur le navigateur
        $response = $this->actingAs($user)
            ->post(route('blocs.contracts.store', $blocId), $payload);

        // 4. Vérifications (Assertions)
        $response->assertRedirect(); // Vérifie que ça redirige après succès
        
        // Vérifie que le contrat est en base de données
        $this->assertDatabaseHas('contracts', [
            'contract_number' => 'CTR-TEST-001',
            'property_id' => $property->id,
        ]);

        // Vérifie que le statut de l'unité est passé à "Vendu"
        $this->assertDatabaseHas('properties', [
            'id' => $property->id,
            'status' => 'Vendu',
        ]);

        // Vérifie que la logique d'auto-génération a bien fonctionné
        // 12 mois / 3 mois = 4 paiements
        $this->assertDatabaseCount('payment_schedules', 4);
    }
}
