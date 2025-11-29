<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\Request;

class StrukturOrganisasiController extends Controller
{
    /**
     * Get all struktur organisasi
     */
    public function index(Request $request)
    {
        try {
            $query = StrukturOrganisasi::query();

            // Search by nama or jabatan
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', '%' . $search . '%')
                        ->orWhere('jabatan', 'like', '%' . $search . '%');
                });
            }

            // Filter by jabatan
            if ($request->has('jabatan')) {
                $query->where('jabatan', 'like', '%' . $request->jabatan . '%');
            }

            // Filter yang punya foto
            if ($request->has('has_photo') && $request->has_photo) {
                $query->whereNotNull('foto_url');
            }

            $data = $query->orderBy('id_struktur', 'asc')->get();

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
     * Get struktur organisasi by ID
     */
    public function show($id)
    {
        try {
            $struktur = StrukturOrganisasi::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $struktur
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Struktur organisasi tidak ditemukan'
            ], 404);
        }
    }

    /**
     * Get struktur organisasi by jabatan
     */
    public function byJabatan($jabatan)
    {
        try {
            $data = StrukturOrganisasi::where('jabatan', 'like', '%' . $jabatan . '%')
                ->orderBy('id_struktur', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'jabatan' => $jabatan,
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
     * Get hierarchical structure
     */
    public function hierarchy()
    {
        try {
            // Definisi urutan hierarki
            $hierarchy = [
                'Kepala Desa',
                'Sekretaris Desa',
                'Kaur Tata Usaha dan Umum',
                'Kaur Keuangan',
                'Kaur Perencanaan',
                'Kasi Pemerintahan',
                'Kasi Kesejahteraan',
                'Kasi Pelayanan',
                'Kepala Dusun',
            ];

            $result = [];
            foreach ($hierarchy as $position) {
                $members = StrukturOrganisasi::where('jabatan', 'like', '%' . $position . '%')
                    ->orderBy('id_struktur', 'asc')
                    ->get();

                if ($members->isNotEmpty()) {
                    $result[] = [
                        'jabatan' => $position,
                        'members' => $members
                    ];
                }
            }

            // Tambahkan jabatan lain yang tidak masuk kategori di atas
            $otherPositions = StrukturOrganisasi::whereNotIn('jabatan', $hierarchy)
                ->orderBy('id_struktur', 'asc')
                ->get();

            if ($otherPositions->isNotEmpty()) {
                // Group by jabatan
                $grouped = $otherPositions->groupBy('jabatan');
                foreach ($grouped as $jabatan => $members) {
                    $result[] = [
                        'jabatan' => $jabatan,
                        'members' => $members
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get kontak information
     */
    public function kontak()
    {
        try {
            $data = StrukturOrganisasi::whereNotNull('keterangan')
                ->orWhereNotNull('foto_url')
                ->orderBy('id_struktur', 'asc')
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
                'total_anggota' => StrukturOrganisasi::count(),
                'punya_foto' => StrukturOrganisasi::whereNotNull('foto_url')->count(),
                'tanpa_foto' => StrukturOrganisasi::whereNull('foto_url')->count(),
                'punya_keterangan' => StrukturOrganisasi::whereNotNull('keterangan')->count(),
                'by_jabatan' => StrukturOrganisasi::selectRaw('jabatan, COUNT(*) as total')
                    ->groupBy('jabatan')
                    ->orderBy('total', 'desc')
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
     * Get kepala desa
     */
    public function kepalaDesa()
    {
        try {
            $kepalaDesa = StrukturOrganisasi::where('jabatan', 'like', '%Kepala Desa%')
                ->first();

            if (!$kepalaDesa) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data Kepala Desa tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $kepalaDesa
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get perangkat desa (exclude kepala desa)
     */
    public function perangkatDesa()
    {
        try {
            $data = StrukturOrganisasi::where('jabatan', 'not like', '%Kepala Desa%')
                ->orderBy('id_struktur', 'asc')
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
     * Get BPD (Badan Permusyawaratan Desa) if exists
     */
    public function bpd()
    {
        try {
            $data = StrukturOrganisasi::where('jabatan', 'like', '%BPD%')
                ->orWhere('jabatan', 'like', '%Badan Permusyawaratan%')
                ->orderBy('id_struktur', 'asc')
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
     * Get organization chart data
     */
    public function chart()
    {
        try {
            $kepalaDesa = StrukturOrganisasi::where('jabatan', 'like', '%Kepala Desa%')->first();
            
            $sekretaris = StrukturOrganisasi::where('jabatan', 'like', '%Sekretaris%')->get();
            
            $kaur = StrukturOrganisasi::where('jabatan', 'like', '%Kaur%')->get();
            
            $kasi = StrukturOrganisasi::where('jabatan', 'like', '%Kasi%')->get();
            
            $kepalaDusun = StrukturOrganisasi::where('jabatan', 'like', '%Kepala Dusun%')
                ->orWhere('jabatan', 'like', '%Kadus%')
                ->get();

            $chart = [
                'kepala_desa' => $kepalaDesa,
                'sekretaris' => $sekretaris,
                'kaur' => $kaur,
                'kasi' => $kasi,
                'kepala_dusun' => $kepalaDusun,
            ];

            return response()->json([
                'success' => true,
                'data' => $chart
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search struktur organisasi
     */
    public function search(Request $request)
    {
        try {
            $search = $request->get('q', '');

            if (empty($search)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kata kunci pencarian tidak boleh kosong'
                ], 400);
            }

            $data = StrukturOrganisasi::where('nama', 'like', '%' . $search . '%')
                ->orWhere('jabatan', 'like', '%' . $search . '%')
                ->orWhere('keterangan', 'like', '%' . $search . '%')
                ->orderBy('id_struktur', 'asc')
                ->get();

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
}