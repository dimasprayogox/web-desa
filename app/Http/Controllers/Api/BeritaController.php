<?php
// filepath: d:\project\KKN\desa-krebet\app\Http\Controllers\Api\BeritaController.php

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
     * Get all berita with pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 10);
            $search = $request->input('search');
            $kategori = $request->input('kategori');
            $sortBy = $request->input('sort_by', 'created_at');
            $order = $request->input('order', 'desc');

            $query = Berita::query();

            // Search
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('judul', 'like', "%{$search}%")
                        ->orWhere('isi', 'like', "%{$search}%");
                });
            }

            // Filter by kategori
            if ($kategori) {
                $query->where('kategori', $kategori);
            }

            // Sorting
            $query->orderBy($sortBy, $order);

            // Paginate
            $berita = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Berita retrieved successfully',
                'data' => [
                    'data' => $berita->map(fn($item) => $this->transformBerita($item)),
                    'current_page' => $berita->currentPage(),
                    'last_page' => $berita->lastPage(),
                    'per_page' => $berita->perPage(),
                    'total' => $berita->total(),
                    'from' => $berita->firstItem(),
                    'to' => $berita->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve berita',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single berita by ID
     */
    public function show($id): JsonResponse
    {
        try {
            $berita = Berita::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Berita retrieved successfully',
                'data' => $this->transformBerita($berita, true)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve berita',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ UPDATED - Get berita by slug (menggunakan judul sebagai slug)
     */
    public function getBySlug($slug): JsonResponse
    {
        try {
            // Extract ID dari slug (format: "judul-berita-123")
            $idMatch = preg_match('/-(\d+)$/', $slug, $matches);

            if ($idMatch && isset($matches[1])) {
                $id = $matches[1];
                $berita = Berita::find($id);

                if ($berita) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Berita retrieved successfully',
                        'data' => $this->transformBerita($berita, true)
                    ]);
                }
            }

            // Fallback: Cari berdasarkan judul yang di-slugify
            // Convert slug kembali ke kata-kata: "judul-berita-123" -> "judul berita"
            $judulFromSlug = str_replace('-', ' ', preg_replace('/-\d+$/', '', $slug));

            $berita = Berita::where('judul', 'like', "%{$judulFromSlug}%")->first();

            if ($berita) {
                return response()->json([
                    'success' => true,
                    'message' => 'Berita retrieved successfully',
                    'data' => $this->transformBerita($berita, true)
                ]);
            }

            // If still not found, return 404
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Error in getBySlug: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve berita',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Helper: Generate slug dari judul
     */
    private function generateSlug($judul, $id): string
    {
        $slug = Str::slug($judul); // "Judul Berita" -> "judul-berita"
        return $slug . '-' . $id;   // "judul-berita-123"
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
            'slug' => $this->generateSlug($item->judul, $item->id), // ✅ Generate slug dari judul
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
            $baseData['reading_time'] = ceil(str_word_count(strip_tags($item->isi)) / 200);
        }

        return $baseData;
    }

    /**
     * Helper: Format content for better HTML display
     */
    private function formatContent($content): string
    {
        if (strpos($content, '<p>') === false) {
            $content = '<p>' . nl2br($content) . '</p>';
        }

        return $content;
    }
}
