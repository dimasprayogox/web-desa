<?php
// filepath: app/Http/Controllers/Api/DetailApbdesController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DetailApbdes;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DetailApbdesController extends Controller
{
    /**
     * Display a listing of detail APBDes
     * GET /api/detail-apbdes
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = DetailApbdes::with(['laporanApbdes.tahunData']);

            // Filter by laporan
            if ($request->has('laporan_id')) {
                $query->where('laporan_apbdes_id', $request->laporan_id);
            }

            // Filter by tipe
            if ($request->has('tipe')) {
                $query->where('tipe', $request->tipe);
            }

            // Filter by tahun
            if ($request->has('tahun')) {
                $query->whereHas('laporanApbdes.tahunData', function ($q) use ($request) {
                    $q->where('tahun', $request->tahun);
                });
            }

            // Search by uraian
            if ($request->has('search')) {
                $query->where('uraian', 'like', '%' . $request->search . '%');
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
                    'laporan' => [
                        'id' => $item->laporanApbdes->id ?? null,
                        'nama' => $item->laporanApbdes->nama_laporan ?? null,
                        'tahun' => $item->laporanApbdes->tahunData->tahun ?? null,
                    ],
                    'tipe' => $item->tipe,
                    'uraian' => $item->uraian,
                    'anggaran' => (float) $item->anggaran,
                    'realisasi' => (float) $item->realisasi,
                    'selisih' => (float) ($item->realisasi - $item->anggaran),
                    'persentase' => $item->anggaran > 0
                        ? round(($item->realisasi / $item->anggaran) * 100, 2)
                        : 0,
                    'created_at' => $item->created_at?->toIso8601String(),
                    'updated_at' => $item->updated_at?->toIso8601String(),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data detail APBDes berhasil diambil',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data detail APBDes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified detail
     * GET /api/detail-apbdes/{id}
     */
    public function show($id): JsonResponse
    {
        try {
            $data = DetailApbdes::with(['laporanApbdes.tahunData'])->find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Detail APBDes tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data detail APBDes berhasil diambil',
                'data' => [
                    'id' => $data->id,
                    'laporan' => [
                        'id' => $data->laporanApbdes->id ?? null,
                        'nama' => $data->laporanApbdes->nama_laporan ?? null,
                        'tahun' => $data->laporanApbdes->tahunData->tahun ?? null,
                        'bulan_rilis' => $data->laporanApbdes->bulan_rilis ?? null,
                    ],
                    'tipe' => $data->tipe,
                    'uraian' => $data->uraian,
                    'anggaran' => (float) $data->anggaran,
                    'realisasi' => (float) $data->realisasi,
                    'selisih' => (float) ($data->realisasi - $data->anggaran),
                    'persentase' => $data->anggaran > 0
                        ? round(($data->realisasi / $data->anggaran) * 100, 2)
                        : 0,
                    'status' => $this->getStatus($data),
                    'created_at' => $data->created_at?->toIso8601String(),
                    'updated_at' => $data->updated_at?->toIso8601String(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data detail APBDes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get details by laporan
     * GET /api/detail-apbdes/by-laporan/{laporan_id}
     */
    public function byLaporan($laporanId): JsonResponse
    {
        try {
            $data = DetailApbdes::with(['laporanApbdes.tahunData'])
                ->where('laporan_apbdes_id', $laporanId)
                ->get();

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak ditemukan untuk laporan ini',
                ], 404);
            }

            // Group by tipe
            $grouped = $data->groupBy('tipe');

            $result = [];
            foreach ($grouped as $tipe => $items) {
                $result[$tipe] = [
                    'total' => $items->count(),
                    'total_anggaran' => $items->sum('anggaran'),
                    'total_realisasi' => $items->sum('realisasi'),
                    'items' => $items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'uraian' => $item->uraian,
                            'anggaran' => (float) $item->anggaran,
                            'realisasi' => (float) $item->realisasi,
                            'selisih' => (float) ($item->realisasi - $item->anggaran),
                            'persentase' => $item->anggaran > 0
                                ? round(($item->realisasi / $item->anggaran) * 100, 2)
                                : 0,
                        ];
                    })->values(),
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Data detail APBDes berhasil diambil',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data detail APBDes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get details by tipe
     * GET /api/detail-apbdes/by-tipe/{tipe}
     */
    public function byTipe($tipe): JsonResponse
    {
        try {
            if (!in_array($tipe, ['pendapatan', 'belanja', 'pembiayaan'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tipe tidak valid. Gunakan: pendapatan, belanja, atau pembiayaan',
                ], 400);
            }

            $data = DetailApbdes::with(['laporanApbdes.tahunData'])
                ->where('tipe', $tipe)
                ->get();

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak ditemukan untuk tipe ' . $tipe,
                ], 404);
            }

            $result = $data->map(function ($item) {
                return [
                    'id' => $item->id,
                    'laporan' => $item->laporanApbdes->nama_laporan ?? null,
                    'tahun' => $item->laporanApbdes->tahunData->tahun ?? null,
                    'uraian' => $item->uraian,
                    'anggaran' => (float) $item->anggaran,
                    'realisasi' => (float) $item->realisasi,
                    'selisih' => (float) ($item->realisasi - $item->anggaran),
                    'persentase' => $item->anggaran > 0
                        ? round(($item->realisasi / $item->anggaran) * 100, 2)
                        : 0,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data detail APBDes tipe ' . $tipe . ' berhasil diambil',
                'data' => [
                    'tipe' => $tipe,
                    'total' => $result->count(),
                    'total_anggaran' => $data->sum('anggaran'),
                    'total_realisasi' => $data->sum('realisasi'),
                    'details' => $result,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data detail APBDes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper: Get status based on realization percentage
     */
    private function getStatus($detail): string
    {
        if ($detail->anggaran == 0) {
            return 'no_budget';
        }

        $persentase = ($detail->realisasi / $detail->anggaran) * 100;

        if ($persentase < 50) {
            return 'low';
        } elseif ($persentase < 80) {
            return 'medium';
        } elseif ($persentase < 100) {
            return 'good';
        } else {
            return 'excellent';
        }
    }
}
