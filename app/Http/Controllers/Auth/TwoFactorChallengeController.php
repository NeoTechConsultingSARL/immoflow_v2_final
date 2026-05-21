<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorChallengeController extends Controller
{
    /**
     * Show the two-factor authentication challenge view.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        if (! $request->session()->has('login.id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/TwoFactorChallenge');
    }

    /**
     * Attempt to authenticate the user using the code.
     */
    public function store(Request $request): RedirectResponse
    {
        if (! $request->session()->has('login.id')) {
            return redirect()->route('login');
        }

        $userId = $request->session()->get('login.id');
        $user = User::findOrFail($userId);

        $request->validate([
            'code' => 'nullable|string',
            'recovery_code' => 'nullable|string',
        ]);

        $google2fa = new Google2FA;

        // 1. Verify TOTP Code
        if ($code = $request->input('code')) {
            $secret = decrypt($user->two_factor_secret);

            if ($google2fa->verifyKey($secret, $code)) {
                $this->login($user, $request);

                return redirect()->intended(route('dashboard', absolute: false));
            }
        }

        // 2. Verify Recovery Code
        if ($recoveryCode = $request->input('recovery_code')) {
            $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);

            if (is_array($recoveryCodes)) {
                foreach ($recoveryCodes as $index => $storedCode) {
                    if (hash_equals($storedCode, $recoveryCode)) {
                        // Remove the used recovery code
                        unset($recoveryCodes[$index]);

                        $user->forceFill([
                            'two_factor_recovery_codes' => encrypt(json_encode(array_values($recoveryCodes))),
                        ])->save();

                        $this->login($user, $request);

                        return redirect()->intended(route('dashboard', absolute: false));
                    }
                }
            }
        }

        throw ValidationException::withMessages([
            'code' => ['The provided two-factor authentication code or recovery code was invalid.'],
        ]);
    }

    /**
     * Complete the login process for the user.
     */
    protected function login(User $user, Request $request): void
    {
        Auth::login($user, $request->session()->get('login.remember', false));

        $request->session()->regenerate();
        $request->session()->forget(['login.id', 'login.remember']);
    }
}
