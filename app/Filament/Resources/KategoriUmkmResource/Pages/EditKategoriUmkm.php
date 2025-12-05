<?php

namespace App\Filament\Resources\KategoriUmkmResource\Pages;

use App\Filament\Resources\KategoriUmkmResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditKategoriUmkm extends EditRecord
{
    protected static string $resource = KategoriUmkmResource::class;

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
        return 'Kategori UMKM berhasil diperbarui!';
    }
}
