<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectCRUDTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected Company $company;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->company = Company::factory()->create();
    }

    public function test_admin_can_view_projects_list(): void
    {
        $project = Project::factory()->create(['company_id' => $this->company->id]);

        $response = $this->actingAs($this->admin)
            ->get(route('projects'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Projects')
            ->has('projects', 1)
            ->has('companies')
        );
    }

    public function test_admin_can_create_project(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('projects.store'), [
                'name' => 'New Test Project',
                'company_id' => $this->company->id,
                'status' => 'Planning',
                'budget' => '10M',
                'address' => 'Test Address',
                'start_date' => '2025-01-01',
                'units' => 10,
                'description' => 'Test Description',
            ]);

        $response->assertRedirect(route('projects'));
        $this->assertDatabaseHas('projects', [
            'name' => 'New Test Project',
            'company_id' => $this->company->id,
        ]);
    }

    public function test_admin_can_update_project(): void
    {
        $project = Project::factory()->create(['company_id' => $this->company->id]);

        $response = $this->actingAs($this->admin)
            ->put(route('projects.update', $project), [
                'name' => 'Updated Project Name',
                'company_id' => $this->company->id,
                'status' => 'In Progress',
            ]);

        $response->assertRedirect(route('projects'));
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Project Name',
        ]);
    }

    public function test_admin_can_delete_project(): void
    {
        $project = Project::factory()->create(['company_id' => $this->company->id]);

        $response = $this->actingAs($this->admin)
            ->delete(route('projects.destroy', $project));

        $response->assertRedirect(route('projects'));
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_deleting_company_deletes_associated_projects(): void
    {
        $project = Project::factory()->create(['company_id' => $this->company->id]);

        $this->assertDatabaseHas('projects', ['id' => $project->id]);

        $this->company->delete();

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }
}
