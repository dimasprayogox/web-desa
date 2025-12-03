<?php
// filepath: app/Http/Controllers/Api/UmkmController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Umkm;
use App\Models\KategoriUmkm;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class UmkmController extends Controller
{
    /**
     * Display a listing of UMKM
     * GET /api/umkm
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Umkm::with(['kategori']);

            // Filter by kategori
            if ($request->has('kategori_id')) {
                $query->where('kategori_id', $request->kategori_id);
            }

            // ✅ FIX: Search - hapus kolom 'pemilik' jika tidak ada
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('deskripsi', 'like', "%{$search}%")
                        ->orWhere('alamat', 'like', "%{$search}%");

                    // ✅ Only search 'pemilik' if column exists
                    if (\Schema::hasColumn('umkms', 'pemilik')) {
                        $q->orWhere('pemilik', 'like', "%{$search}%");
                    }
                });
            }

            // Filter UMKM yang punya foto
            if ($request->has('has_photos') && $request->has_photos) {
                $query->whereNotNull('foto_galeri')
                    ->where('foto_galeri', '!=', '[]')
                    ->where('foto_galeri', '!=', 'null');
            }

            // Filter UMKM yang punya marketplace
            if ($request->has('has_marketplace') && $request->has_marketplace) {
                $query->where(function ($q) {
                    $q->whereNotNull('shopee_url')
                        ->orWhereNotNull('tokopedia_url')
                        ->orWhereNotNull('tiktokshop_url');
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
                return $this->transformUmkm($item);
            });

            return response()->json([
                'success' => true,
                'message' => 'Data UMKM berhasil diambil',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data UMKM',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified UMKM
     * GET /api/umkm/{id}
     */
    public function show($id): JsonResponse
    {
        try {
            $data = Umkm::with(['kategori'])->find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'UMKM tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data UMKM berhasil diambil',
                'data' => $this->transformUmkm($data, true),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data UMKM',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get UMKM by kategori
     * GET /api/umkm/by-kategori/{kategori_id}
     */
    public function byKategori($kategoriId): JsonResponse
    {
        try {
            $kategori = KategoriUmkm::find($kategoriId);

            if (!$kategori) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kategori tidak ditemukan',
                ], 404);
            }

            $data = Umkm::with(['kategori'])
                ->where('kategori_id', $kategoriId)
                ->orderBy('nama', 'asc')
                ->get();

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada UMKM dalam kategori ini',
                ], 404);
            }

            $result = $data->map(function ($item) {
                return $this->transformUmkm($item);
            });

            return response()->json([
                'success' => true,
                'message' => 'Data UMKM kategori ' . $kategori->nama_kategori . ' berhasil diambil',
                'data' => [
                    'kategori' => [
                        'id' => $kategori->id,
                        'nama' => $kategori->nama_kategori,
                        'deskripsi' => $kategori->deskripsi,
                        'icon' => $kategori->icon,
                    ],
                    'total' => $result->count(),
                    'umkm' => $result,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data UMKM',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get featured UMKM (with photos and marketplace)
     * GET /api/umkm/featured
     */
    public function featured(Request $request): JsonResponse
    {
        try {
            $limit = $request->get('limit', 6);

            $data = Umkm::with(['kategori'])
                ->whereNotNull('foto_galeri')
                ->where('foto_galeri', '!=', '[]')
                ->where('foto_galeri', '!=', 'null')
                ->where(function ($q) {
                    $q->whereNotNull('shopee_url')
                        ->orWhereNotNull('tokopedia_url')
                        ->orWhereNotNull('tiktokshop_url');
                })
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            $result = $data->map(function ($item) {
                return $this->transformUmkm($item);
            });

            return response()->json([
                'success' => true,
                'message' => 'Data UMKM unggulan berhasil diambil',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data UMKM unggulan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get UMKM statistics
     * GET /api/umkm/statistics/summary
     */
    public function summary(): JsonResponse
    {
        try {
            $total = Umkm::count();

            $totalByKategori = Umkm::with('kategori')
                ->select('kategori_id', \DB::raw('count(*) as total'))
                ->groupBy('kategori_id')
                ->get()
                ->map(function ($item) {
                    return [
                        'kategori_id' => $item->kategori_id,
                        'kategori_nama' => $item->kategori->nama_kategori ?? null,
                        'total' => $item->total,
                    ];
                });

            $totalWithPhotos = Umkm::whereNotNull('foto_galeri')
                ->where('foto_galeri', '!=', '[]')
                ->where('foto_galeri', '!=', 'null')
                ->count();

            $totalWithMarketplace = Umkm::where(function ($q) {
                $q->whereNotNull('shopee_url')
                    ->orWhereNotNull('tokopedia_url')
                    ->orWhereNotNull('tiktokshop_url');
            })
                ->count();

            return response()->json([
                'success' => true,
                'message' => 'Statistik UMKM berhasil diambil',
                'data' => [
                    'total_umkm' => $total,
                    'total_with_photos' => $totalWithPhotos,
                    'total_with_marketplace' => $totalWithMarketplace,
                    'by_kategori' => $totalByKategori,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik UMKM',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Search UMKM
     * GET /api/umkm/search
     */
    public function search(Request $request): JsonResponse
    {
        try {
            if (!$request->has('q') || empty($request->q)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Parameter pencarian (q) diperlukan',
                ], 400);
            }

            $keyword = $request->q;

            $data = Umkm::with(['kategori'])
                ->where(function ($query) use ($keyword) {
                    $query->where('nama', 'like', "%{$keyword}%")
                        ->orWhere('deskripsi', 'like', "%{$keyword}%")
                        ->orWhere('alamat', 'like', "%{$keyword}%");

                    // ✅ Only search 'pemilik' if column exists
                    if (\Schema::hasColumn('umkms', 'pemilik')) {
                        $query->orWhere('pemilik', 'like', "%{$keyword}%");
                    }
                })
                ->orderBy('nama', 'asc')
                ->get();

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Tidak ada UMKM yang ditemukan',
                    'data' => [],
                ], 200);
            }

            $result = $data->map(function ($item) {
                return $this->transformUmkm($item);
            });

            return response()->json([
                'success' => true,
                'message' => 'Hasil pencarian UMKM',
                'data' => [
                    'keyword' => $keyword,
                    'total' => $result->count(),
                    'umkm' => $result,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan pencarian',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper: Transform UMKM data
     */
    private function transformUmkm($item, $detailed = false): array
    {
        $baseData = [
            'id' => $item->id,
            'nama' => $item->nama,
            'slug' => \Illuminate\Support\Str::slug($item->nama) . '-' . $item->id,
            'kategori' => [
                'id' => $item->kategori->id ?? null,
                'nama' => $item->kategori->nama_kategori ?? null,
                'icon' => $item->kategori->icon ?? null,
            ],
            'pemilik' => $item->pemilik ?? null,
            'deskripsi' => $item->deskripsi,
            'telepon' => $item->telepon,
            'alamat' => $item->alamat,
            'foto_utama' => $this->getFotoUtama($item),
            'jumlah_foto' => $this->getJumlahFoto($item),
        ];

        if ($detailed) {
            $baseData['foto_galeri'] = $this->getFotoGaleriUrls($item);
            $baseData['sosial_media'] = [
                'facebook' => $item->sosial_facebook,
                'instagram' => $item->sosial_instagram,
                'tiktok' => $item->sosial_tiktok,
            ];
            $baseData['marketplace'] = [
                'shopee' => $item->shopee_url,
                'tokopedia' => $item->tokopedia_url,
                'tiktok_shop' => $item->tiktokshop_url,
            ];
            $baseData['email'] = $item->email ?? null;
            $baseData['website'] = $item->website ?? null;
            $baseData['jam_buka'] = $item->jam_buka ?? null;
            $baseData['produk'] = $item->produk ? (is_array($item->produk) ? $item->produk : explode(',', $item->produk)) : [];
            $baseData['created_at'] = $item->created_at?->toIso8601String();
            $baseData['created_at_human'] = $item->created_at?->diffForHumans();
            $baseData['updated_at'] = $item->updated_at?->toIso8601String();
        }

        return $baseData;
    }

    /**
     * Helper: Get foto utama (first photo)
     */
    private function getFotoUtama($item): ?string
    {
        if (is_array($item->foto_galeri) && !empty($item->foto_galeri)) {
            $first = $item->foto_galeri[0];

            if (is_string($first)) {
                return Storage::disk('public')->url($first);
            }

            if (is_array($first) && isset($first['path'])) {
                return Storage::disk('public')->url($first['path']);
            }
        }

        return null;
    }

    /**
     * ✅ TAMBAH METHOD BARU - Get foto galeri as array of URLs
     */
    private function getFotoGaleriUrls($item): array
    {
        if (!is_array($item->foto_galeri) || empty($item->foto_galeri)) {
            return [];
        }

        $urls = [];

        foreach ($item->foto_galeri as $foto) {
            if (is_string($foto)) {
                $urls[] = Storage::disk('public')->url($foto);
            } elseif (is_array($foto) && isset($foto['path'])) {
                $urls[] = Storage::disk('public')->url($foto['path']);
            }
        }

        return $urls;
    }

    /**
     * Helper: Get all foto galeri (untuk list view - dengan detail path)
     */
    private function getFotoGaleri($item): array
    {
        if (!is_array($item->foto_galeri) || empty($item->foto_galeri)) {
            return [];
        }

        return collect($item->foto_galeri)->map(function ($foto) {
            if (is_string($foto)) {
                return [
                    'path' => $foto,
                    'url' => Storage::disk('public')->url($foto),
                ];
            }

            if (is_array($foto) && isset($foto['path'])) {
                return [
                    'path' => $foto['path'],
                    'url' => Storage::disk('public')->url($foto['path']),
                ];
            }

            return null;
        })->filter()->values()->toArray();
    }

    /**
     * Helper: Get jumlah foto
     */
    private function getJumlahFoto($item): int
    {
        if (is_array($item->foto_galeri)) {
            return count($item->foto_galeri);
        }

        return 0;
    }
}
