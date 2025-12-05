<?php

namespace App\Filament\Resources\TahunDataResource\Pages;

use App\Filament\Resources\TahunDataResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateTahunData extends CreateRecord
{
    protected static string $resource = TahunDataResource::class;

    protected function getRedirectUrl(): string
    {
        $indexPath = TahunDataResource::getUrl('index');

        // jika absolute URL, ambil path saja
        if (strpos($indexPath, '://') !== false) {
            $indexPath = parse_url($indexPath, PHP_URL_PATH) ?: '/';
        }

        if (!str_starts_with($indexPath, '/')) {
            $indexPath = '/' . ltrim($indexPath, '/');
        }

        if (!str_starts_with($indexPath, '/admin')) {
            $indexPath = '/admin' . $indexPath;
        }

        return url($indexPath);
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        return 'Data Tahun berhasil ditambahkan!';
    }
}
