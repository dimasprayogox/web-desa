<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if (config('app.env') === 'production') {
            // Force HTTPS
            URL::forceScheme('https');

            // Force root URL to include the /admin subfolder so generated routes include /admin prefix.
            // Sesuaikan '/admin' jika public folder Anda di path lain.
            URL::forceRootUrl(config('app.url') . '/admin');
        }
    }
}
