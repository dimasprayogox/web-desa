<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

// Route::get('/', function () {
//     // ✅ Cek apakah user sudah login
//     if (Auth::check()) {
//         return redirect('/'); // Ke dashboard
//     }
//     return redirect('/login'); // Ke login
// });

require __DIR__ . '/auth.php';
