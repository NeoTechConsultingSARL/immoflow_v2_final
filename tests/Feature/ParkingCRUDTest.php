<?php

namespace Tests\Feature;

use App\Models\Bloc;
use App\Models\Parking;
use App\Models\Project;
use App\Models\Tranche;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ParkingCRUDTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_view_parkings_list(): void
    {
        $project = Project::factory()->create();
        $tranche = Tranche::factory()->for($project)->create();
        $bloc = Bloc::factory()->for($tranche)->create();
        Parking::factory()->for($bloc)->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->get(route('parkings', ['bloc' => $bloc->id]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Parkings')
            ->has('parkings', 3)
            ->has('bloc')
        );
    }

    public function test_admin_can_create_parking_spaces_in_bulk(): void
    {
        $project = Project::factory()->create(['name' => 'Spree Lofts']);
        $tranche = Tranche::factory()->for($project)->create(['name' => 'Tranche 1']);
        $bloc = Bloc::factory()->for($tranche)->create(['name' => 'Bloc 1']);

        $response = $this->actingAs($this->admin)
            ->post(route('parkings.store'), [
                'bloc_id' => $bloc->id,
                'count' => 5,
                'status' => 'free',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('parkings', 5);
        $this->assertDatabaseHas('parkings', [
            'bloc_id' => $bloc->id,
            'status' => 'free',
        ]);
    }

    public function test_admin_can_update_parking_status(): void
    {
        $project = Project::factory()->create();
        $tranche = Tranche::factory()->for($project)->create();
        $bloc = Bloc::factory()->for($tranche)->create();
        $parking = Parking::factory()->for($bloc)->create(['status' => 'free']);

        $response = $this->actingAs($this->admin)
            ->put(route('parkings.update', $parking), [
                'status' => 'reserved',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('parkings', [
            'id' => $parking->id,
            'status' => 'reserved',
        ]);
    }

    public function test_admin_can_delete_parking(): void
    {
        $project = Project::factory()->create();
        $tranche = Tranche::factory()->for($project)->create();
        $bloc = Bloc::factory()->for($tranche)->create();
        $parking = Parking::factory()->for($bloc)->create();

        $response = $this->actingAs($this->admin)
            ->delete(route('parkings.destroy', $parking));

        $response->assertRedirect();
        $this->assertDatabaseMissing('parkings', [
            'id' => $parking->id,
        ]);
    }

    public function test_validation_errors_for_invalid_data(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('parkings.store'), [
                'bloc_id' => '', // Required
                'count' => 0, // Min: 1
            ]);

        $response->assertSessionHasErrors(['bloc_id', 'count']);
    }

    public function test_parking_names_are_unique_per_bloc(): void
    {
        $project = Project::factory()->create(['name' => 'Spree Lofts']);
        $tranche = Tranche::factory()->for($project)->create(['name' => 'Tranche 1']);
        $bloc = Bloc::factory()->for($tranche)->create(['name' => 'Bloc 1']);

        // Create first batch
        $this->actingAs($this->admin)
            ->post(route('parkings.store'), [
                'bloc_id' => $bloc->id,
                'count' => 3,
                'status' => 'free',
            ]);

        // Try to create same batch again - should skip duplicates
        $response = $this->actingAs($this->admin)
            ->post(route('parkings.store'), [
                'bloc_id' => $bloc->id,
                'count' => 3,
                'status' => 'free',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('parkings', 3); // Should still be 3, not 6
    }
}
