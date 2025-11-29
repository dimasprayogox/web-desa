<?php

namespace App\Filament\Resources\DetailApbdes\Pages;

use App\Filament\Resources\DetailApbdesResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDetailApbdes extends EditRecord
{
    protected static string $resource = DetailApbdesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Convert single record ke repeater format
        $data['details'] = [
            [
                'tipe' => $data['tipe'] ?? 'pendapatan',
                'uraian' => $data['uraian'] ?? '',
                'anggaran' => $data['anggaran'] ?? 0,
                'realisasi' => $data['realisasi'] ?? 0,
            ]
        ];

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Ambil data dari repeater pertama
        if (!empty($data['details'][0])) {
            $detail = $data['details'][0];
            return [
                'laporan_apbdes_id' => $data['laporan_apbdes_id'],
                'tipe' => $detail['tipe'] ?? 'pendapatan',
                'uraian' => $detail['uraian'],
                'anggaran' => $detail['anggaran'] ?? 0,
                'realisasi' => $detail['realisasi'] ?? 0,
            ];
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Detail APBDes berhasil diperbarui';
    }
}
