<?php

namespace Tests\Feature;

use App\Models\Bloc;
use App\Models\BusinessPlanCost;
use App\Models\BusinessPlanProduct;
use App\Models\Project;
use App\Models\Shareholder;
use App\Models\Tranche;
use App\Models\User;
use App\Services\BusinessPlanCalculationService;
use Database\Seeders\BusinessPlanTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BusinessPlanTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $manager;

    protected Bloc $bloc;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(BusinessPlanTypeSeeder::class);

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->manager = User::factory()->create(['role' => 'manager']);

        $project = Project::factory()->create(['name' => 'Lamssa']);
        $tranche = Tranche::factory()->for($project)->create(['name' => 'Tranche A']);
        $this->bloc = Bloc::factory()->for($tranche)->create(['name' => 'Bloc 1']);
    }

    public function test_admin_can_view_business_plan(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('blocs.business-plan.show', $this->bloc));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('BusinessPlan')
            ->has('products')
            ->has('costs')
            ->has('summary')
        );
    }

    public function test_manager_cannot_access_business_plan(): void
    {
        $this->actingAs($this->manager)
            ->get(route('blocs.business-plan.show', $this->bloc))
            ->assertStatus(403);
    }

    public function test_admin_can_crud_products_and_costs(): void
    {
        $this->actingAs($this->admin)
            ->post(route('blocs.business-plan.products.store', $this->bloc), [
                'product_type' => 'APPARTEMENT VENDU',
                'land_size' => 100,
                'unit_price' => 9500,
                'amount' => 950000,
                'description' => null,
            ])
            ->assertRedirect();

        $this->actingAs($this->admin)
            ->post(route('blocs.business-plan.costs.store', $this->bloc), [
                'cost_type' => 'ARCHITECTE',
                'land_size' => null,
                'unit_price' => null,
                'amount' => 500000,
                'description' => null,
            ])
            ->assertRedirect();

        $this->assertDatabaseCount('business_plan_products', 1);
        $this->assertDatabaseCount('business_plan_costs', 1);

        $product = BusinessPlanProduct::first();
        $cost = BusinessPlanCost::first();

        $this->actingAs($this->admin)
            ->put(route('business-plan.products.update', $product), [
                'product_type' => 'VILLA',
                'land_size' => 200,
                'unit_price' => 10000,
                'amount' => 2000000,
            ])
            ->assertRedirect();

        $this->actingAs($this->admin)
            ->delete(route('business-plan.products.destroy', $product))
            ->assertRedirect();

        $this->actingAs($this->admin)
            ->delete(route('business-plan.costs.destroy', $cost))
            ->assertRedirect();
    }

    public function test_calculation_service_profit_and_dividends(): void
    {
        BusinessPlanProduct::factory()->for($this->bloc)->create(['amount' => 106081000]);
        BusinessPlanCost::factory()->for($this->bloc)->create(['amount' => 75610429]);

        Shareholder::factory()->for($this->bloc)->create([
            'name' => 'Société Lamssa Immo',
            'amount' => 75610429,
        ]);

        $summary = app(BusinessPlanCalculationService::class)->aggregate($this->bloc);

        $this->assertEquals(106081000.0, $summary['totalProducts']);
        $this->assertEquals(75610429.0, $summary['totalCosts']);
        $this->assertEquals(30470571.0, $summary['estimatedProfit']);
        $this->assertEquals(100.0, $summary['shareholderDistributions'][0]['percentage']);
        $this->assertEquals(30470571.0, $summary['shareholderDistributions'][0]['dividend']);
        $this->assertEquals(0.0, $summary['companyDistribution']['contribution']);
        $this->assertEquals(0.0, $summary['companyDistribution']['dividend']);
    }

    public function test_zero_costs_avoid_division_errors(): void
    {
        BusinessPlanProduct::factory()->for($this->bloc)->create(['amount' => 1000]);

        $summary = app(BusinessPlanCalculationService::class)->aggregate($this->bloc);

        $this->assertEquals(0.0, $summary['totalCosts']);
        $this->assertEquals(1000.0, $summary['estimatedProfit']);
        $this->assertEquals(0.0, $summary['companyDistribution']['percentage']);
        $this->assertEquals(0.0, $summary['companyDistribution']['dividend']);
    }

    public function test_company_gap_dividend_when_shareholders_underfund_costs(): void
    {
        BusinessPlanProduct::factory()->for($this->bloc)->create(['amount' => 1000000]);
        BusinessPlanCost::factory()->for($this->bloc)->create(['amount' => 800000]);
        Shareholder::factory()->for($this->bloc)->create(['name' => 'Partner A', 'amount' => 300000]);

        $summary = app(BusinessPlanCalculationService::class)->aggregate($this->bloc);

        $this->assertEquals(500000.0, $summary['companyGap']);
        $this->assertEquals(62.5, $summary['companyDistribution']['percentage']);
        $this->assertEquals(125000.0, $summary['companyDistribution']['dividend']);
    }

    public function test_validation_rejects_invalid_lines(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('blocs.business-plan.products.store', $this->bloc), [
                'product_type' => '',
                'amount' => -1,
            ]);

        $response->assertSessionHasErrors(['product_type', 'amount']);
        $this->assertDatabaseCount('business_plan_products', 0);
    }

    public function test_lines_are_scoped_to_bloc(): void
    {
        $product = BusinessPlanProduct::factory()->for($this->bloc)->create();

        $this->assertEquals($this->bloc->id, $product->bloc_id);
        $this->assertDatabaseMissing('business_plan_products', [
            'id' => $product->id,
            'bloc_id' => Bloc::factory()->create()->id,
        ]);
    }
}
