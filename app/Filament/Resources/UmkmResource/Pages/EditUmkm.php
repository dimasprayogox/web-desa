<?php

namespace App\Filament\Resources\UmkmResource\Pages;

use App\Filament\Resources\UmkmResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUmkm extends EditRecord
{
    protected static string $resource = UmkmResource::class;

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
        return 'UMKM berhasil diperbarui!';
    }
}
