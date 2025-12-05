<?php
// filepath: app/Filament/Resources/DemografiDetailResource/Pages/CreateDemografiDetail.php

namespace App\Filament\Resources\DemografiDetailResource\Pages;

use App\Filament\Resources\DemografiDetailResource;
use Filament\Resources\Pages\CreateRecord;

class CreateDemografiDetail extends CreateRecord
{
    protected static string $resource = DemografiDetailResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Konversi field individual ke JSON structure
        $jsonData = [
            'demografi_dusun_id' => $data['demografi_dusun_id'],

            'wilayah' => [
                'rt' => $data['rt'] ?? 0,
                'kk' => $data['kk'] ?? 0,
            ],

            'usia' => [
                '0_5' => [
                    'l' => $data['usia_0_5_l'] ?? 0,
                    'p' => $data['usia_0_5_p'] ?? 0,
                ],
                '6_12' => [
                    'l' => $data['usia_6_12_l'] ?? 0,
                    'p' => $data['usia_6_12_p'] ?? 0,
                ],
                '13_17' => [
                    'l' => $data['usia_13_17_l'] ?? 0,
                    'p' => $data['usia_13_17_p'] ?? 0,
                ],
                '18_40' => [
                    'l' => $data['usia_18_40_l'] ?? 0,
                    'p' => $data['usia_18_40_p'] ?? 0,
                ],
                '41_plus' => [
                    'l' => $data['usia_41_plus_l'] ?? 0,
                    'p' => $data['usia_41_plus_p'] ?? 0,
                ],
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
        $indexPath = $this->getResource()::getUrl('index');

        // jika absolute URL, ambil path saja
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
        return 'Data Demografi berhasil ditambahkan!';
    }
}
