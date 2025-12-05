<?php

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
            Actions\DeleteAction::make()
                ->after(fn() => $this->redirect($this->getRedirectUrl())),
        ];
    }

    // populate form fields from stored JSON when editing
    public function mount($record): void
    {
        parent::mount($record);

        $data = [];

        $data['demografi_dusun_id'] = $this->record->demografi_dusun_id ?? null;

        $wilayah = $this->record->wilayah ?? [];
        $data['rt'] = $wilayah['rt'] ?? null;
        $data['kk'] = $wilayah['kk'] ?? null;

        $usia = $this->record->usia ?? [];
        $data['usia_0_5_l'] = $usia['0_5']['l'] ?? null;
        $data['usia_0_5_p'] = $usia['0_5']['p'] ?? null;
        $data['usia_6_12_l'] = $usia['6_12']['l'] ?? null;
        $data['usia_6_12_p'] = $usia['6_12']['p'] ?? null;
        $data['usia_13_17_l'] = $usia['13_17']['l'] ?? null;
        $data['usia_13_17_p'] = $usia['13_17']['p'] ?? null;
        $data['usia_18_40_l'] = $usia['18_40']['l'] ?? null;
        $data['usia_18_40_p'] = $usia['18_40']['p'] ?? null;
        $data['usia_41_plus_l'] = $usia['41_plus']['l'] ?? null;
        $data['usia_41_plus_p'] = $usia['41_plus']['p'] ?? null;

        $agama = $this->record->agama ?? [];
        $data['islam'] = $agama['islam'] ?? null;
        $data['kristen'] = $agama['kristen'] ?? null;
        $data['katolik'] = $agama['katolik'] ?? null;
        $data['hindu'] = $agama['hindu'] ?? null;
        $data['buddha'] = $agama['buddha'] ?? null;
        $data['konghucu'] = $agama['konghucu'] ?? null;
        $data['agama_lainnya'] = $agama['lainnya'] ?? null;

        $pekerjaan = $this->record->pekerjaan ?? [];
        $data['belum_bekerja'] = $pekerjaan['belum_bekerja'] ?? null;
        $data['pelajar_mahasiswa'] = $pekerjaan['pelajar_mahasiswa'] ?? null;
        $data['petani'] = $pekerjaan['petani'] ?? null;
        $data['buruh_tani'] = $pekerjaan['buruh_tani'] ?? null;
        $data['wiraswasta'] = $pekerjaan['wiraswasta'] ?? null;
        $data['pns_tni_polri'] = $pekerjaan['pns_tni_polri'] ?? null;
        $data['karyawan'] = $pekerjaan['karyawan'] ?? null;
        $data['ibu_rumah_tangga'] = $pekerjaan['ibu_rumah_tangga'] ?? null;
        $data['pekerjaan_lainnya'] = $pekerjaan['lainnya'] ?? null;

        $pendidikan = $this->record->pendidikan ?? [];
        $data['belum_sekolah'] = $pendidikan['belum_sekolah'] ?? null;
        $data['tidak_tamat_sd'] = $pendidikan['tidak_tamat_sd'] ?? null;
        $data['sd_sederajat'] = $pendidikan['sd_sederajat'] ?? null;
        $data['smp_sederajat'] = $pendidikan['smp_sederajat'] ?? null;
        $data['sma_sederajat'] = $pendidikan['sma_sederajat'] ?? null;
        $data['diploma'] = $pendidikan['diploma'] ?? null;
        $data['sarjana'] = $pendidikan['sarjana'] ?? null;
        $data['s2'] = $pendidikan['s2'] ?? null;
        $data['s3'] = $pendidikan['s3'] ?? null;

        $perkawinan = $this->record->perkawinan ?? [];
        $data['belum_kawin'] = $perkawinan['belum_kawin'] ?? null;
        $data['kawin'] = $perkawinan['kawin'] ?? null;
        $data['cerai_hidup'] = $perkawinan['cerai_hidup'] ?? null;
        $data['cerai_mati'] = $perkawinan['cerai_mati'] ?? null;

        // fill form with mapped data
        $this->form->fill($data);
    }

    /**
     * Re-compose nested JSON fields from flat form data before saving.
     */
    protected function mutateFormDataBeforeSave(array $data): array
    {
        $jsonData = [];

        $jsonData['demografi_dusun_id'] = $data['demografi_dusun_id'] ?? $this->record->demografi_dusun_id ?? null;

        $jsonData['wilayah'] = [
            'rt' => $data['rt'] ?? 0,
            'kk' => $data['kk'] ?? 0,
        ];

        $jsonData['usia'] = [
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
        ];

        $jsonData['agama'] = [
            'islam' => $data['islam'] ?? 0,
            'kristen' => $data['kristen'] ?? 0,
            'katolik' => $data['katolik'] ?? 0,
            'hindu' => $data['hindu'] ?? 0,
            'buddha' => $data['buddha'] ?? 0,
            'konghucu' => $data['konghucu'] ?? 0,
            'lainnya' => $data['agama_lainnya'] ?? 0,
        ];

        $jsonData['pekerjaan'] = [
            'belum_bekerja' => $data['belum_bekerja'] ?? 0,
            'pelajar_mahasiswa' => $data['pelajar_mahasiswa'] ?? 0,
            'petani' => $data['petani'] ?? 0,
            'buruh_tani' => $data['buruh_tani'] ?? 0,
            'wiraswasta' => $data['wiraswasta'] ?? 0,
            'pns_tni_polri' => $data['pns_tni_polri'] ?? 0,
            'karyawan' => $data['karyawan'] ?? 0,
            'ibu_rumah_tangga' => $data['ibu_rumah_tangga'] ?? 0,
            'lainnya' => $data['pekerjaan_lainnya'] ?? 0,
        ];

        $jsonData['pendidikan'] = [
            'belum_sekolah' => $data['belum_sekolah'] ?? 0,
            'tidak_tamat_sd' => $data['tidak_tamat_sd'] ?? 0,
            'sd_sederajat' => $data['sd_sederajat'] ?? 0,
            'smp_sederajat' => $data['smp_sederajat'] ?? 0,
            'sma_sederajat' => $data['sma_sederajat'] ?? 0,
            'diploma' => $data['diploma'] ?? 0,
            'sarjana' => $data['sarjana'] ?? 0,
            's2' => $data['s2'] ?? 0,
            's3' => $data['s3'] ?? 0,
        ];

        $jsonData['perkawinan'] = [
            'belum_kawin' => $data['belum_kawin'] ?? 0,
            'kawin' => $data['kawin'] ?? 0,
            'cerai_hidup' => $data['cerai_hidup'] ?? 0,
            'cerai_mati' => $data['cerai_mati'] ?? 0,
        ];

        return $jsonData;
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
        return 'Data Demografi berhasil diperbarui!';
    }
}
