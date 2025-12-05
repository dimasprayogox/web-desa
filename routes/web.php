<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


// Redirect legacy /login ke Filament login and keep name 'login'
Route::redirect('/login', '/admin/login')->name('login');

// Override Filament login: GET → redirect ke /login, POST → preserve POST (307) ke /login
Route::match(['get', 'post'], '/admin/login', function (Request $request) {
    if ($request->isMethod('get')) {
        return redirect('/login');
    }

    // preserve POST body when redirecting to your existing login route
    return redirect('/login')->setStatusCode(307);
})->name('filament.admin.auth.login');

// Override Filament logout route to perform logout and redirect to /login
Route::post('/admin/logout', function (Request $request) {
    Auth::guard()->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/login');
})->name('filament.admin.auth.logout');

require __DIR__ . '/auth.php';
