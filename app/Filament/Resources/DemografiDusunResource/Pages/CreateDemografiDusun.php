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
        return $this->getResource()::getUrl('index');
    }
}
