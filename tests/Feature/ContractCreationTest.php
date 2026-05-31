<?php

namespace Tests\Feature;

use App\Models\Bloc;
use App\Models\Client;
use App\Models\Contract;
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

    public function test_can_view_contract_details()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $property = Property::factory()->create(['status' => 'available']);
        $client = Client::factory()->create();
        $contract = Contract::create([
            'client_id' => $client->id,
            'property_id' => $property->id,
            'contract_number' => 'CT-DETAILS-001',
            'price' => 250000,
            'advance' => 50000,
            'payment_duration' => 24,
            'payment_frequency' => 3,
            'date' => now(),
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)
            ->get(route('contract-details', ['id' => $contract->id]));

        $response->assertStatus(200);
    }

    public function test_can_generate_pdf_templates()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $property = Property::factory()->create(['status' => 'available']);
        $client = Client::factory()->create();
        $contract = Contract::create([
            'client_id' => $client->id,
            'property_id' => $property->id,
            'contract_number' => 'CT-PDF-001',
            'price' => 250000,
            'advance' => 50000,
            'date' => now(),
            'status' => 'active',
        ]);

        $blocId = $property->bloc_id;

        // Test English contract template
        $response = $this->actingAs($user)
            ->get(route('blocs.contracts.pdf', ['bloc' => $blocId, 'contract' => $contract->id, 'template' => 'en']));
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');

        // Test Resell certificate template
        $response = $this->actingAs($user)
            ->get(route('blocs.contracts.pdf', ['bloc' => $blocId, 'contract' => $contract->id, 'template' => 'resell']));
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');

        // Test Full payment attestation template
        $response = $this->actingAs($user)
            ->get(route('blocs.contracts.pdf', ['bloc' => $blocId, 'contract' => $contract->id, 'template' => 'full_payment']));
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_can_add_payment_schedule_entry()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $property = Property::factory()->create();
        $client = Client::factory()->create();
        $contract = Contract::create([
            'client_id' => $client->id,
            'property_id' => $property->id,
            'contract_number' => 'CT-PAY-001',
            'price' => 100000,
            'status' => 'active',
        ]);

        $payload = [
            'due_date' => '2026-06-15',
            'amount' => 5000,
            'observation' => 'Test observation',
        ];

        $response = $this->actingAs($user)
            ->post(route('contracts.payments.store', ['contract' => $contract->id]), $payload);

        $response->assertRedirect();
        $this->assertDatabaseHas('payment_schedules', [
            'contract_id' => $contract->id,
            'amount' => 5000,
            'observation' => 'Test observation',
        ]);
    }

    public function test_can_delete_payment_schedule_entry()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $property = Property::factory()->create();
        $client = Client::factory()->create();
        $contract = Contract::create([
            'client_id' => $client->id,
            'property_id' => $property->id,
            'contract_number' => 'CT-PAY-DEL-001',
            'price' => 100000,
            'status' => 'active',
        ]);

        $payment = $contract->paymentSchedules()->create([
            'due_date' => '2026-06-15',
            'amount' => 5000,
        ]);

        $response = $this->actingAs($user)
            ->delete(route('contracts.payments.destroy', ['contract' => $contract->id, 'paymentSchedule' => $payment->id]));

        $response->assertRedirect();
        $this->assertDatabaseMissing('payment_schedules', ['id' => $payment->id]);
    }

    public function test_can_save_broker_commission()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $property = Property::factory()->create();
        $client = Client::factory()->create();
        $contract = Contract::create([
            'client_id' => $client->id,
            'property_id' => $property->id,
            'contract_number' => 'CT-COMM-001',
            'price' => 100000,
            'status' => 'active',
        ]);

        $payload = [
            'broker_name' => 'Broker Agency',
            'amount' => 3000,
            'description' => 'Test broker commission',
            'status' => 'Pending',
        ];

        $response = $this->actingAs($user)
            ->post(route('contracts.commissions.store', ['contract' => $contract->id]), $payload);

        $response->assertRedirect();
        $this->assertDatabaseHas('contract_commissions', [
            'contract_id' => $contract->id,
            'broker_name' => 'Broker Agency',
            'amount' => 3000,
            'status' => 'Pending',
        ]);
    }

    public function test_can_save_modification_notes()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $property = Property::factory()->create();
        $client = Client::factory()->create();
        $contract = Contract::create([
            'client_id' => $client->id,
            'property_id' => $property->id,
            'contract_number' => 'CT-MOD-001',
            'price' => 100000,
            'status' => 'active',
        ]);

        $payload = [
            'notes' => 'VIP Client - modification requested.',
        ];

        $response = $this->actingAs($user)
            ->post(route('contracts.modifications.store', ['contract' => $contract->id]), $payload);

        $response->assertRedirect();
        $this->assertDatabaseHas('contract_modifications', [
            'contract_id' => $contract->id,
            'notes' => 'VIP Client - modification requested.',
        ]);
    }
}
