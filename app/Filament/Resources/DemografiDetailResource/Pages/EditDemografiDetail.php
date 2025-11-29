<?php
// filepath: app/Filament/Resources/DemografiDetailResource/Pages/EditDemografiDetail.php

namespace App\Filament\Resources\DemografiDetailResource\Pages;

use App\Filament\Resources\DemografiDetailResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDemografiDetail extends EditRecord
{
    protected static string $resource = DemografiDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Set tahun_filter dari relasi
        if ($this->record && $this->record->demografiDusun) {
            $data['tahun_filter'] = $this->record->demografiDusun->tahun_id;
        }

        // Convert JSON ke field individual untuk form
        $wilayah = $this->record->wilayah ?? [];
        $usia = $this->record->usia ?? [];
        $agama = $this->record->agama ?? [];
        $pekerjaan = $this->record->pekerjaan ?? [];
        $pendidikan = $this->record->pendidikan ?? [];
        $perkawinan = $this->record->perkawinan ?? [];

        // Wilayah
        $data['rt'] = $wilayah['rt'] ?? 0;
        $data['kk'] = $wilayah['kk'] ?? 0;

        // Usia
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

        // Agama
        $data['islam'] = $agama['islam'] ?? 0;
        $data['kristen'] = $agama['kristen'] ?? 0;
        $data['katolik'] = $agama['katolik'] ?? 0;
        $data['hindu'] = $agama['hindu'] ?? 0;
        $data['buddha'] = $agama['buddha'] ?? 0;
        $data['konghucu'] = $agama['konghucu'] ?? 0;
        $data['agama_lainnya'] = $agama['lainnya'] ?? 0;

        // Pekerjaan
        $data['belum_bekerja'] = $pekerjaan['belum_bekerja'] ?? 0;
        $data['pelajar_mahasiswa'] = $pekerjaan['pelajar_mahasiswa'] ?? 0;
        $data['petani'] = $pekerjaan['petani'] ?? 0;
        $data['buruh_tani'] = $pekerjaan['buruh_tani'] ?? 0;
        $data['wiraswasta'] = $pekerjaan['wiraswasta'] ?? 0;
        $data['pns_tni_polri'] = $pekerjaan['pns_tni_polri'] ?? 0;
        $data['karyawan'] = $pekerjaan['karyawan'] ?? 0;
        $data['ibu_rumah_tangga'] = $pekerjaan['ibu_rumah_tangga'] ?? 0;
        $data['pekerjaan_lainnya'] = $pekerjaan['lainnya'] ?? 0;

        // Pendidikan
        $data['belum_sekolah'] = $pendidikan['belum_sekolah'] ?? 0;
        $data['tidak_tamat_sd'] = $pendidikan['tidak_tamat_sd'] ?? 0;
        $data['sd_sederajat'] = $pendidikan['sd_sederajat'] ?? 0;
        $data['smp_sederajat'] = $pendidikan['smp_sederajat'] ?? 0;
        $data['sma_sederajat'] = $pendidikan['sma_sederajat'] ?? 0;
        $data['diploma'] = $pendidikan['diploma'] ?? 0;
        $data['sarjana'] = $pendidikan['sarjana'] ?? 0;
        $data['s2'] = $pendidikan['s2'] ?? 0;
        $data['s3'] = $pendidikan['s3'] ?? 0;

        // Perkawinan
        $data['belum_kawin'] = $perkawinan['belum_kawin'] ?? 0;
        $data['kawin'] = $perkawinan['kawin'] ?? 0;
        $data['cerai_hidup'] = $perkawinan['cerai_hidup'] ?? 0;
        $data['cerai_mati'] = $perkawinan['cerai_mati'] ?? 0;

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Convert field individual ke JSON (sama seperti Create)
        $jsonData = [
            'demografi_dusun_id' => $data['demografi_dusun_id'],

            'wilayah' => [
                'rt' => $data['rt'] ?? 0,
                'kk' => $data['kk'] ?? 0,
            ],

            'usia' => [
                '0_5' => ['l' => $data['usia_0_5_l'] ?? 0, 'p' => $data['usia_0_5_p'] ?? 0],
                '6_12' => ['l' => $data['usia_6_12_l'] ?? 0, 'p' => $data['usia_6_12_p'] ?? 0],
                '13_17' => ['l' => $data['usia_13_17_l'] ?? 0, 'p' => $data['usia_13_17_p'] ?? 0],
                '18_40' => ['l' => $data['usia_18_40_l'] ?? 0, 'p' => $data['usia_18_40_p'] ?? 0],
                '41_plus' => ['l' => $data['usia_41_plus_l'] ?? 0, 'p' => $data['usia_41_plus_p'] ?? 0],
            ],

            'agama' => [
                'islam' => $data['islam'] ?? 0,
                'kristen' => $data['kristen'] ?? 0,
                'katolik' => $data['katolik'] ?? 0,
                'hindu' => $data['hindu'] ?? 0,
                'buddha' => $data['buddha'] ?? 0,
                'konghucu' => $data['konghucu'] ?? 0,
                'lainnya' => $data['agama_lainnya'] ?? 0,
            ],

            'pekerjaan' => [
                'belum_bekerja' => $data['belum_bekerja'] ?? 0,
                'pelajar_mahasiswa' => $data['pelajar_mahasiswa'] ?? 0,
                'petani' => $data['petani'] ?? 0,
                'buruh_tani' => $data['buruh_tani'] ?? 0,
                'wiraswasta' => $data['wiraswasta'] ?? 0,
                'pns_tni_polri' => $data['pns_tni_polri'] ?? 0,
                'karyawan' => $data['karyawan'] ?? 0,
                'ibu_rumah_tangga' => $data['ibu_rumah_tangga'] ?? 0,
                'lainnya' => $data['pekerjaan_lainnya'] ?? 0,
            ],

            'pendidikan' => [
                'belum_sekolah' => $data['belum_sekolah'] ?? 0,
                'tidak_tamat_sd' => $data['tidak_tamat_sd'] ?? 0,
                'sd_sederajat' => $data['sd_sederajat'] ?? 0,
                'smp_sederajat' => $data['smp_sederajat'] ?? 0,
                'sma_sederajat' => $data['sma_sederajat'] ?? 0,
                'diploma' => $data['diploma'] ?? 0,
                'sarjana' => $data['sarjana'] ?? 0,
                's2' => $data['s2'] ?? 0,
                's3' => $data['s3'] ?? 0,
            ],

            'perkawinan' => [
                'belum_kawin' => $data['belum_kawin'] ?? 0,
                'kawin' => $data['kawin'] ?? 0,
                'cerai_hidup' => $data['cerai_hidup'] ?? 0,
                'cerai_mati' => $data['cerai_mati'] ?? 0,
            ],
        ];

        return $jsonData;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
