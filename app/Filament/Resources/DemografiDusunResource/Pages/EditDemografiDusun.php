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
            Actions\DeleteAction::make()
                ->after(fn() => $this->redirect($this->getRedirectUrl())),
        ];
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

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Data Dusun berhasil diperbarui!';
    }
}
