<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TahunData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class TahunDataController extends Controller
{
    /**
     * Get all tahun data
     */
    public function index(): JsonResponse
    {
        try {
            // relasi yang relevan untuk model TahunData
            $possible = ['demografiDusun', 'laporanApbdes'];

            // filter hanya relasi yang benar-benar ada
            $relations = array_filter($possible, fn($r) => method_exists(new TahunData(), $r));

            $data = TahunData::query()
                ->when(!empty($relations), fn($q) => $q->withCount($relations))
                ->orderBy('tahun', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Throwable $e) {
            Log::error('TahunDataController@index error: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get tahun data by tahun
     */
    public function show($tahun): JsonResponse
    {
        try {
            $possible = ['demografiDusun', 'laporanApbdes'];
            $relations = array_filter($possible, fn($r) => method_exists(new TahunData(), $r));

            $data = TahunData::query()
                ->where('tahun', $tahun)
                ->when(!empty($relations), fn($q) => $q->withCount($relations))
                ->first();

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tahun tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Throwable $e) {
            Log::error('TahunDataController@show error: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get available years
     */
    public function availableYears(): JsonResponse
    {
        try {
            // primary key model Anda adalah id_tahun -> gunakan sebagai key pluck
            $years = TahunData::orderBy('tahun', 'desc')
                ->pluck('tahun', 'id_tahun');

            return response()->json([
                'success' => true,
                'data' => $years,
            ]);
        } catch (\Throwable $e) {
            Log::error('TahunDataController@availableYears error: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil daftar tahun.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
