<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyCRUDTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_view_companies_list(): void
    {
        Company::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->get(route('companies'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Companies/Index')
            ->has('companies', 3)
            ->has('statusOptions')
        );
    }

    public function test_admin_can_create_company(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('companies.store'), [
                'name' => 'New Test Company',
                'status' => 'active',
                'description' => 'A test description',
                'email' => 'test@company.com',
                'address' => '123 Test St',
                'phone' => '+123456789',
                'website' => 'https://testcompany.com',
                'properties' => 5,
                'rc' => 'RC-998877',
                'if' => 'IF-112233',
                'patent' => 'PAT-445566',
                'fax' => '+123456780',
            ]);

        $response->assertRedirect(route('companies'));
        $this->assertDatabaseHas('companies', [
            'name' => 'New Test Company',
            'status' => 'active',
            'rc' => 'RC-998877',
            'if' => 'IF-112233',
            'patent' => 'PAT-445566',
            'fax' => '+123456780',
        ]);
    }

    public function test_admin_can_update_company(): void
    {
        $company = Company::factory()->create([
            'name' => 'Old Name',
            'rc' => 'RC-1111',
            'if' => 'IF-2222',
            'patent' => 'PAT-3333',
            'fax' => '+1234',
        ]);

        $response = $this->actingAs($this->admin)
            ->put(route('companies.update', $company), [
                'name' => 'Updated Name',
                'status' => 'inactive',
                'description' => 'Updated description',
                'email' => 'updated@company.com',
                'address' => '456 Updated St',
                'phone' => '+987654321',
                'website' => 'https://updatedcompany.com',
                'properties' => 10,
                'rc' => 'RC-9999',
                'if' => 'IF-8888',
                'patent' => 'PAT-7777',
                'fax' => '+4321',
            ]);

        $response->assertRedirect(route('companies'));
        $this->assertDatabaseHas('companies', [
            'id' => $company->id,
            'name' => 'Updated Name',
            'status' => 'inactive',
            'rc' => 'RC-9999',
            'if' => 'IF-8888',
            'patent' => 'PAT-7777',
            'fax' => '+4321',
        ]);
    }

    public function test_validation_errors_for_invalid_data(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('companies.store'), [
                'name' => '', // Required
                'status' => 'invalid_status', // In:active,inactive
                'email' => 'not-an-email',
                'website' => 'not-a-url',
                'properties' => -5, // Min: 0
            ]);

        $response->assertSessionHasErrors(['name', 'status', 'email', 'website', 'properties']);
    }
}
