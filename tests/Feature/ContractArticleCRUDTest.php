<?php

namespace Tests\Feature;

use App\Models\ContractArticle;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContractArticleCRUDTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_view_contract_articles_index(): void
    {
        ContractArticle::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->get(route('settings.contract-articles.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('SettingsContractArticles')
            ->has('articles', 3)
        );
    }

    public function test_admin_can_create_contract_article(): void
    {
        $data = [
            'title' => 'ARTICLE 1',
            'description' => 'Test description with {projectName} placeholder.',
            'article_order' => 1,
            'status' => 'active',
        ];

        $response = $this->actingAs($this->admin)->post(route('settings.contract-articles.store'), $data);

        $response->assertRedirect(route('settings.contract-articles.index'));
        $this->assertDatabaseHas('contract_articles', $data);
    }

    public function test_admin_can_update_contract_article(): void
    {
        $article = ContractArticle::factory()->create([
            'title' => 'ARTICLE 1',
            'description' => 'Old description',
            'article_order' => 1,
            'status' => 'active',
        ]);

        $data = [
            'title' => 'ARTICLE 1 UPDATED',
            'description' => 'Updated description',
            'article_order' => 2,
            'status' => 'inactive',
        ];

        $response = $this->actingAs($this->admin)->put(route('settings.contract-articles.update', $article), $data);

        $response->assertRedirect(route('settings.contract-articles.index'));
        $this->assertDatabaseHas('contract_articles', [
            'id' => $article->id,
            'title' => 'ARTICLE 1 UPDATED',
            'description' => 'Updated description',
            'article_order' => 2,
            'status' => 'inactive',
        ]);
    }

    public function test_admin_can_delete_contract_article(): void
    {
        $article = ContractArticle::factory()->create();

        $response = $this->actingAs($this->admin)->delete(route('settings.contract-articles.destroy', $article));

        $response->assertRedirect(route('settings.contract-articles.index'));
        $this->assertDatabaseMissing('contract_articles', ['id' => $article->id]);
    }

    public function test_admin_can_toggle_contract_article_status(): void
    {
        $article = ContractArticle::factory()->create(['status' => 'active']);

        $response = $this->actingAs($this->admin)->patch(route('settings.contract-articles.toggle-status', $article));

        $response->assertRedirect(route('settings.contract-articles.index'));
        $this->assertEquals('inactive', $article->fresh()->status);

        // Toggle back
        $response = $this->actingAs($this->admin)->patch(route('settings.contract-articles.toggle-status', $article));
        $response->assertRedirect(route('settings.contract-articles.index'));
        $this->assertEquals('active', $article->fresh()->status);
    }

    public function test_admin_can_reorder_contract_articles(): void
    {
        $article1 = ContractArticle::factory()->create(['article_order' => 1]);
        $article2 = ContractArticle::factory()->create(['article_order' => 2]);

        $orders = [
            ['id' => $article1->id, 'article_order' => 2],
            ['id' => $article2->id, 'article_order' => 1],
        ];

        $response = $this->actingAs($this->admin)->post(route('settings.contract-articles.reorder'), ['orders' => $orders]);

        $response->assertRedirect(route('settings.contract-articles.index'));
        $this->assertEquals(2, $article1->fresh()->article_order);
        $this->assertEquals(1, $article2->fresh()->article_order);
    }

    public function test_non_admin_cannot_access_contract_articles(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $manager = User::factory()->create(['role' => 'manager']);

        $response = $this->actingAs($user)->get(route('settings.contract-articles.index'));
        $response->assertStatus(403);

        $response = $this->actingAs($manager)->get(route('settings.contract-articles.index'));
        $response->assertStatus(403);
    }

    public function test_validation_rules(): void
    {
        // Title is required
        $response = $this->actingAs($this->admin)->post(route('settings.contract-articles.store'), [
            'title' => '',
            'description' => 'Some description',
            'article_order' => 1,
            'status' => 'active',
        ]);
        $response->assertSessionHasErrors('title');

        // Description is required
        $response = $this->actingAs($this->admin)->post(route('settings.contract-articles.store'), [
            'title' => 'ARTICLE 1',
            'description' => '',
            'article_order' => 1,
            'status' => 'active',
        ]);
        $response->assertSessionHasErrors('description');

        // Status must be active or inactive
        $response = $this->actingAs($this->admin)->post(route('settings.contract-articles.store'), [
            'title' => 'ARTICLE 1',
            'description' => 'Some description',
            'article_order' => 1,
            'status' => 'invalid_status',
        ]);
        $response->assertSessionHasErrors('status');
    }
}
