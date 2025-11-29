<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\UmkmController;
use App\Http\Controllers\api\BeritaController;
use App\Http\Controllers\api\StrukturOrganisasiController;
use App\Http\Controllers\api\DemografiPendudukController;
use App\Http\Controllers\api\PpidDokumenController;


/*
|--------------------------------------------------------------------------
| Web Routes - Frontend Public Website Desa
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| BERITA ROUTES - Berita dan Informasi Desa
|--------------------------------------------------------------------------
*/

Route::prefix('berita')->name('berita.')->group(function () {
    Route::get('/', [BeritaController::class, 'index'])->name('index');
    Route::get('/kategori/{kategori}', [BeritaController::class, 'kategori'])->name('kategori');
    Route::get('/arsip/{tahun}/{bulan?}', [BeritaController::class, 'arsip'])->name('arsip');
    Route::get('/{id}', [BeritaController::class, 'show'])->name('show');
});

// Berita API Routes
Route::prefix('api/berita')->name('api.berita.')->group(function () {
    Route::get('/terbaru/{limit?}', [BeritaController::class, 'terbaru'])->name('terbaru');
    Route::get('/populer/{limit?}', [BeritaController::class, 'populer'])->name('populer');
    Route::get('/search', [BeritaController::class, 'searchAjax'])->name('search');
    Route::get('/widget', [BeritaController::class, 'widget'])->name('widget');
});

/*
|--------------------------------------------------------------------------
| STRUKTUR ORGANISASI ROUTES - Pemerintahan Desa
|--------------------------------------------------------------------------
*/
Route::prefix('struktur-organisasi')->name('struktur.')->group(function () {
    Route::get('/', [StrukturOrganisasiController::class, 'index'])->name('index');
    Route::get('/divisi/{divisi}', [StrukturOrganisasiController::class, 'divisi'])->name('divisi');
    Route::get('/search', [StrukturOrganisasiController::class, 'search'])->name('search');
    Route::get('/{id}', [StrukturOrganisasiController::class, 'show'])->name('show');
});

// Struktur Organisasi API Routes
Route::prefix('api/struktur-organisasi')->name('api.struktur.')->group(function () {
    Route::get('/widget', [StrukturOrganisasiController::class, 'widget'])->name('widget');
    Route::get('/bagan', [StrukturOrganisasiController::class, 'bagan'])->name('bagan');
    Route::get('/kontak', [StrukturOrganisasiController::class, 'kontak'])->name('kontak');
});

/*
|--------------------------------------------------------------------------
| DEMOGRAFI & STATISTIK ROUTES - Data Kependudukan
|--------------------------------------------------------------------------
*/
Route::prefix('demografi')->name('demografi.')->group(function () {
    Route::get('/', [DemografiPendudukCOntroller::class, 'index'])->name('index');
    Route::get('/umum', [DemografiPendudukCOntroller::class, 'umum'])->name('umum');
    Route::get('/umur', [DemografiPendudukCOntroller::class, 'umur'])->name('umur');
    Route::get('/agama', [DemografiPendudukCOntroller::class, 'agama'])->name('agama');
    Route::get('/pekerjaan', [DemografiPendudukCOntroller::class, 'pekerjaan'])->name('pekerjaan');
    Route::get('/pendidikan', [DemografiPendudukCOntroller::class, 'pendidikan'])->name('pendidikan');
    Route::get('/perbandingan', [DemografiPendudukCOntroller::class, 'perbandingan'])->name('perbandingan');
});

// Demografi API Routes
Route::prefix('api/demografi')->name('api.demografi.')->group(function () {
    Route::get('/widget', [DemografiPendudukCOntroller::class, 'widget'])->name('widget');
    Route::get('/chart/{type}', [DemografiPendudukCOntroller::class, 'chart'])->name('chart');
});

/*
|--------------------------------------------------------------------------
| PPID ROUTES - Layanan Informasi Publik
|--------------------------------------------------------------------------
*/
Route::prefix('ppid')->name('ppid.')->group(function () {
    Route::get('/', [PpidDokumenController::class, 'index'])->name('index');
    Route::get('/jenis/{jenis}', [PpidDokumenController::class, 'jenis'])->name('jenis');
    Route::get('/kategori/{kategori}', [PpidDokumenController::class, 'kategori'])->name('kategori');
    Route::get('/arsip/{tahun}', [PpidDokumenController::class, 'arsip'])->name('arsip');
    Route::get('/download/{id}', [PpidDokumenController::class, 'download'])->name('download');
    Route::get('/{id}', [PpidDokumenController::class, 'show'])->name('show');
});

// PPID API Routes
Route::prefix('api/ppid')->name('api.ppid.')->group(function () {
    Route::get('/search', [PpidDokumenController::class, 'searchAjax'])->name('search');
    Route::get('/widget', [PpidDokumenController::class, 'widget'])->name('widget');
    Route::get('/statistik', [PpidDokumenController::class, 'statistik'])->name('statistik');
});



/*
|--------------------------------------------------------------------------
| UMKM ROUTES - Usaha Mikro Kecil Menengah
|--------------------------------------------------------------------------
*/
Route::prefix('umkm')->name('umkm.')->group(function () {
    Route::get('/', [UmkmController::class, 'index'])->name('index');
    Route::get('/kategori/{kategori:slug}', [UmkmController::class, 'kategori'])->name('kategori');
    Route::get('/search-ajax', [UmkmController::class, 'searchAjax'])->name('search.ajax');
    Route::get('/{umkm:slug}', [UmkmController::class, 'show'])->name('show');
});



Route::prefix('api/dusun-statistik')->name('api.dusun.')->group(function () {
    Route::get('/', [App\Http\Controllers\Api\DusunStatistikController::class, 'index'])->name('index');
    Route::get('/tahun-list', [App\Http\Controllers\Api\DusunStatistikController::class, 'tahunList'])->name('tahun-list');
    Route::get('/tahun/{tahun}', [App\Http\Controllers\Api\DusunStatistikController::class, 'byTahun'])->name('by-tahun');
    Route::get('/widget', [App\Http\Controllers\Api\DusunStatistikController::class, 'widget'])->name('widget');
    Route::get('/chart/{tahun?}', [App\Http\Controllers\Api\DusunStatistikController::class, 'chartData'])->name('chart');
    Route::get('/{namaDusun}/{tahun?}', [App\Http\Controllers\Api\DusunStatistikController::class, 'show'])->name('show');
});
