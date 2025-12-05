<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
            <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    {{-- Ensure Livewire script loads from published assets in public/vendor/livewire (admin/vendor/livewire) --}}
    @php
        // public_path() sudah dibind ke /public_html/admin lewat index.php kita
        $livewirePath = public_path('vendor/livewire/livewire.js');
    @endphp

    @if (file_exists($livewirePath))
        <script
            src="{{ asset('vendor/livewire/livewire.js') }}?id={{ \Illuminate\Support\Str::random(8) }}"
            data-csrf="{{ csrf_token() }}"
            data-update-uri="{{ url('/livewire/update') }}"
            data-navigate-once="true"
            defer
        ></script>
    @else
        {{-- fallback ke Livewire default (jika assets belum dipublish) --}}
        @livewireScripts
    @endif

    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen bg-gray-100">
            @include('layouts.navigation')

            <!-- Page Heading -->
            @isset($header)
                <header class="bg-white shadow">
                    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {{ $header }}
                    </div>
                </header>
            @endisset

            <!-- Page Content -->
            <main>
                {{ $slot }}
            </main>
        </div>
    </body>
</html>
