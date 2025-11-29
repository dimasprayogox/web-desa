<?php
// filepath: app/Filament/Resources/DemografiDusunResource/Pages/ViewDemografiDusun.php

namespace App\Filament\Resources\DemografiDusunResource\Pages;

use App\Filament\Resources\DemografiDusunResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewDemografiDusun extends ViewRecord
{
    protected static string $resource = DemografiDusunResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
