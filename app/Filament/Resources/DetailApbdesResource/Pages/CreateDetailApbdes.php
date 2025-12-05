<?php

namespace App\Filament\Resources\DetailApbdesResource\Pages;

use App\Filament\Resources\DetailApbdesResource;
use Filament\Resources\Pages\CreateRecord;

class CreateDetailApbdes extends CreateRecord
{
    protected static string $resource = DetailApbdesResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (isset($data['details']) && is_array($data['details'])) {
            unset($data['details']);
        }

        return $data;
    }

    protected function afterCreate(): void
    {
        if (isset($this->details) && is_array($this->details)) {
            foreach ($this->details as $detail) {
                $this->record->details()->create($detail);
            }
        }
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

    protected function getCreatedNotificationTitle(): ?string
    {
        return 'Detail APBDes berhasil ditambahkan!';
    }
}
