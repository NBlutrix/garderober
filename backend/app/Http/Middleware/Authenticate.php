<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
{
    // Ako je API zahtev, ne preusmeravaj, samo vrati null
    if ($request->expectsJson()) {
        return null;
    }

    // Za web zahteve možeš ostaviti redirect
    // return route('login');
}

}
