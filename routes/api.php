<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BeritaController;
use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\TahunDataController;
use App\Http\Controllers\Api\DemografiDetailController;
use App\Http\Controllers\Api\DetailApbdesController;
use App\Http\Controllers\Api\LaporanApbdesController; // ✅ Import

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
| BERITA ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('berita')->name('api.berita.')->group(function () {
    // List berita
    Route::get('/', [BeritaController::class, 'index'])->name('index');

    // Detail berita
    Route::get('/{id}', [BeritaController::class, 'show'])->name('show');
    Route::get('/slug/{slug}', [BeritaController::class, 'getBySlug'])->name('slug');

    // ❌ HAPUS route increment view
    // Route::post('/{id}/view', [BeritaController::class, 'incrementView'])->name('view');

    // Filter & Search
    Route::get('/kategori/{kategori}', [BeritaController::class, 'kategori'])->name('kategori');
    Route::get('/arsip/{tahun}/{bulan?}', [BeritaController::class, 'arsip'])->name('arsip');
    Route::get('/search', [BeritaController::class, 'searchAjax'])->name('search');

    // Widgets
    Route::get('/terbaru/{limit?}', [BeritaController::class, 'terbaru'])->name('terbaru');
    Route::get('/populer/{limit?}', [BeritaController::class, 'populer'])->name('populer');
    Route::get('/widget', [BeritaController::class, 'widget'])->name('widget');
});

/*
|--------------------------------------------------------------------------
| UMKM ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('umkm')->name('api.umkm.')->group(function () {
    Route::get('/', [UmkmController::class, 'index'])->name('index');
    Route::get('/slug/{slug}', [UmkmController::class, 'getBySlug'])->name('slug');
    Route::get('/{id}', [UmkmController::class, 'show'])->name('show');
    Route::get('/by-kategori/{kategori_id}', [UmkmController::class, 'byKategori'])->name('by-kategori');
    Route::get('/featured', [UmkmController::class, 'featured'])->name('featured');
    Route::get('/statistics/summary', [UmkmController::class, 'summary'])->name('summary');
    Route::get('/search', [UmkmController::class, 'search'])->name('search');
});

/*
|--------------------------------------------------------------------------
| TAHUN DATA ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('tahun-data')->name('api.tahun-data.')->group(function () {
    Route::get('/', [TahunDataController::class, 'index'])->name('index');
    Route::get('/{tahun}', [TahunDataController::class, 'show'])->name('show');
});

/*
|--------------------------------------------------------------------------
| ✅ DEMOGRAFI DETAIL ROUTES (Sesuai dengan DemografiDetailController)
|--------------------------------------------------------------------------
*/
Route::prefix('demografi-detail')->name('api.demografi-detail.')->group(function () {
    // List & detail
    Route::get('/', [DemografiDetailController::class, 'index'])->name('index');
    Route::get('/{id}', [DemografiDetailController::class, 'show'])->name('show');

    // Statistics & Summary
    Route::get('/statistics/summary', [DemografiDetailController::class, 'summary'])->name('summary');
    Route::get('/piramida', [DemografiDetailController::class, 'piramida'])->name('piramida');

    // Filter by dusun & tahun
    Route::get('/by-dusun/{dusun_id}', [DemografiDetailController::class, 'byDusun'])->name('by-dusun');
    Route::get('/by-tahun/{tahun}', [DemografiDetailController::class, 'byTahun'])->name('by-tahun');
});

/*
|--------------------------------------------------------------------------
| ✅ DETAIL APBDES ROUTES (Sesuai dengan DetailApbdesController)
|--------------------------------------------------------------------------
*/
Route::prefix('detail-apbdes')->name('api.detail-apbdes.')->group(function () {
    // Filter routes (harus di atas /{id})
    Route::get('/by-laporan/{laporan_id}', [DetailApbdesController::class, 'byLaporan'])->name('by-laporan');
    Route::get('/by-tipe/{tipe}', [DetailApbdesController::class, 'byTipe'])->name('by-tipe');

    // List & Detail
    Route::get('/', [DetailApbdesController::class, 'index'])->name('index');
    Route::get('/{id}', [DetailApbdesController::class, 'show'])->name('show');
});

/*
|--------------------------------------------------------------------------
| ✅ LAPORAN APBDES ROUTES (TAMBAHKAN INI)
|--------------------------------------------------------------------------
*/
Route::prefix('laporan-apbdes')->name('api.laporan-apbdes.')->group(function () {
    // Statistics & Summary (harus di atas /{id})
    Route::get('/statistics/summary', [LaporanApbdesController::class, 'summary'])->name('summary');
    Route::get('/by-tahun/{tahun}', [LaporanApbdesController::class, 'byTahun'])->name('by-tahun');

    // List & Detail
    Route::get('/', [LaporanApbdesController::class, 'index'])->name('index');
    Route::get('/{id}', [LaporanApbdesController::class, 'show'])->name('show');
});
