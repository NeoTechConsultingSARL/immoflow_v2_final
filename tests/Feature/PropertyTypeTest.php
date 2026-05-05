<?php

namespace Tests\Feature;

use App\Models\PropertyType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyTypeTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_view_property_types_index(): void
    {
        PropertyType::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->get(route('property-types'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('PropertyTypes/Index')
            ->has('propertyTypes', 3)
        );
    }

    public function test_admin_can_create_property_type(): void
    {
        $data = [
            'name' => 'Apartment',
            'description' => 'Residential apartment units',
            'icon' => 'Building',
        ];

        $response = $this->actingAs($this->admin)->post(route('property-types.store'), $data);

        $response->assertRedirect(route('property-types'));
        $this->assertDatabaseHas('property_types', $data);
    }

    public function test_admin_can_update_property_type(): void
    {
        $propertyType = PropertyType::factory()->create();

        $data = [
            'name' => 'Updated Apartment',
            'description' => 'Updated description',
            'icon' => 'Home',
        ];

        $response = $this->actingAs($this->admin)->put(route('property-types.update', $propertyType), $data);

        $response->assertRedirect(route('property-types'));
        $this->assertDatabaseHas('property_types', [
            'id' => $propertyType->id,
            'name' => 'Updated Apartment',
            'description' => 'Updated description',
            'icon' => 'Home',
        ]);
    }

    public function test_admin_can_delete_property_type(): void
    {
        $propertyType = PropertyType::factory()->create();

        $response = $this->actingAs($this->admin)->delete(route('property-types.destroy', $propertyType));

        $response->assertRedirect(route('property-types'));
        $this->assertDatabaseMissing('property_types', ['id' => $propertyType->id]);
    }

    public function test_name_must_be_unique(): void
    {
        PropertyType::factory()->create(['name' => 'Apartment']);

        $data = [
            'name' => 'Apartment',
            'description' => 'Duplicate name',
            'icon' => 'Building',
        ];

        $response = $this->actingAs($this->admin)->post(route('property-types.store'), $data);

        $response->assertSessionHasErrors('name');
    }

    public function test_name_is_required(): void
    {
        $data = [
            'name' => '',
            'description' => 'Test description',
            'icon' => 'Building',
        ];

        $response = $this->actingAs($this->admin)->post(route('property-types.store'), $data);

        $response->assertSessionHasErrors('name');
    }

    public function test_regular_user_cannot_access_property_types(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('property-types'));

        $response->assertStatus(403);
    }

    public function test_manager_can_access_property_types(): void
    {
        $manager = User::factory()->create(['role' => 'manager']);

        $response = $this->actingAs($manager)->get(route('property-types'));

        $response->assertStatus(200);
    }
}
