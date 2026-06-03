<?php

namespace Tests\Feature;

use App\Models\Bloc;
use App\Models\Project;
use App\Models\Shareholder;
use App\Models\THistory;
use App\Models\Tranche;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShareholderTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $manager;

    protected Bloc $bloc;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->manager = User::factory()->create(['role' => 'manager']);

        $project = Project::factory()->create(['name' => 'Spree Lofts']);
        $tranche = Tranche::factory()->for($project)->create(['name' => 'Tranche A']);
        $this->bloc = Bloc::factory()->for($tranche)->create(['name' => 'Bloc 1']);
    }

    public function test_admin_can_view_shareholders_index(): void
    {
        Shareholder::factory()->for($this->bloc)->count(2)->create();

        $response = $this->actingAs($this->admin)
            ->get(route('blocs.shareholders.index', $this->bloc));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Shareholders')
            ->has('shareholders', 2)
            ->where('totalCapital', fn ($total) => $total > 0)
        );
    }

    public function test_admin_can_view_project_finance_hub(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('blocs.finance', $this->bloc));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('ProjectFinance'));
    }

    public function test_admin_can_create_shareholder_for_bloc(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('blocs.shareholders.store', $this->bloc), [
                'name' => 'Ahmed Benali',
                'amount' => 150000.50,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('shareholders', [
            'name' => 'Ahmed Benali',
            'bloc_id' => $this->bloc->id,
            'amount' => '150000.50',
            'created_by' => $this->admin->id,
        ]);
    }

    public function test_admin_can_update_shareholder(): void
    {
        $shareholder = Shareholder::factory()->for($this->bloc)->create([
            'name' => 'Old Name',
            'amount' => 1000,
        ]);

        $response = $this->actingAs($this->admin)
            ->put(route('shareholders.update', $shareholder), [
                'name' => 'New Name',
                'amount' => 2500.75,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('shareholders', [
            'id' => $shareholder->id,
            'name' => 'New Name',
            'amount' => '2500.75',
            'updated_by' => $this->admin->id,
        ]);
    }

    public function test_admin_can_delete_shareholder(): void
    {
        $shareholder = Shareholder::factory()->for($this->bloc)->create();

        $response = $this->actingAs($this->admin)
            ->delete(route('shareholders.destroy', $shareholder));

        $response->assertRedirect();
        $this->assertDatabaseMissing('shareholders', ['id' => $shareholder->id]);
    }

    public function test_manager_cannot_access_shareholder_routes(): void
    {
        $shareholder = Shareholder::factory()->for($this->bloc)->create();

        $this->actingAs($this->manager)
            ->get(route('blocs.shareholders.index', $this->bloc))
            ->assertStatus(403);

        $this->actingAs($this->manager)
            ->post(route('blocs.shareholders.store', $this->bloc), [
                'name' => 'Blocked',
                'amount' => 100,
            ])
            ->assertStatus(403);

        $this->actingAs($this->manager)
            ->put(route('shareholders.update', $shareholder), [
                'name' => 'Blocked',
                'amount' => 100,
            ])
            ->assertStatus(403);

        $this->actingAs($this->manager)
            ->delete(route('shareholders.destroy', $shareholder))
            ->assertStatus(403);
    }

    public function test_validation_failure_does_not_create_shareholder_or_history(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('blocs.shareholders.store', $this->bloc), [
                'name' => str_repeat('a', 101),
                'amount' => 0,
            ]);

        $response->assertSessionHasErrors(['name', 'amount']);
        $this->assertDatabaseCount('shareholders', 0);
        $this->assertDatabaseCount('t_history', 0);
    }

    public function test_audit_log_written_on_create_update_delete(): void
    {
        $shareholder = Shareholder::factory()->for($this->bloc)->create([
            'name' => 'Karim',
            'amount' => 50000,
        ]);

        $this->assertDatabaseHas('t_history', [
            'user_id' => null,
        ]);

        $createLog = THistory::where('description', 'like', 'Ajout%')->first();
        $this->assertNotNull($createLog);
        $this->assertStringContainsString('Bloc: Bloc 1', $createLog->description);
        $this->assertStringContainsString('Projet: Spree Lofts', $createLog->description);
        $this->assertStringContainsString('Associé : Karim', $createLog->description);

        $this->actingAs($this->admin)
            ->put(route('shareholders.update', $shareholder), [
                'name' => 'Karim Updated',
                'amount' => 60000,
            ]);

        $this->assertTrue(
            THistory::where('description', 'like', 'Modification%')->exists()
        );

        $this->actingAs($this->admin)
            ->delete(route('shareholders.destroy', $shareholder));

        $this->assertTrue(
            THistory::where('description', 'like', 'Suppression%')->exists()
        );
    }

    public function test_shareholder_is_cascade_deleted_with_bloc(): void
    {
        $shareholder = Shareholder::factory()->for($this->bloc)->create();

        $this->bloc->forceDelete();

        $this->assertDatabaseMissing('shareholders', ['id' => $shareholder->id]);
    }
}
