<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class SyndicModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_syndic_module_tables_are_created_by_migrations(): void
    {
        $this->assertTrue(Schema::hasTable('syndics'));
        $this->assertTrue(Schema::hasTable('syndic_charge_types'));
        $this->assertTrue(Schema::hasTable('syndic_charges'));
    }

    public function test_authenticated_user_can_open_syndic_index_without_sql_table_errors(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('syndic.index', absolute: false));

        $response->assertOk();
    }

    public function test_authenticated_user_can_search_clients_endpoint(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson(route('syndic.clients.search', ['q' => ''], false));

        $response->assertOk();
    }
}
