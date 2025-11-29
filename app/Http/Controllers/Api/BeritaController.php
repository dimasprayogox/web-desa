<?php
// filepath: app/Http/Controllers/Api/BeritaController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BeritaController extends Controller
{
    /**
     * Display a listing of berita
     * GET /api/berita
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Berita::query();

            // Filter by kategori
            if ($request->has('kategori')) {
                $query->where('kategori', $request->kategori);
            }

            // Search by judul atau isi
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('judul', 'like', "%{$search}%")
                        ->orWhere('isi', 'like', "%{$search}%");
                });
            }

            // Filter berita terbaru (last N days)
            if ($request->has('days')) {
                $days = (int) $request->days;
                $query->where('created_at', '>=', now()->subDays($days));
            }

            // Filter by date range
            if ($request->has('from_date')) {
                $query->whereDate('created_at', '>=', $request->from_date);
            }
            if ($request->has('to_date')) {
                $query->whereDate('created_at', '<=', $request->to_date);
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
                return $this->transformBerita($item);
            });

            return response()->json([
                'success' => true,
                'message' => 'Data berita berhasil diambil',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified berita
     * GET /api/berita/{id}
     * GET /api/berita/slug/{slug}
     */
    public function show($identifier): JsonResponse
    {
        try {
            // Try to find by ID first, then by slug
            $data = is_numeric($identifier)
                ? Berita::find($identifier)
                : Berita::where('slug', $identifier)->first();

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Berita tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data berita berhasil diambil',
                'data' => $this->transformBerita($data, true),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get berita by kategori
     * GET /api/berita/by-kategori/{kategori}
     */
    public function byKategori($kategori): JsonResponse
    {
        try {
            // Validate kategori
            if (!array_key_exists($kategori, Berita::KATEGORI)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kategori tidak valid. Gunakan: ' . implode(', ', array_keys(Berita::KATEGORI)),
                ], 400);
            }

            $data = Berita::where('kategori', $kategori)
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            $data->getCollection()->transform(function ($item) {
                return $this->transformBerita($item);
            });

            return response()->json([
                'success' => true,
                'message' => 'Data berita kategori ' . Berita::KATEGORI[$kategori] . ' berhasil diambil',
                'data' => [
                    'kategori' => [
                        'key' => $kategori,
                        'label' => Berita::KATEGORI[$kategori],
                    ],
                    'berita' => $data,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get latest berita
     * GET /api/berita/latest
     */
    public function latest(Request $request): JsonResponse
    {
        try {
            $limit = $request->get('limit', 5);

            $data = Berita::orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            $result = $data->map(function ($item) {
                return $this->transformBerita($item);
            });

            return response()->json([
                'success' => true,
                'message' => 'Berita terbaru berhasil diambil',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil berita terbaru',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get popular berita (most recent with images)
     * GET /api/berita/popular
     */
    public function popular(Request $request): JsonResponse
    {
        try {
            $limit = $request->get('limit', 6);

            $data = Berita::whereNotNull('gambar_url')
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            $result = $data->map(function ($item) {
                return $this->transformBerita($item);
            });

            return response()->json([
                'success' => true,
                'message' => 'Berita populer berhasil diambil',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil berita populer',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get berita statistics
     * GET /api/berita/statistics/summary
     */
    public function summary(): JsonResponse
    {
        try {
            $total = Berita::count();

            $byKategori = [];
            foreach (Berita::KATEGORI as $key => $label) {
                $byKategori[$key] = [
                    'label' => $label,
                    'count' => Berita::where('kategori', $key)->count(),
                ];
            }

            $totalWithImages = Berita::whereNotNull('gambar_url')->count();

            $latest30Days = Berita::where('created_at', '>=', now()->subDays(30))->count();
            $latest7Days = Berita::where('created_at', '>=', now()->subDays(7))->count();

            $recentByMonth = Berita::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as total')
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('year', 'month')
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->get()
                ->map(function ($item) {
                    return [
                        'period' => $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT),
                        'total' => $item->total,
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Statistik berita berhasil diambil',
                'data' => [
                    'total_berita' => $total,
                    'total_with_images' => $totalWithImages,
                    'latest_30_days' => $latest30Days,
                    'latest_7_days' => $latest7Days,
                    'by_kategori' => $byKategori,
                    'recent_by_month' => $recentByMonth,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Search berita
     * GET /api/berita/search
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

            $data = Berita::where(function ($query) use ($keyword) {
                $query->where('judul', 'like', "%{$keyword}%")
                    ->orWhere('isi', 'like', "%{$keyword}%");
            })
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            $data->getCollection()->transform(function ($item) {
                return $this->transformBerita($item);
            });

            return response()->json([
                'success' => true,
                'message' => 'Hasil pencarian berita',
                'data' => [
                    'keyword' => $keyword,
                    'total' => $data->total(),
                    'berita' => $data,
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
     * Get all available categories
     * GET /api/berita/kategori
     */
    public function kategori(): JsonResponse
    {
        try {
            $result = collect(Berita::KATEGORI)->map(function ($label, $key) {
                return [
                    'key' => $key,
                    'label' => $label,
                    'count' => Berita::where('kategori', $key)->count(),
                ];
            })->values();

            return response()->json([
                'success' => true,
                'message' => 'Daftar kategori berita berhasil diambil',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil kategori berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get related berita (same kategori, exclude current)
     * GET /api/berita/{id}/related
     */
    public function related($id, Request $request): JsonResponse
    {
        try {
            $berita = Berita::find($id);

            if (!$berita) {
                return response()->json([
                    'success' => false,
                    'message' => 'Berita tidak ditemukan',
                ], 404);
            }

            $limit = $request->get('limit', 4);

            $data = Berita::where('kategori', $berita->kategori)
                ->where('id', '!=', $id)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            $result = $data->map(function ($item) {
                return $this->transformBerita($item);
            });

            return response()->json([
                'success' => true,
                'message' => 'Berita terkait berhasil diambil',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil berita terkait',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper: Transform Berita data
     */
    private function transformBerita($item, $detailed = false): array
    {
        $gambarUrl = null;
        $rawPath = $item->getAttributes()['gambar_url'] ?? null;

        if ($rawPath && Storage::disk('public')->exists($rawPath)) {
            $gambarUrl = Storage::disk('public')->url($rawPath);
        }

        $baseData = [
            'id' => $item->id,
            'judul' => $item->judul,
            'slug' => $item->slug,
            'kategori' => [
                'key' => $item->kategori,
                'label' => Berita::KATEGORI[$item->kategori] ?? $item->kategori,
            ],
            'excerpt' => Str::limit(strip_tags($item->isi), 150),
            'gambar_url' => $gambarUrl,
            'has_gambar' => !is_null($gambarUrl),
            'created_at' => $item->created_at?->toIso8601String(),
            'created_at_human' => $item->created_at?->diffForHumans(),
            'updated_at' => $item->updated_at?->toIso8601String(),
        ];

        if ($detailed) {
            $baseData['isi'] = $item->isi;
            $baseData['isi_html'] = $this->formatContent($item->isi);
            $baseData['word_count'] = str_word_count(strip_tags($item->isi));
            $baseData['reading_time'] = ceil(str_word_count(strip_tags($item->isi)) / 200); // minutes
        }

        return $baseData;
    }

    /**
     * Helper: Format content for better HTML display
     */
    private function formatContent($content): string
    {
        // Add paragraphs if not already formatted
        if (strpos($content, '<p>') === false) {
            $content = '<p>' . nl2br($content) . '</p>';
        }

        return $content;
    }
}
