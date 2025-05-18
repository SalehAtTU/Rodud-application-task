<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // If user is not admin, return 403
        if (! $request->user() || ! $request->user()->is_admin) {
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}
