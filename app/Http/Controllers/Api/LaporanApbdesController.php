<?php
// filepath: app/Http/Controllers/Api/LaporanApbdesController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanApbdes;
use App\Models\DetailApbdes;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LaporanApbdesController extends Controller
{
    /**
     * Display a listing of laporan APBDes
     * GET /api/laporan-apbdes
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = LaporanApbdes::with(['tahunData', 'detailApbdes']);

            // Filter by tahun
            if ($request->has('tahun')) {
                $query->whereHas('tahunData', function ($q) use ($request) {
                    $q->where('tahun', $request->tahun);
                });
            }

            // Filter by tahun aktif
            if ($request->has('active_year') && $request->active_year) {
                $query->whereHas('tahunData', function ($q) {
                    $q->where('is_active', true);
                });
            }

            // Filter by bulan
            if ($request->has('bulan')) {
                $query->where('bulan_rilis', $request->bulan);
            }

            // Search by nama
            if ($request->has('search')) {
                $query->where('nama_laporan', 'like', '%' . $request->search . '%');
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $data = $query->paginate($perPage);

            // Transform data
            $data->getCollection()->transform(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_laporan' => $item->nama_laporan,
                    'tahun' => [
                        'id' => $item->tahunData->id_tahun ?? null,
                        'tahun' => $item->tahunData->tahun ?? null,
                        'is_active' => $item->tahunData->is_active ?? false,
                    ],
                    'bulan_rilis' => $item->bulan_rilis,
                    'bulan_nama' => $this->getBulanNama($item->bulan_rilis),
                    'deskripsi' => $item->deskripsi,
                    'jumlah_detail' => $item->detailApbdes->count(),
                    'summary' => $this->calculateSummary($item->detailApbdes),
                    'created_at' => $item->created_at?->toIso8601String(),
                    'updated_at' => $item->updated_at?->toIso8601String(),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data laporan APBDes berhasil diambil',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data laporan APBDes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified laporan
     * GET /api/laporan-apbdes/{id}
     */
    public function show($id): JsonResponse
    {
        try {
            $data = LaporanApbdes::with(['tahunData', 'detailApbdes'])->find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Laporan APBDes tidak ditemukan',
                ], 404);
            }

            // Group details by tipe
            $detailsByTipe = [
                'pendapatan' => [],
                'belanja' => [],
                'pembiayaan' => [],
            ];

            foreach ($data->detailApbdes as $detail) {
                $detailsByTipe[$detail->tipe][] = [
                    'id' => $detail->id,
                    'uraian' => $detail->uraian,
                    'anggaran' => (float) $detail->anggaran,
                    'realisasi' => (float) $detail->realisasi,
                    'selisih' => (float) ($detail->realisasi - $detail->anggaran),
                    'persentase' => $detail->anggaran > 0
                        ? round(($detail->realisasi / $detail->anggaran) * 100, 2)
                        : 0,
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Data laporan APBDes berhasil diambil',
                'data' => [
                    'id' => $data->id,
                    'nama_laporan' => $data->nama_laporan,
                    'tahun' => [
                        'id' => $data->tahunData->id_tahun ?? null,
                        'tahun' => $data->tahunData->tahun ?? null,
                        'is_active' => $data->tahunData->is_active ?? false,
                        'keterangan' => $data->tahunData->keterangan ?? null,
                    ],
                    'bulan_rilis' => $data->bulan_rilis,
                    'bulan_nama' => $this->getBulanNama($data->bulan_rilis),
                    'deskripsi' => $data->deskripsi,
                    'details' => $detailsByTipe,
                    'summary' => $this->calculateDetailedSummary($data->detailApbdes),
                    'created_at' => $data->created_at?->toIso8601String(),
                    'updated_at' => $data->updated_at?->toIso8601String(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data laporan APBDes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get summary of all APBDes
     * GET /api/laporan-apbdes/statistics/summary
     */
    public function summary(Request $request): JsonResponse
    {
        try {
            $query = LaporanApbdes::with(['tahunData', 'detailApbdes']);

            // Filter by tahun
            if ($request->has('tahun')) {
                $query->whereHas('tahunData', function ($q) use ($request) {
                    $q->where('tahun', $request->tahun);
                });
            }

            // Filter by active year
            if ($request->has('active_year') && $request->active_year) {
                $query->whereHas('tahunData', function ($q) {
                    $q->where('is_active', true);
                });
            }

            $laporans = $query->get();

            $totalPendapatan = 0;
            $totalBelanja = 0;
            $totalPembiayaan = 0;
            $realisasiPendapatan = 0;
            $realisasiBelanja = 0;
            $realisasiPembiayaan = 0;

            foreach ($laporans as $laporan) {
                foreach ($laporan->detailApbdes as $detail) {
                    switch ($detail->tipe) {
                        case 'pendapatan':
                            $totalPendapatan += (float) $detail->anggaran;
                            $realisasiPendapatan += (float) $detail->realisasi;
                            break;
                        case 'belanja':
                            $totalBelanja += (float) $detail->anggaran;
                            $realisasiBelanja += (float) $detail->realisasi;
                            break;
                        case 'pembiayaan':
                            $totalPembiayaan += (float) $detail->anggaran;
                            $realisasiPembiayaan += (float) $detail->realisasi;
                            break;
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Statistik APBDes berhasil diambil',
                'data' => [
                    'total_laporan' => $laporans->count(),
                    'pendapatan' => [
                        'anggaran' => $totalPendapatan,
                        'realisasi' => $realisasiPendapatan,
                        'selisih' => $realisasiPendapatan - $totalPendapatan,
                        'persentase' => $totalPendapatan > 0
                            ? round(($realisasiPendapatan / $totalPendapatan) * 100, 2)
                            : 0,
                    ],
                    'belanja' => [
                        'anggaran' => $totalBelanja,
                        'realisasi' => $realisasiBelanja,
                        'selisih' => $realisasiBelanja - $totalBelanja,
                        'persentase' => $totalBelanja > 0
                            ? round(($realisasiBelanja / $totalBelanja) * 100, 2)
                            : 0,
                    ],
                    'pembiayaan' => [
                        'anggaran' => $totalPembiayaan,
                        'realisasi' => $realisasiPembiayaan,
                        'selisih' => $realisasiPembiayaan - $totalPembiayaan,
                        'persentase' => $totalPembiayaan > 0
                            ? round(($realisasiPembiayaan / $totalPembiayaan) * 100, 2)
                            : 0,
                    ],
                    'sisa_dana' => ($realisasiPendapatan + $realisasiPembiayaan) - $realisasiBelanja,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik APBDes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get laporan by tahun
     * GET /api/laporan-apbdes/by-tahun/{tahun}
     */
    public function byTahun($tahun): JsonResponse
    {
        try {
            $data = LaporanApbdes::with(['tahunData', 'detailApbdes'])
                ->whereHas('tahunData', function ($q) use ($tahun) {
                    $q->where('tahun', $tahun);
                })
                ->get();

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak ditemukan untuk tahun ' . $tahun,
                ], 404);
            }

            $result = $data->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_laporan' => $item->nama_laporan,
                    'bulan_rilis' => $item->bulan_rilis,
                    'bulan_nama' => $this->getBulanNama($item->bulan_rilis),
                    'jumlah_detail' => $item->detailApbdes->count(),
                    'summary' => $this->calculateSummary($item->detailApbdes),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data laporan APBDes tahun ' . $tahun . ' berhasil diambil',
                'data' => [
                    'tahun' => (int) $tahun,
                    'total_laporan' => $result->count(),
                    'laporan' => $result,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data laporan APBDes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper: Get nama bulan
     */
    private function getBulanNama($bulan): string
    {
        $namaBulan = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember',
        ];

        return $namaBulan[$bulan] ?? '-';
    }

    /**
     * Helper: Calculate summary
     */
    private function calculateSummary($details): array
    {
        $summary = [
            'total_anggaran' => 0,
            'total_realisasi' => 0,
        ];

        foreach ($details as $detail) {
            $summary['total_anggaran'] += (float) $detail->anggaran;
            $summary['total_realisasi'] += (float) $detail->realisasi;
        }

        $summary['selisih'] = $summary['total_realisasi'] - $summary['total_anggaran'];
        $summary['persentase'] = $summary['total_anggaran'] > 0
            ? round(($summary['total_realisasi'] / $summary['total_anggaran']) * 100, 2)
            : 0;

        return $summary;
    }

    /**
     * Helper: Calculate detailed summary by tipe
     */
    private function calculateDetailedSummary($details): array
    {
        $summary = [
            'pendapatan' => ['anggaran' => 0, 'realisasi' => 0],
            'belanja' => ['anggaran' => 0, 'realisasi' => 0],
            'pembiayaan' => ['anggaran' => 0, 'realisasi' => 0],
        ];

        foreach ($details as $detail) {
            $summary[$detail->tipe]['anggaran'] += (float) $detail->anggaran;
            $summary[$detail->tipe]['realisasi'] += (float) $detail->realisasi;
        }

        foreach ($summary as $tipe => $data) {
            $summary[$tipe]['selisih'] = $data['realisasi'] - $data['anggaran'];
            $summary[$tipe]['persentase'] = $data['anggaran'] > 0
                ? round(($data['realisasi'] / $data['anggaran']) * 100, 2)
                : 0;
        }

        // Calculate sisa dana
        $summary['sisa_dana'] = ($summary['pendapatan']['realisasi'] + $summary['pembiayaan']['realisasi'])
            - $summary['belanja']['realisasi'];

        return $summary;
    }
}
