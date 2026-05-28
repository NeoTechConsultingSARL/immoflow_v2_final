<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorAuthenticationController extends Controller
{
    /**
     * Enable two-factor authentication for the user.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string', 'current_password'],
        ]);

        $google2fa = new Google2FA;
        $secret = $google2fa->generateSecretKey();
        $qrUrl = $google2fa->getQRCodeUrl(
            config('app.name', 'ImmoFlow'),
            $request->user()->email,
            $secret
        );

        $request->user()->forceFill([
            'two_factor_secret' => encrypt($secret),
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ])->save();

        return back()->with([
            'two_factor_secret' => $secret,
            'two_factor_qr_url' => $qrUrl,
        ]);
    }

    /**
     * Confirm two-factor authentication for the user.
     */
    public function confirm(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $user = $request->user();

        if (empty($user->two_factor_secret)) {
            return back()->withErrors(['code' => 'Two-factor authentication is not being set up.']);
        }

        $google2fa = new Google2FA;
        $secret = decrypt($user->two_factor_secret);

        if (! $google2fa->verifyKey($secret, $request->code)) {
            return back()->withErrors(['code' => 'The provided two-factor authentication code was invalid.']);
        }

        // Generate recovery codes
        $recoveryCodes = collect(range(1, 8))->map(function () {
            return Str::random(10).'-'.Str::random(10);
        })->all();

        $user->forceFill([
            'two_factor_recovery_codes' => encrypt(json_encode($recoveryCodes)),
            'two_factor_confirmed_at' => now(),
        ])->save();

        return back()->with([
            'two_factor_recovery_codes' => $recoveryCodes,
        ]);
    }

    /**
     * Disable two-factor authentication for the user.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string', 'current_password'],
        ]);

        $request->user()->forceFill([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ])->save();

        return back();
    }

    /**
     * Show recovery codes.
     */
    public function showRecoveryCodes(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string', 'current_password'],
        ]);

        $user = $request->user();

        if (! $user->two_factor_recovery_codes) {
            return back();
        }

        $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);

        return back()->with([
            'two_factor_recovery_codes' => $recoveryCodes,
        ]);
    }

    /**
     * Regenerate recovery codes.
     */
    public function generateRecoveryCodes(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string', 'current_password'],
        ]);

        $user = $request->user();

        $recoveryCodes = collect(range(1, 8))->map(function () {
            return Str::random(10).'-'.Str::random(10);
        })->all();

        $user->forceFill([
            'two_factor_recovery_codes' => encrypt(json_encode($recoveryCodes)),
        ])->save();

        return back()->with([
            'two_factor_recovery_codes' => $recoveryCodes,
        ]);
    }
}
