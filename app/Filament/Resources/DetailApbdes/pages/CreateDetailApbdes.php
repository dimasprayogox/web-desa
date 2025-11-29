<?php

namespace App\Filament\Resources\DetailApbdes\Pages;

use App\Filament\Resources\DetailApbdesResource;
use Filament\Resources\Pages\CreateRecord;

class CreateDetailApbdes extends CreateRecord
{
    protected static string $resource = DetailApbdesResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Ambil repeater data
        $details = $data['details'] ?? [];
        $laporanApbdesId = $data['laporan_apbdes_id'];

        // Simpan hanya detail pertama untuk record utama
        if (!empty($details)) {
            return array_merge(
                ['laporan_apbdes_id' => $laporanApbdesId],
                $details[0]
            );
        }

        return $data;
    }

    protected function afterCreate(): void
    {
        // Ambil data repeater dari form state
        $formData = $this->form->getState();
        $details = $formData['details'] ?? [];
        $laporanApbdesId = $this->record->laporan_apbdes_id;

        // Skip index 0 karena sudah dibuat di record utama
        for ($i = 1; $i < count($details); $i++) {
            \App\Models\DetailApbdes::create([
                'laporan_apbdes_id' => $laporanApbdesId,
                'tipe' => $details[$i]['tipe'] ?? 'pendapatan',
                'uraian' => $details[$i]['uraian'],
                'anggaran' => $details[$i]['anggaran'] ?? 0,
                'realisasi' => $details[$i]['realisasi'] ?? 0,
            ]);
        }
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        $formData = $this->form->getState();
        $count = count($formData['details'] ?? []);
        return "{$count} detail APBDes berhasil ditambahkan";
    }
}
