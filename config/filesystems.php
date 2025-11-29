<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Gunakan 'public' sebagai default untuk development lokal sehingga
    | upload disimpan di storage/app/public dan bisa diakses via /storage.
    |
    */

    'default' => env('FILESYSTEM_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Konfigurasi disk yang umum digunakan: local, public, s3 (ubah sesuai env)
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            // gunakan folder private di storage/app/private (opsional)
            'root' => storage_path('app'),
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL') . '/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            // scheme default biasanya https; gunakan env jika butuh http (minio)
            'scheme' => env('AWS_SCHEME', 'https'),
            'throw' => true,
            'report' => false,
        ],

        // disk untuk MinIO / S3-compatible (jika Anda gunakan MinIO)
        'minio' => [
            'driver' => 's3',
            'key' => env('MINIO_ACCESS_KEY'),
            'secret' => env('MINIO_SECRET_KEY'),
            'region' => env('MINIO_REGION', 'us-east-1'),
            'bucket' => env('MINIO_BUCKET', 'village-media'),
            'url' => env('MINIO_URL'),
            'endpoint' => env('MINIO_ENDPOINT'),
            'use_path_style_endpoint' => env('MINIO_USE_PATH_STYLE_ENDPOINT', true),
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        // disk 'media' convenience yang menunjuk ke public storage
        'media' => [
            'driver' => env('MEDIA_DISK_DRIVER', 'local'),
            'root' => storage_path('app/public'),
            'url' => env('APP_URL') . '/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Link yang dibuat oleh `php artisan storage:link`
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
