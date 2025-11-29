<?php
// filepath: app/Filament/Resources/DemografiDusunResource/Pages/EditDemografiDusun.php

namespace App\Filament\Resources\DemografiDusunResource\Pages;

use App\Filament\Resources\DemografiDusunResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDemografiDusun extends EditRecord
{
    protected static string $resource = DemografiDusunResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['laki_laki']) && isset($data['perempuan'])) {
            $data['total_penduduk'] = $data['laki_laki'] + $data['perempuan'];
        }
        return $data;
    }
}
