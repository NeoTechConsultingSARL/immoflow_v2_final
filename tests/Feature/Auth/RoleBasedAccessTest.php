<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class RoleBasedAccessTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_unauthenticated_user_cannot_access_dashboard(): void
    {
        $response = $this->get('/dashboard');

        $response->assertRedirect('/login');
    }

    public function test_unauthenticated_user_cannot_access_protected_routes(): void
    {
        $routes = ['/companies', '/projects', '/settings', '/settings/users'];

        foreach ($routes as $route) {
            $response = $this->get($route);
            $response->assertRedirect('/login');
        }
    }

    public function test_authenticated_user_can_access_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_admin_can_access_companies_route(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/companies');

        $response->assertStatus(200);
    }

    public function test_manager_can_access_companies_route(): void
    {
        $manager = User::factory()->create(['role' => 'manager']);

        $response = $this->actingAs($manager)->get('/companies');

        $response->assertStatus(200);
    }

    public function test_user_cannot_access_companies_route(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/companies');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_settings(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/settings');

        $response->assertStatus(200);
    }

    public function test_manager_cannot_access_settings(): void
    {
        $manager = User::factory()->create(['role' => 'manager']);

        $response = $this->actingAs($manager)->get('/settings');

        $response->assertStatus(403);
    }

    public function test_user_cannot_access_settings(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/settings');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_settings_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/settings/users');

        $response->assertStatus(200);
    }

    public function test_admin_can_access_settings_profiles(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/settings/profiles');

        $response->assertStatus(200);
    }

    public function test_manager_can_access_projects(): void
    {
        $manager = User::factory()->create(['role' => 'manager']);

        $response = $this->actingAs($manager)->get('/projects');

        $response->assertStatus(200);
    }

    public function test_user_cannot_access_projects(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/projects');

        $response->assertStatus(403);
    }

    public function test_manager_can_access_tranches(): void
    {
        $manager = User::factory()->create(['role' => 'manager']);

        $response = $this->actingAs($manager)->get('/tranches');

        $response->assertStatus(200);
    }

    public function test_user_cannot_access_tranches(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/tranches');

        $response->assertStatus(403);
    }

    public function test_manager_can_access_blocs(): void
    {
        $manager = User::factory()->create(['role' => 'manager']);

        $response = $this->actingAs($manager)->get('/blocs');

        $response->assertStatus(200);
    }

    public function test_user_cannot_access_blocs(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/blocs');

        $response->assertStatus(403);
    }

    public function test_all_authenticated_users_can_access_properties(): void
    {
        $users = [
            User::factory()->create(['role' => 'admin']),
            User::factory()->create(['role' => 'manager']),
            User::factory()->create(['role' => 'user']),
        ];

        foreach ($users as $user) {
            $response = $this->actingAs($user)->get('/properties');
            $response->assertStatus(200);
        }
    }

    public function test_user_role_is_available_in_props(): void
    {
        $user = User::factory()->create(['role' => 'manager']);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->has('auth.user', fn (AssertableInertia $user) => $user
                ->where('role', 'manager')
            )
        );
    }
}
