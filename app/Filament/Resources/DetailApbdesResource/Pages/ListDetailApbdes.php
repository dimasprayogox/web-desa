<?php

namespace App\Filament\Resources\DetailApbdesResource\Pages;

use App\Filament\Resources\DetailApbdesResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListDetailApbdes extends ListRecords
{
    protected static string $resource = DetailApbdesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
