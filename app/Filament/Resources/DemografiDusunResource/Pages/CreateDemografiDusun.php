<?php
// filepath: app/Filament/Resources/DemografiDusunResource/Pages/CreateDemografiDusun.php

namespace App\Filament\Resources\DemografiDusunResource\Pages;

use App\Filament\Resources\DemografiDusunResource;
use Filament\Resources\Pages\CreateRecord;

class CreateDemografiDusun extends CreateRecord
{
    protected static string $resource = DemografiDusunResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (empty($data['total_penduduk'])) {
            $data['total_penduduk'] = ($data['laki_laki'] ?? 0) + ($data['perempuan'] ?? 0);
        }
        return $data;
    }

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
}
