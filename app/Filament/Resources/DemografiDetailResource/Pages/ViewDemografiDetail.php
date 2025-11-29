<?php
// filepath: app/Filament/Resources/DemografiDetailResource/Pages/ViewDemografiDetail.php

namespace App\Filament\Resources\DemografiDetailResource\Pages;

use App\Filament\Resources\DemografiDetailResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewDemografiDetail extends ViewRecord
{
    protected static string $resource = DemografiDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Set tahun_filter dari relasi
        if ($this->record && $this->record->demografiDusun) {
            $data['tahun_filter'] = $this->record->demografiDusun->tahun_id;
        }

        // Convert JSON ke field individual (sama seperti Edit)
        $wilayah = $this->record->wilayah ?? [];
        $usia = $this->record->usia ?? [];
        $agama = $this->record->agama ?? [];
        $pekerjaan = $this->record->pekerjaan ?? [];
        $pendidikan = $this->record->pendidikan ?? [];
        $perkawinan = $this->record->perkawinan ?? [];

        $data['rt'] = $wilayah['rt'] ?? 0;
        $data['kk'] = $wilayah['kk'] ?? 0;

        $data['usia_0_5_l'] = $usia['0_5']['l'] ?? 0;
        $data['usia_0_5_p'] = $usia['0_5']['p'] ?? 0;
        $data['usia_6_12_l'] = $usia['6_12']['l'] ?? 0;
        $data['usia_6_12_p'] = $usia['6_12']['p'] ?? 0;
        $data['usia_13_17_l'] = $usia['13_17']['l'] ?? 0;
        $data['usia_13_17_p'] = $usia['13_17']['p'] ?? 0;
        $data['usia_18_40_l'] = $usia['18_40']['l'] ?? 0;
        $data['usia_18_40_p'] = $usia['18_40']['p'] ?? 0;
        $data['usia_41_plus_l'] = $usia['41_plus']['l'] ?? 0;
        $data['usia_41_plus_p'] = $usia['41_plus']['p'] ?? 0;

        $data['islam'] = $agama['islam'] ?? 0;
        $data['kristen'] = $agama['kristen'] ?? 0;
        $data['katolik'] = $agama['katolik'] ?? 0;
        $data['hindu'] = $agama['hindu'] ?? 0;
        $data['buddha'] = $agama['buddha'] ?? 0;
        $data['konghucu'] = $agama['konghucu'] ?? 0;
        $data['agama_lainnya'] = $agama['lainnya'] ?? 0;

        $data['belum_bekerja'] = $pekerjaan['belum_bekerja'] ?? 0;
        $data['pelajar_mahasiswa'] = $pekerjaan['pelajar_mahasiswa'] ?? 0;
        $data['petani'] = $pekerjaan['petani'] ?? 0;
        $data['buruh_tani'] = $pekerjaan['buruh_tani'] ?? 0;
        $data['wiraswasta'] = $pekerjaan['wiraswasta'] ?? 0;
        $data['pns_tni_polri'] = $pekerjaan['pns_tni_polri'] ?? 0;
        $data['karyawan'] = $pekerjaan['karyawan'] ?? 0;
        $data['ibu_rumah_tangga'] = $pekerjaan['ibu_rumah_tangga'] ?? 0;
        $data['pekerjaan_lainnya'] = $pekerjaan['lainnya'] ?? 0;

        $data['belum_sekolah'] = $pendidikan['belum_sekolah'] ?? 0;
        $data['tidak_tamat_sd'] = $pendidikan['tidak_tamat_sd'] ?? 0;
        $data['sd_sederajat'] = $pendidikan['sd_sederajat'] ?? 0;
        $data['smp_sederajat'] = $pendidikan['smp_sederajat'] ?? 0;
        $data['sma_sederajat'] = $pendidikan['sma_sederajat'] ?? 0;
        $data['diploma'] = $pendidikan['diploma'] ?? 0;
        $data['sarjana'] = $pendidikan['sarjana'] ?? 0;
        $data['s2'] = $pendidikan['s2'] ?? 0;
        $data['s3'] = $pendidikan['s3'] ?? 0;

        $data['belum_kawin'] = $perkawinan['belum_kawin'] ?? 0;
        $data['kawin'] = $perkawinan['kawin'] ?? 0;
        $data['cerai_hidup'] = $perkawinan['cerai_hidup'] ?? 0;
        $data['cerai_mati'] = $perkawinan['cerai_mati'] ?? 0;

        return $data;
    }
}
