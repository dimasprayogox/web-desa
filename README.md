# ⚙️ Web Desa Krebet — Backend API & Admin Panel

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-%3E%3D_8.2-777BB4?style=flat&logo=php&logoColor=white)](https://php.net)
[![Filament](https://img.shields.io/badge/Filament-v3.x-E0A82E?style=flat&logo=livewire&logoColor=white)](https://filamentphp.com)
[![Storage](https://img.shields.io/badge/Storage-Local_%7C_MinIO_%7C_S3-blue?style=flat)](https://min.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Branch repositori khusus **Backend service & Admin Panel** untuk Sistem Informasi Desa Krebet. Dibangun menggunakan **Laravel 12** dan **Filament PHP v3** untuk menyediakan RESTful API ke aplikasi frontend publik serta antarmuka administrasi desa terpusat.

---

## 🏛️ Arsitektur & Fitur Utama

- **⚡ Filament v3 CMS & Admin Panel:**
  - **Berita Desa**: Publikasi artikel, pengumuman, kategori, sampul media, dan status penerbitan.
  - **Katalog UMKM**: Registrasi profil usaha mikro desa, kategori usaha, kontak, dan galeri produk.
  - **Demografi Kependudukan**: Pengelolaan data penduduk per dusun, rentang umur, jenis kelamin, dan tahun data.
  - **Transparansi APBDes**: Pengelolaan laporan realisasi pos Pendapatan, Belanja, dan Pembiayaan desa.
  - **Validasi Otomatis**: Trait validasi data konsistensi demografi dan pencegahan duplikasi data.
- **🔌 RESTful Web API:**
  - Respon standar JSON untuk dikonsumsi langsung oleh client React JS frontend.
  - Optimasi query, caching data statistik, dan endpoint pencarian real-time.
  - Endpoint summary metrik kependudukan untuk widget hero section frontend.
- **🗄️ Media Storage Fleksibel:**
  - Multi-driver: Local storage, MinIO Object Storage, dan AWS S3 (`MediaStorageService.php`).
  - Command inisialisasi bucket otomatis: `php artisan storage:setup-minio`.

---

## 🛠️ Tech Stack & Dependensi

| Komponen | Paket / Teknologi | Fungsi |
|---|---|---|
| **Framework** | Laravel 12.x | Backend engine, routing, & Eloquent ORM |
| **Admin Panel** | Filament PHP v3 | Dashboard CMS backoffice |
| **Runtime** | PHP >= 8.2 | Server language runtime |
| **Database** | MySQL / SQLite / MariaDB | Database relasional |
| **Storage Driver** | League Flysystem S3 & MinIO | Driver manajemen file & media upload |
| **Auth** | Laravel Breeze & Filament Auth | Sistem otentikasi admin |
| **Testing & Lint** | PHPUnit 11 & Laravel Pint | Unit testing & code styling |

---

## 📁 Struktur Direktori (Branch Backend)

```text
.
├── app/
│   ├── Console/Commands/        # Command Artisan (SetupMinioStorage, dll)
│   ├── Filament/Resources/      # Definisi Resource Admin (Berita, UMKM, APBDes, dll)
│   ├── Http/Controllers/Api/    # REST API Controllers (Berita, UMKM, Demografi, APBDes)
│   ├── Models/                  # Eloquent Models & relasi database
│   ├── Providers/Filament/      # Provider konfigurasi Panel Admin
│   ├── Services/                # Service layer (MediaStorage, PopulationValidation)
│   └── Traits/                  # Trait validasi demografi & duplikasi
├── config/                      # Konfigurasi sistem (database, filesystems, media, auth)
├── database/
│   ├── factories/               # Model factories
│   ├── migrations/              # Skema tabel database
│   └── seeders/                 # Data seeder awal
├── desa_krebet.sql              # Database dump siap pakai (opsional)
├── routes/
│   ├── api.php                  # Endpoint RESTful API untuk frontend
│   ├── web.php                  # Rute panel admin Filament
│   └── auth.php                 # Rute autentikasi
├── storage/                     # File upload lokal, cache, log
└── composer.json                # Dependensi PHP Composer
```

---

## 🚀 Panduan Instalasi & Menjalankan Server

### 1. Prasyarat Sistem
- **PHP**: `>= 8.2` (ekstensi aktif: `pdo`, `mbstring`, `openssl`, `xml`, `ctype`, `curl`, `gd`/`imagick`)
- **Composer**: `v2.x`
- **Database**: MySQL `8.x` / MariaDB `10.x` atau SQLite `3.x`

### 2. Kloning Branch Backend
```bash
git clone -b backend https://github.com/username-anda/web-desa-krebet.git
cd web-desa-krebet
```

### 3. Pasang Dependensi
```bash
composer install
```

### 4. Konfigurasi Variabel Lingkungan (.env)
Salin template konfigurasi:
```bash
cp .env.example .env
```

Generate application key:
```bash
php artisan key:generate
```

Sesuaikan konfigurasi database pada `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=desa_krebet
DB_USERNAME=root
DB_PASSWORD=
```
*(Atau gunakan `DB_CONNECTION=sqlite` untuk development lokal cepat).*

Konfigurasi media storage driver:
```env
MEDIA_DISK_DRIVER=public
FILESYSTEM_DISK=public
```

### 5. Migrasi & Seeding Database
Jalankan migrasi tabel dan seeding data:
```bash
php artisan migrate --seed
```
*Atau import database dump yang tersedia:*
```bash
mysql -u root -p desa_krebet < desa_krebet.sql
```

Buat tautan storage publik:
```bash
php artisan storage:link
```

### 6. Buat Akun Administrator (Filament)
Buat user untuk login ke panel admin:
```bash
php artisan make:filament-user
```
Masukkan nama, email, dan password sesuai permintaan di terminal.

### 7. Jalankan Server
```bash
php artisan serve
```
- API Base URL: `http://127.0.0.1:8000/api`
- URL Admin Panel: `http://127.0.0.1:8000/admin` (atau `/` sesuai konfigurasi panel)

---

## 📡 Ringkasan Endpoint REST API

| Modul | Method | Endpoint | Deskripsi |
|---|---|---|---|
| **Berita** | `GET` | `/api/berita` | Daftar berita desa (paginasi & filter) |
| | `GET` | `/api/berita/slug/{slug}` | Detail berita berdasarkan slug |
| | `GET` | `/api/berita/terbaru/{limit?}` | Berita terbaru untuk widget frontend |
| | `GET` | `/api/berita/search?q={query}` | Pencarian berita real-time |
| **UMKM** | `GET` | `/api/umkm` | Katalog UMKM terdaftar |
| | `GET` | `/api/umkm/slug/{slug}` | Detail satu profil UMKM |
| | `GET` | `/api/umkm/featured` | Daftar UMKM unggulan desa |
| | `GET` | `/api/umkm/statistics/summary` | Rekapitulasi jumlah UMKM |
| **Demografi** | `GET` | `/api/demografi-detail/statistics/summary` | Ringkasan metrik statistik penduduk |
| | `GET` | `/api/demografi-detail/piramida` | Dataset piramida umur kependudukan |
| | `GET` | `/api/demografi-detail/by-dusun/{id}` | Data kependudukan per dusun |
| **APBDes** | `GET` | `/api/laporan-apbdes` | Laporan transparansi anggaran APBDes |
| | `GET` | `/api/detail-apbdes/by-laporan/{id}` | Detail rincian pendapatan & belanja |
| **Master** | `GET` | `/api/tahun-data` | Master referensi tahun data aktif |

---

## 🧪 Testing & Standardisasi Kode
Jalankan pengujian unit:
```bash
php artisan test
```

Format dan periksa gaya kode:
```bash
./vendor/bin/pint
```

---

## 📄 Lisensi
Didistribusikan di bawah lisensi **MIT**.
