<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user for testing
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);
        $this->actingAs($admin);
    }

    /**
     * Test that users can be listed.
     */
    public function test_users_can_be_listed(): void
    {
        // Create test users
        User::factory()->count(3)->create();

        $response = $this->get(route('settings.users'));

        $response->assertStatus(200);
        $response->assertInertia(function ($page) {
            $page->component('SettingsUsers')
                ->has('users', 4); // 3 created + 1 admin
        });
    }

    /**
     * Test that a new user can be created.
     */
    public function test_user_can_be_created(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'manager',
        ];

        $response = $this->post(route('users.store'), $userData);

        $response->assertRedirect(route('settings.users'));
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'role' => 'manager',
        ]);
    }

    /**
     * Test that user creation validation works.
     */
    public function test_user_creation_validation_fails_with_invalid_data(): void
    {
        $invalidData = [
            'name' => '',
            'email' => 'invalid-email',
            'password' => '123',
            'password_confirmation' => '456',
            'role' => 'invalid-role',
        ];

        $response = $this->post(route('users.store'), $invalidData);

        $response->assertSessionHasErrors(['name', 'email', 'password', 'role']);
    }

    /**
     * Test that an existing user can be updated.
     */
    public function test_user_can_be_updated(): void
    {
        $user = User::factory()->create([
            'name' => 'Original Name',
            'email' => 'original@example.com',
            'role' => 'user',
        ]);

        $updateData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'password' => '',
            'password_confirmation' => '',
            'role' => 'admin',
        ];

        $response = $this->put(route('users.update', $user), $updateData);

        $response->assertRedirect(route('settings.users'));
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'admin',
        ]);
    }

    /**
     * Test that user password can be updated.
     */
    public function test_user_password_can_be_updated(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('oldpassword'),
            'role' => 'user',
        ]);

        $updateData = [
            'name' => $user->name,
            'email' => $user->email,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
            'role' => $user->role,
        ];

        $response = $this->put(route('users.update', $user), $updateData);

        $response->assertRedirect();

        // Verify password was updated
        $this->assertTrue(\Hash::check('newpassword123', $user->fresh()->password));
    }

    /**
     * Test that user update validation works.
     */
    public function test_user_update_validation_fails_with_invalid_data(): void
    {
        $user = User::factory()->create();

        $invalidData = [
            'name' => '',
            'email' => 'invalid-email',
            'password' => '123',
            'password_confirmation' => '456',
            'role' => 'invalid-role',
        ];

        $response = $this->put(route('users.update', $user), $invalidData);

        $response->assertSessionHasErrors(['name', 'email', 'password', 'role']);
    }

    /**
     * Test that a user can be deleted.
     */
    public function test_user_can_be_deleted(): void
    {
        $user = User::factory()->create();

        $response = $this->delete(route('users.destroy', $user));

        $response->assertRedirect(route('settings.users'));
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    /**
     * Test that user active status can be toggled.
     */
    public function test_user_active_status_can_be_toggled(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        // Activate user
        $response = $this->patch(route('users.toggle-active', $user));

        $response->assertRedirect();
        $this->assertNotNull($user->fresh()->email_verified_at);

        // Deactivate user
        $response = $this->patch(route('users.toggle-active', $user));

        $response->assertRedirect();
        $this->assertNull($user->fresh()->email_verified_at);
    }
}
