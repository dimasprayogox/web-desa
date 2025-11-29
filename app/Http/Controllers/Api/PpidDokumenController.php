<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PpidDokumen;
use Illuminate\Http\Request;

class PpidDokumenController extends Controller
{
    /**
     * Get all PPID dokumen with pagination
     */
    public function index(Request $request)
    {
        try {
            $query = PpidDokumen::query();

            // Filter by kategori
            if ($request->has('kategori')) {
                $query->where('kategori', $request->kategori);
            }

            // Filter by tahun
            if ($request->has('tahun')) {
                $query->where('tahun', $request->tahun);
            }

            // Filter by uploader
            if ($request->has('uploader')) {
                $query->where('uploader', 'like', '%' . $request->uploader . '%');
            }

            // Search by judul
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('judul_dokumen', 'like', '%' . $search . '%')
                        ->orWhere('uploader', 'like', '%' . $search . '%');
                });
            }

            // Filter by date range
            if ($request->has('dari_tanggal')) {
                $query->whereDate('tanggal_upload', '>=', $request->dari_tanggal);
            }
            if ($request->has('sampai_tanggal')) {
                $query->whereDate('tanggal_upload', '<=', $request->sampai_tanggal);
            }

            // Pagination
            $perPage = $request->get('per_page', 10);
            $data = $query->orderBy('create_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get PPID dokumen by ID
     */
    public function show($id)
    {
        try {
            $dokumen = PpidDokumen::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $dokumen
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dokumen tidak ditemukan'
            ], 404);
        }
    }

    /**
     * Get dokumen by kategori
     */
    public function byKategori($kategori, Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $data = PpidDokumen::where('kategori', $kategori)
                ->orderBy('create_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'kategori' => $kategori,
                'nama_kategori' => PpidDokumen::getKategoriOptions()[$kategori] ?? $kategori,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dokumen by tahun
     */
    public function byTahun($tahun, Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $data = PpidDokumen::where('tahun', $tahun)
                ->orderBy('create_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'tahun' => $tahun,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get latest dokumen
     */
    public function latest($limit = 10)
    {
        try {
            $data = PpidDokumen::orderBy('create_at', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_dokumen' => PpidDokumen::count(),
                'total_hari_ini' => PpidDokumen::whereDate('tanggal_upload', today())->count(),
                'total_bulan_ini' => PpidDokumen::whereMonth('tanggal_upload', now()->month)
                    ->whereYear('tanggal_upload', now()->year)
                    ->count(),
                'total_tahun_ini' => PpidDokumen::whereYear('tanggal_upload', now()->year)->count(),
                'by_kategori' => PpidDokumen::selectRaw('kategori, COUNT(*) as total')
                    ->groupBy('kategori')
                    ->get()
                    ->map(function ($item) {
                        return [
                            'kategori' => $item->kategori,
                            'nama_kategori' => PpidDokumen::getKategoriOptions()[$item->kategori] ?? $item->kategori,
                            'total' => $item->total
                        ];
                    }),
                'by_tahun' => PpidDokumen::selectRaw('tahun, COUNT(*) as total')
                    ->groupBy('tahun')
                    ->orderBy('tahun', 'desc')
                    ->get(),
                'by_uploader' => PpidDokumen::selectRaw('uploader, COUNT(*) as total')
                    ->groupBy('uploader')
                    ->orderBy('total', 'desc')
                    ->limit(10)
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get chart data by kategori
     */
    public function chartByKategori()
    {
        try {
            $data = PpidDokumen::selectRaw('kategori, COUNT(*) as total')
                ->groupBy('kategori')
                ->get()
                ->map(function ($item) {
                    $kategoriOptions = PpidDokumen::getKategoriOptions();
                    
                    // Assign colors based on kategori
                    $colors = [
                        PpidDokumen::KATEGORI_BERKALA => '#10B981',      // Green
                        PpidDokumen::KATEGORI_SERTAMERTA => '#F59E0B',   // Amber
                        PpidDokumen::KATEGORI_SETIAP_SAAT => '#3B82F6',  // Blue
                        PpidDokumen::KATEGORI_DIKECUALIKAN => '#EF4444', // Red
                    ];

                    return [
                        'kategori' => $item->kategori,
                        'nama_kategori' => $kategoriOptions[$item->kategori] ?? $item->kategori,
                        'total' => $item->total,
                        'color' => $colors[$item->kategori] ?? '#6B7280'
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get chart data by tahun
     */
    public function chartByTahun($limit = 5)
    {
        try {
            $data = PpidDokumen::selectRaw('tahun, COUNT(*) as total')
                ->groupBy('tahun')
                ->orderBy('tahun', 'desc')
                ->limit($limit)
                ->get()
                ->reverse()
                ->values();

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search dokumen
     */
    public function search(Request $request)
    {
        try {
            $search = $request->get('q', '');
            $perPage = $request->get('per_page', 10);

            if (empty($search)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kata kunci pencarian tidak boleh kosong'
                ], 400);
            }

            $data = PpidDokumen::where('judul_dokumen', 'like', '%' . $search . '%')
                ->orWhere('uploader', 'like', '%' . $search . '%')
                ->orderBy('create_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'keyword' => $search,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available categories
     */
    public function categories()
    {
        try {
            $categories = PpidDokumen::getKategoriOptions();

            $stats = [];
            foreach ($categories as $key => $value) {
                $stats[] = [
                    'key' => $key,
                    'label' => $value,
                    'total' => PpidDokumen::where('kategori', $key)->count()
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available years
     */
    public function years()
    {
        try {
            $years = PpidDokumen::selectRaw('DISTINCT tahun')
                ->orderBy('tahun', 'desc')
                ->pluck('tahun')
                ->map(function ($tahun) {
                    return [
                        'tahun' => $tahun,
                        'total' => PpidDokumen::where('tahun', $tahun)->count()
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $years
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download dokumen
     */
    public function download($id)
    {
        try {
            $dokumen = PpidDokumen::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $dokumen->id_dokumen,
                    'judul' => $dokumen->judul_dokumen,
                    'file_url' => $dokumen->file_url,
                    'download_url' => $dokumen->file_url
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dokumen tidak ditemukan'
            ], 404);
        }
    }

    /**
     * Get dokumen berkala
     */
    public function berkala(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $data = PpidDokumen::where('kategori', PpidDokumen::KATEGORI_BERKALA)
                ->orderBy('create_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'kategori' => 'Informasi Berkala',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dokumen serta merta
     */
    public function sertaMerta(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $data = PpidDokumen::where('kategori', PpidDokumen::KATEGORI_SERTAMERTA)
                ->orderBy('create_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'kategori' => 'Informasi Serta Merta',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dokumen setiap saat
     */
    public function setiapSaat(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $data = PpidDokumen::where('kategori', PpidDokumen::KATEGORI_SETIAP_SAAT)
                ->orderBy('create_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'kategori' => 'Informasi Setiap Saat',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}