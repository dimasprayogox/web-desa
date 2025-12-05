<?php

namespace App\Filament\Resources\LaporanApbdes\Pages;

use App\Filament\Resources\LaporanApbdesResource;
use Filament\Resources\Pages\CreateRecord;

class CreateLaporanApbdes extends CreateRecord
{
    protected static string $resource = LaporanApbdesResource::class;

    protected function getRedirectUrl(): string
    {
        $indexPath = $this->getResource()::getUrl('index');

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
        return 'Laporan APBDes berhasil ditambahkan!';
    }
}
