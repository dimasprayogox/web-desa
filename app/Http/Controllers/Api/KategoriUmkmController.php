<?php
// filepath: app/Http/Controllers/Api/KategoriUmkmController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KategoriUmkm;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KategoriUmkmController extends Controller
{
    /**
     * Display a listing of kategori
     * GET /api/kategori-umkm
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = KategoriUmkm::withCount('umkms');

            // Sorting
            $sortBy = $request->get('sort_by', 'nama_kategori');
            $sortOrder = $request->get('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            $data = $query->get();

            $result = $data->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_kategori' => $item->nama_kategori,
                    'slug' => $item->slug,
                    'deskripsi' => $item->deskripsi,
                    'icon' => $item->icon,
                    'jumlah_umkm' => $item->umkms_count,
                    'created_at' => $item->created_at?->toIso8601String(),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data kategori UMKM berhasil diambil',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data kategori UMKM',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified kategori
     * GET /api/kategori-umkm/{id}
     */
    public function show($id): JsonResponse
    {
        try {
            $data = KategoriUmkm::withCount('umkms')->find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kategori UMKM tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data kategori UMKM berhasil diambil',
                'data' => [
                    'id' => $data->id,
                    'nama_kategori' => $data->nama_kategori,
                    'slug' => $data->slug,
                    'deskripsi' => $data->deskripsi,
                    'icon' => $data->icon,
                    'jumlah_umkm' => $data->umkms_count,
                    'created_at' => $data->created_at?->toIso8601String(),
                    'updated_at' => $data->updated_at?->toIso8601String(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data kategori UMKM',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
