<?php
// filepath: app/Http/Controllers/Api/DemografiDetailController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemografiDetail;
use App\Models\DemografiDusun;
use App\Models\TahunData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class DemografiDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     * GET /api/demografi-detail
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = DemografiDetail::with(['demografiDusun.tahunData']);

            // Filter by tahun
            if ($request->has('tahun')) {
                $query->whereHas('demografiDusun.tahunData', function ($q) use ($request) {
                    $q->where('tahun', $request->tahun);
                });
            }

            // Filter by dusun
            if ($request->has('dusun_id')) {
                $query->where('demografi_dusun_id', $request->dusun_id);
            }

            // Filter by tahun aktif
            if ($request->has('active_year') && $request->active_year) {
                $query->whereHas('demografiDusun.tahunData', function ($q) {
                    $q->where('is_active', true);
                });
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
                    'demografi_dusun_id' => $item->demografi_dusun_id,
                    'dusun' => [
                        'id' => $item->demografiDusun->id_dusun ?? null,
                        'nama' => $item->demografiDusun->nama_dusun ?? null,
                        'tahun' => $item->demografiDusun->tahunData->tahun ?? null,
                    ],
                    'wilayah' => $item->wilayah,
                    'usia' => $item->usia,
                    'agama' => $item->agama,
                    'pekerjaan' => $item->pekerjaan,
                    'pendidikan' => $item->pendidikan,
                    'perkawinan' => $item->perkawinan,
                    'statistik' => [
                        'total_penduduk' => $item->total_penduduk,
                        'total_laki_laki' => $item->total_laki,
                        'total_perempuan' => $item->total_perempuan,
                        'total_kk' => $item->wilayah['kk'] ?? 0,
                        'total_rt' => $item->wilayah['rt'] ?? 0,
                    ],
                    'created_at' => $item->created_at?->toIso8601String(),
                    'updated_at' => $item->updated_at?->toIso8601String(),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data demografi detail berhasil diambil',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data demografi detail',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * GET /api/demografi-detail/{id}
     */
    public function show($id): JsonResponse
    {
        try {
            $data = DemografiDetail::with(['demografiDusun.tahunData'])->find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data demografi detail tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data demografi detail berhasil diambil',
                'data' => [
                    'id' => $data->id,
                    'demografi_dusun_id' => $data->demografi_dusun_id,
                    'dusun' => [
                        'id' => $data->demografiDusun->id_dusun ?? null,
                        'nama' => $data->demografiDusun->nama_dusun ?? null,
                        'tahun' => $data->demografiDusun->tahunData->tahun ?? null,
                        'keterangan' => $data->demografiDusun->keterangan ?? null,
                    ],
                    'wilayah' => $data->wilayah,
                    'usia' => $data->usia,
                    'agama' => $data->agama,
                    'pekerjaan' => $data->pekerjaan,
                    'pendidikan' => $data->pendidikan,
                    'perkawinan' => $data->perkawinan,
                    'statistik' => [
                        'total_penduduk' => $data->total_penduduk,
                        'total_laki_laki' => $data->total_laki,
                        'total_perempuan' => $data->total_perempuan,
                        'total_kk' => $data->wilayah['kk'] ?? 0,
                        'total_rt' => $data->wilayah['rt'] ?? 0,
                    ],
                    'created_at' => $data->created_at?->toIso8601String(),
                    'updated_at' => $data->updated_at?->toIso8601String(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data demografi detail',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get summary statistics
     * GET /api/demografi-detail/statistics/summary
     */
    public function summary(Request $request): JsonResponse
    {
        try {
            $query = DemografiDetail::with(['demografiDusun.tahunData']);

            // Filter by tahun
            if ($request->has('tahun')) {
                $query->whereHas('demografiDusun.tahunData', function ($q) use ($request) {
                    $q->where('tahun', $request->tahun);
                });
            }

            // Filter by active year
            if ($request->has('active_year') && $request->active_year) {
                $query->whereHas('demografiDusun.tahunData', function ($q) {
                    $q->where('is_active', true);
                });
            }

            $data = $query->get();

            $summary = [
                'total_dusun' => $data->count(),
                'total_penduduk' => $data->sum('total_penduduk'),
                'total_laki_laki' => $data->sum('total_laki'),
                'total_perempuan' => $data->sum('total_perempuan'),
                'total_kk' => $data->sum(function ($item) {
                    return $item->wilayah['kk'] ?? 0;
                }),
                'total_rt' => $data->sum(function ($item) {
                    return $item->wilayah['rt'] ?? 0;
                }),
                'rasio_jenis_kelamin' => $data->sum('total_perempuan') > 0
                    ? round(($data->sum('total_laki') / $data->sum('total_perempuan')) * 100, 2)
                    : 0,
            ];

            // Aggregate by agama
            $agamaStats = [];
            foreach ($data as $item) {
                foreach ($item->agama as $agama => $value) {
                    if (!isset($agamaStats[$agama])) {
                        $agamaStats[$agama] = 0;
                    }
                    $agamaStats[$agama] += $value;
                }
            }

            // Aggregate by pekerjaan
            $pekerjaanStats = [];
            foreach ($data as $item) {
                foreach ($item->pekerjaan as $pekerjaan => $value) {
                    if (!isset($pekerjaanStats[$pekerjaan])) {
                        $pekerjaanStats[$pekerjaan] = 0;
                    }
                    $pekerjaanStats[$pekerjaan] += $value;
                }
            }

            // Aggregate by pendidikan
            $pendidikanStats = [];
            foreach ($data as $item) {
                foreach ($item->pendidikan as $pendidikan => $value) {
                    if (!isset($pendidikanStats[$pendidikan])) {
                        $pendidikanStats[$pendidikan] = 0;
                    }
                    $pendidikanStats[$pendidikan] += $value;
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Statistik demografi berhasil diambil',
                'data' => [
                    'summary' => $summary,
                    'breakdown' => [
                        'agama' => $agamaStats,
                        'pekerjaan' => $pekerjaanStats,
                        'pendidikan' => $pendidikanStats,
                    ],
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik demografi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get data by dusun
     * GET /api/demografi-detail/by-dusun/{dusun_id}
     */
    public function byDusun($dusunId): JsonResponse
    {
        try {
            $data = DemografiDetail::with(['demografiDusun.tahunData'])
                ->where('demografi_dusun_id', $dusunId)
                ->get();

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak ditemukan untuk dusun ini',
                ], 404);
            }

            $result = $data->map(function ($item) {
                return [
                    'id' => $item->id,
                    'tahun' => $item->demografiDusun->tahunData->tahun ?? null,
                    'wilayah' => $item->wilayah,
                    'statistik' => [
                        'total_penduduk' => $item->total_penduduk,
                        'total_laki_laki' => $item->total_laki,
                        'total_perempuan' => $item->total_perempuan,
                        'total_kk' => $item->wilayah['kk'] ?? 0,
                    ],
                    'usia' => $item->usia,
                    'agama' => $item->agama,
                    'pekerjaan' => $item->pekerjaan,
                    'pendidikan' => $item->pendidikan,
                    'perkawinan' => $item->perkawinan,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data demografi dusun berhasil diambil',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data demografi dusun',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get data by tahun
     * GET /api/demografi-detail/by-tahun/{tahun}
     */
    public function byTahun($tahun): JsonResponse
    {
        try {
            $data = DemografiDetail::with(['demografiDusun.tahunData'])
                ->whereHas('demografiDusun.tahunData', function ($q) use ($tahun) {
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
                    'dusun' => $item->demografiDusun->nama_dusun ?? null,
                    'wilayah' => $item->wilayah,
                    'statistik' => [
                        'total_penduduk' => $item->total_penduduk,
                        'total_laki_laki' => $item->total_laki,
                        'total_perempuan' => $item->total_perempuan,
                        'total_kk' => $item->wilayah['kk'] ?? 0,
                    ],
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data demografi tahun ' . $tahun . ' berhasil diambil',
                'data' => [
                    'tahun' => (int) $tahun,
                    'total_dusun' => $result->count(),
                    'details' => $result,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data demografi tahun',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get piramida penduduk data
     * GET /api/demografi-detail/piramida
     */
    public function piramida(Request $request): JsonResponse
    {
        try {
            $query = DemografiDetail::with(['demografiDusun.tahunData']);

            // Filter by tahun or active year
            if ($request->has('tahun')) {
                $query->whereHas('demografiDusun.tahunData', function ($q) use ($request) {
                    $q->where('tahun', $request->tahun);
                });
            } elseif ($request->get('active_year', true)) {
                $query->whereHas('demografiDusun.tahunData', function ($q) {
                    $q->where('is_active', true);
                });
            }

            $data = $query->get();

            $piramida = [];
            foreach ($data as $item) {
                foreach ($item->usia as $range => $gender) {
                    if (!isset($piramida[$range])) {
                        $piramida[$range] = ['l' => 0, 'p' => 0];
                    }
                    $piramida[$range]['l'] += $gender['l'] ?? 0;
                    $piramida[$range]['p'] += $gender['p'] ?? 0;
                }
            }

            // Sort by age range
            ksort($piramida);

            return response()->json([
                'success' => true,
                'message' => 'Data piramida penduduk berhasil diambil',
                'data' => $piramida,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data piramida penduduk',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
