<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PragmaRX\Google2FA\Google2FA;
use Tests\TestCase;

class TwoFactorAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_two_factor_authentication_can_be_enabled_with_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->actingAs($user)->post('/user/two-factor-authentication', [
            'password' => 'password',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $user->refresh();
        $this->assertNotNull($user->two_factor_secret);
        $this->assertNull($user->two_factor_confirmed_at);

        $response->assertSessionHas('two_factor_secret');
        $response->assertSessionHas('two_factor_qr_url');
    }

    public function test_two_factor_authentication_cannot_be_enabled_with_invalid_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->actingAs($user)->post('/user/two-factor-authentication', [
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors(['password']);

        $user->refresh();
        $this->assertNull($user->two_factor_secret);
    }

    public function test_two_factor_authentication_can_be_confirmed_with_valid_totp_code(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $google2fa = new Google2FA;
        $secret = $google2fa->generateSecretKey();

        $user->forceFill([
            'two_factor_secret' => encrypt($secret),
        ])->save();

        $validCode = $google2fa->getCurrentOtp($secret);

        $response = $this->actingAs($user)->post('/user/confirmed-two-factor-authentication', [
            'code' => $validCode,
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $user->refresh();
        $this->assertNotNull($user->two_factor_confirmed_at);
        $this->assertNotNull($user->two_factor_recovery_codes);

        $response->assertSessionHas('two_factor_recovery_codes');
    }

    public function test_two_factor_authentication_cannot_be_confirmed_with_invalid_totp_code(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $google2fa = new Google2FA;
        $secret = $google2fa->generateSecretKey();

        $user->forceFill([
            'two_factor_secret' => encrypt($secret),
        ])->save();

        $response = $this->actingAs($user)->post('/user/confirmed-two-factor-authentication', [
            'code' => '123456', // Invalid code
        ]);

        $response->assertSessionHasErrors(['code']);

        $user->refresh();
        $this->assertNull($user->two_factor_confirmed_at);
    }

    public function test_two_factor_authentication_can_be_disabled(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $user->forceFill([
            'two_factor_secret' => encrypt('NJKDMTSBNJKDMTSB'),
            'two_factor_confirmed_at' => now(),
            'two_factor_recovery_codes' => encrypt(json_encode(['code-1', 'code-2'])),
        ])->save();

        $response = $this->actingAs($user)->delete('/user/two-factor-authentication', [
            'password' => 'password',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $user->refresh();
        $this->assertNull($user->two_factor_secret);
        $this->assertNull($user->two_factor_confirmed_at);
        $this->assertNull($user->two_factor_recovery_codes);
    }

    public function test_two_factor_authentication_challenge_is_displayed_when_user_has_2fa_enabled(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
            'two_factor_secret' => encrypt('NJKDMTSBNJKDMTSB'),
            'two_factor_confirmed_at' => now(),
        ]);

        // Post to standard login
        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('two-factor.login'));
        $this->assertFalse(auth()->check());
    }

    public function test_two_factor_authentication_challenge_can_be_passed_with_valid_totp_code(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $google2fa = new Google2FA;
        $secret = $google2fa->generateSecretKey();

        $user->forceFill([
            'two_factor_secret' => encrypt($secret),
            'two_factor_confirmed_at' => now(),
        ])->save();

        // 1. Post to login to setup session
        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertFalse(auth()->check());

        // 2. Perform challenge with valid OTP code
        $validCode = $google2fa->getCurrentOtp($secret);

        $response = $this->post('/two-factor-challenge', [
            'code' => $validCode,
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertTrue(auth()->check());
    }

    public function test_two_factor_authentication_challenge_can_be_passed_with_recovery_code(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $user->forceFill([
            'two_factor_secret' => encrypt('NJKDMTSBNJKDMTSB'),
            'two_factor_confirmed_at' => now(),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1', 'recovery-code-2'])),
        ])->save();

        // 1. Post to login to setup session
        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertFalse(auth()->check());

        // 2. Perform challenge with recovery code
        $response = $this->post('/two-factor-challenge', [
            'recovery_code' => 'recovery-code-1',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertTrue(auth()->check());

        // Verify recovery code was used and removed
        $user->refresh();
        $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);
        $this->assertNotContains('recovery-code-1', $recoveryCodes);
        $this->assertContains('recovery-code-2', $recoveryCodes);
    }

    public function test_two_factor_authentication_challenge_cannot_be_passed_with_invalid_code(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
            'two_factor_secret' => encrypt('NJKDMTSBNJKDMTSB'),
            'two_factor_confirmed_at' => now(),
        ]);

        // 1. Post to login to setup session
        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertFalse(auth()->check());

        // 2. Perform challenge with invalid code
        $response = $this->post('/two-factor-challenge', [
            'code' => '123456',
        ]);

        $response->assertSessionHasErrors(['code']);
        $this->assertFalse(auth()->check());
    }
}
