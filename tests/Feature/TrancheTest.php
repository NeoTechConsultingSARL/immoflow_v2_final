<?php

namespace Tests\Feature;

use App\Models\Bloc;
use App\Models\Company;
use App\Models\Project;
use App\Models\Tranche;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrancheTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected Project $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);

        $company = Company::factory()->create();
        $this->project = Project::factory()->create(['company_id' => $company->id]);
    }

    public function test_admin_can_view_tranches_index(): void
    {
        Tranche::factory()->count(3)->create(['project_id' => $this->project->id]);
        Tranche::factory()->create(); // Another tranche for a different project

        $response = $this->actingAs($this->admin)->get(route('tranches'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Tranches')
            ->has('tranches', 4)
            ->has('projects')
        );
    }

    public function test_admin_can_filter_tranches_by_project(): void
    {
        Tranche::factory()->count(3)->create(['project_id' => $this->project->id]);
        Tranche::factory()->count(2)->create(); // Different projects

        $response = $this->actingAs($this->admin)->get(route('tranches', ['project' => $this->project->id]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Tranches')
            ->has('tranches', 3)
            ->where('filters.project', (string) $this->project->id)
        );
    }

    public function test_admin_can_create_tranche(): void
    {
        $data = [
            'name' => 'New Tranche',
            'project_id' => $this->project->id,
            'status' => 'active',
        ];

        $response = $this->actingAs($this->admin)->post(route('tranches.store'), $data);

        $response->assertRedirect(route('tranches'));
        $this->assertDatabaseHas('tranches', $data);
    }

    public function test_admin_can_update_tranche(): void
    {
        $tranche = Tranche::factory()->create(['project_id' => $this->project->id]);

        $data = [
            'name' => 'Updated Tranche Name',
            'status' => 'inactive',
        ];

        $response = $this->actingAs($this->admin)->put(route('tranches.update', $tranche), $data);

        $response->assertRedirect(route('tranches'));
        $this->assertDatabaseHas('tranches', [
            'id' => $tranche->id,
            'name' => 'Updated Tranche Name',
            'status' => 'inactive',
        ]);
    }

    public function test_admin_can_delete_tranche(): void
    {
        $tranche = Tranche::factory()->create(['project_id' => $this->project->id]);

        $response = $this->actingAs($this->admin)->delete(route('tranches.destroy', $tranche));

        $response->assertRedirect(route('tranches'));
        $this->assertDatabaseMissing('tranches', ['id' => $tranche->id]);
    }

    public function test_deleting_project_cascades_to_tranches(): void
    {
        $tranche = Tranche::factory()->create(['project_id' => $this->project->id]);

        $this->project->delete();

        $this->assertDatabaseMissing('tranches', ['id' => $tranche->id]);
    }

    public function test_regular_user_cannot_access_tranches(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('tranches'));

        $response->assertStatus(403);
    }

    public function test_deleting_tranche_cascades_to_blocs(): void
    {
        $tranche = Tranche::factory()->create(['project_id' => $this->project->id]);
        $bloc = Bloc::factory()->create([
            'tranche_id' => $tranche->id,
            'units' => 15,
        ]);

        $this->assertEquals(15, $tranche->blocs()->sum('units'));

        $tranche->delete();

        $this->assertDatabaseMissing('blocs', ['id' => $bloc->id]);
    }
}
