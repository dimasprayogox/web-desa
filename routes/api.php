<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TahunDataController;
use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\KategoriUmkmController;
use App\Http\Controllers\Api\BeritaController;
use App\Http\Controllers\Api\StrukturOrganisasiController;
use App\Http\Controllers\Api\DemografiDetailController;
use App\Http\Controllers\Api\PpidDokumenController;
use App\Http\Controllers\Api\LaporanApbdesController;
use App\Http\Controllers\Api\DetailApbdesController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| TAHUN DATA API ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('tahun-data')->name('api.tahun.')->group(function () {
    Route::get('/', [TahunDataController::class, 'index'])->name('index');
    Route::get('/available-years', [TahunDataController::class, 'availableYears'])->name('years');
    Route::get('/{tahun}', [TahunDataController::class, 'show'])->name('show');
});

// User authentication route (default Laravel)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Demografi Detail API Routes
Route::prefix('demografi-detail')->group(function () {

    // Public routes (tanpa auth)
    Route::get('/', [DemografiDetailController::class, 'index']);
    Route::get('/statistics/summary', [DemografiDetailController::class, 'summary']);
    Route::get('/by-dusun/{dusun_id}', [DemografiDetailController::class, 'byDusun']);
    Route::get('/by-tahun/{tahun}', [DemografiDetailController::class, 'byTahun']);
    Route::get('/piramida', [DemografiDetailController::class, 'piramida']);
    Route::get('/{id}', [DemografiDetailController::class, 'show']);

    // Protected routes (dengan auth) - uncomment jika perlu
    // Route::middleware('auth:sanctum')->group(function () {
    //     Route::post('/', [DemografiDetailController::class, 'store']);
    //     Route::put('/{id}', [DemografiDetailController::class, 'update']);
    //     Route::delete('/{id}', [DemografiDetailController::class, 'destroy']);
    // });
});

// ==================== LAPORAN APBDES API ====================
Route::prefix('laporan-apbdes')->group(function () {
    Route::get('/', [LaporanApbdesController::class, 'index']);
    Route::get('/statistics/summary', [LaporanApbdesController::class, 'summary']);
    Route::get('/by-tahun/{tahun}', [LaporanApbdesController::class, 'byTahun']);
    Route::get('/{id}', [LaporanApbdesController::class, 'show']);
});

// ==================== DETAIL APBDES API ====================
Route::prefix('detail-apbdes')->group(function () {
    Route::get('/', [DetailApbdesController::class, 'index']);
    Route::get('/by-laporan/{laporan_id}', [DetailApbdesController::class, 'byLaporan']);
    Route::get('/by-tipe/{tipe}', [DetailApbdesController::class, 'byTipe']);
    Route::get('/{id}', [DetailApbdesController::class, 'show']);
});

// ==================== UMKM API ====================
Route::prefix('umkm')->group(function () {
    Route::get('/', [UmkmController::class, 'index']);
    Route::get('/statistics/summary', [UmkmController::class, 'summary']);
    Route::get('/featured', [UmkmController::class, 'featured']);
    Route::get('/search', [UmkmController::class, 'search']);
    Route::get('/by-kategori/{kategori_id}', [UmkmController::class, 'byKategori']);
    Route::get('/by-dusun/{dusun}', [UmkmController::class, 'byDusun']);
    Route::get('/{id}', [UmkmController::class, 'show']);
});

// ==================== KATEGORI UMKM API ====================
Route::prefix('kategori-umkm')->group(function () {
    Route::get('/', [KategoriUmkmController::class, 'index']);
    Route::get('/{id}', [KategoriUmkmController::class, 'show']);
});

// ==================== BERITA API ====================
Route::prefix('berita')->group(function () {
    Route::get('/', [BeritaController::class, 'index']);
    Route::get('/statistics/summary', [BeritaController::class, 'summary']);
    Route::get('/latest', [BeritaController::class, 'latest']);
    Route::get('/popular', [BeritaController::class, 'popular']);
    Route::get('/search', [BeritaController::class, 'search']);
    Route::get('/kategori', [BeritaController::class, 'kategori']);
    Route::get('/by-kategori/{kategori}', [BeritaController::class, 'byKategori']);
    Route::get('/{id}/related', [BeritaController::class, 'related']);
    Route::get('/{identifier}', [BeritaController::class, 'show']); // ID or slug
});
/*
|--------------------------------------------------------------------------
| STRUKTUR ORGANISASI API ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('struktur-organisasi')->name('api.struktur.')->group(function () {
    // Statistics & Info
    Route::get('/statistics', [StrukturOrganisasiController::class, 'statistics'])->name('statistics');

    // Special Endpoints
    Route::get('/kepala-desa', [StrukturOrganisasiController::class, 'kepalaDesa'])->name('kepala-desa');
    Route::get('/perangkat-desa', [StrukturOrganisasiController::class, 'perangkatDesa'])->name('perangkat');
    Route::get('/bpd', [StrukturOrganisasiController::class, 'bpd'])->name('bpd');
    Route::get('/hierarchy', [StrukturOrganisasiController::class, 'hierarchy'])->name('hierarchy');
    Route::get('/chart', [StrukturOrganisasiController::class, 'chart'])->name('chart');
    Route::get('/kontak', [StrukturOrganisasiController::class, 'kontak'])->name('kontak');

    // Search
    Route::get('/search', [StrukturOrganisasiController::class, 'search'])->name('search');

    // By Jabatan
    Route::get('/jabatan/{jabatan}', [StrukturOrganisasiController::class, 'byJabatan'])->name('jabatan');

    // List & Detail (taruh paling bawah)
    Route::get('/', [StrukturOrganisasiController::class, 'index'])->name('index');
    Route::get('/{id}', [StrukturOrganisasiController::class, 'show'])->name('show');
});

/*
|--------------------------------------------------------------------------
| PPID DOKUMEN API ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('ppid-dokumen')->name('api.ppid.')->group(function () {
    // Statistics & Info
    Route::get('/statistics', [PpidDokumenController::class, 'statistics'])->name('statistics');
    Route::get('/categories', [PpidDokumenController::class, 'categories'])->name('categories');
    Route::get('/years', [PpidDokumenController::class, 'years'])->name('years');

    // Charts
    Route::get('/chart/kategori', [PpidDokumenController::class, 'chartByKategori'])->name('chart.kategori');
    Route::get('/chart/tahun/{limit?}', [PpidDokumenController::class, 'chartByTahun'])->name('chart.tahun');

    // Latest
    Route::get('/latest/{limit?}', [PpidDokumenController::class, 'latest'])->name('latest');

    // By Kategori Khusus
    Route::get('/berkala', [PpidDokumenController::class, 'berkala'])->name('berkala');
    Route::get('/serta-merta', [PpidDokumenController::class, 'sertaMerta'])->name('serta-merta');
    Route::get('/setiap-saat', [PpidDokumenController::class, 'setiapSaat'])->name('setiap-saat');

    // Search & Filter
    Route::get('/search', [PpidDokumenController::class, 'search'])->name('search');
    Route::get('/kategori/{kategori}', [PpidDokumenController::class, 'byKategori'])->name('kategori');
    Route::get('/tahun/{tahun}', [PpidDokumenController::class, 'byTahun'])->name('tahun');

    // Download
    Route::get('/{id}/download', [PpidDokumenController::class, 'download'])->name('download');

    // List & Detail (taruh paling bawah)
    Route::get('/', [PpidDokumenController::class, 'index'])->name('index');
    Route::get('/{id}', [PpidDokumenController::class, 'show'])->name('show');
});
