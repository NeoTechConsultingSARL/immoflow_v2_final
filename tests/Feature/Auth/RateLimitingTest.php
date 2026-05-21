<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class RateLimitingTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Clear rate limiter cache between tests to ensure a clean state
        RateLimiter::clear('global');
        RateLimiter::clear('api');
        RateLimiter::clear('auth');
        Cache::flush();
    }

    /**
     * Test global rate limiter for guests.
     */
    public function test_global_rate_limiter_limits_guest_requests(): void
    {
        // Define a route to hit (e.g., login page)
        $url = route('login');

        // Send 60 requests (allowed)
        for ($i = 0; $i < 60; $i++) {
            $response = $this->get($url);
            $response->assertStatus(200);
        }

        // 61st request should be throttled (429)
        $response = $this->get($url);
        $response->assertStatus(429);
    }

    /**
     * Test API rate limiter for authenticated users.
     */
    public function test_api_rate_limiter_limits_requests(): void
    {
        $user = User::factory()->create();

        // Acting as user, hit an API route
        // Note: The actual company ID doesn't need to exist because the throttle middleware runs first.
        $url = route('api.companies.projects', ['company' => 999]);

        // Send 60 requests (allowed for authenticated users)
        for ($i = 0; $i < 60; $i++) {
            $response = $this->actingAs($user)->get($url);
            // It might return 302/redirect, 404 not found, or 200, but NOT 429.
            $this->assertNotEquals(429, $response->getStatusCode());
        }

        // 61st request should be throttled (429)
        $response = $this->actingAs($user)->get($url);
        $response->assertStatus(429);
    }

    /**
     * Test Auth rate limiter on registration.
     */
    public function test_auth_rate_limiter_limits_registration_attempts(): void
    {
        $url = route('register');

        // Send 5 POST requests (allowed, even if failing validation)
        for ($i = 0; $i < 5; $i++) {
            $response = $this->post($url, []);
            // Should return validation redirect (302) or standard non-429 response
            $this->assertNotEquals(429, $response->getStatusCode());
        }

        // 6th POST request should be throttled (429)
        $response = $this->post($url, []);
        $response->assertStatus(429);
    }
}
