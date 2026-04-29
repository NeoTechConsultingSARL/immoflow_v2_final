<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckAccountActivation
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check()) {
            abort(401, 'Unauthorized');
        }

        $user = Auth::user();

        // Check if user account is activated (email verified)
        if (is_null($user->email_verified_at)) {
            abort(403, 'Account not activated. Please verify your email address.');
        }

        return $next($request);
    }
}
