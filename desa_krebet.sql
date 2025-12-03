-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 29, 2025 at 03:02 PM
-- Server version: 8.0.30
-- PHP Version: 8.3.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `desa_krebet`
--

-- --------------------------------------------------------

--
-- Table structure for table `berita`
--

CREATE TABLE `berita` (
  `id` int NOT NULL,
  `judul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isi` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `gambar_url` varchar(225) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kategori` enum('umum','pengumuman','kegiatan') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `berita`
--

INSERT INTO `berita` (`id`, `judul`, `isi`, `gambar_url`, `kategori`, `created_at`, `updated_at`) VALUES
(2, 'judul berita ahkjadfkaj', '<p>u gjbm</p>', 'berita/images/1763657229_download.png', 'pengumuman', '2025-11-20 09:47:09', '2025-11-20 09:47:09'),
(3, 'Sosialisasi Media Pembelajaran Digital', '<p><strong>Lorem ipsum dolor sit amet</strong>, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<em> Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</em></p>', 'berita/images/1764393119_download.jpg', 'kegiatan', '2025-11-28 22:11:59', '2025-11-28 22:11:59'),
(4, 'Sosialisasi Galponik', '<p><strong>Sed ut perspiciatis unde omnis iste natus</strong> error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. <em>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehen</em></p>', 'berita/images/1764393262_Gemini_Generated_Image_eehl8zeehl8zeehl.png', 'kegiatan', '2025-11-28 22:14:22', '2025-11-28 22:14:22'),
(5, 'GATI \"Ayah Teladan Indonesia\"', '<p><strong>But I must explain to you how all this mistaken idea</strong> of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But <em>who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?\"</em></p>', 'berita/images/1764393445_WhatsApp_Image_2025-11-15_at_09.11.24_69c1c169.jpg', 'kegiatan', '2025-11-28 22:17:25', '2025-11-28 22:17:25'),
(6, 'Pengambilan bansos', '<p><strong>At vero eos et accusamus et iusto odio dignissimos ducimus</strong> qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. <em>Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.\"</em></p>', 'berita/images/1764393547_WhatsApp_Image_2025-11-15_at_09.11.22_2b4689fa.jpg', 'pengumuman', '2025-11-28 22:19:07', '2025-11-28 22:19:07');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel_cache_356a192b7913b04c54574d18c28d46e6395428ab', 'i:1;', 1764394590),
('laravel_cache_356a192b7913b04c54574d18c28d46e6395428ab:timer', 'i:1764394590;', 1764394590),
('laravel_cache_livewire-rate-limiter:a17961fa74e9275d529f489537f179c05d50c2f3', 'i:1;', 1764427995),
('laravel_cache_livewire-rate-limiter:a17961fa74e9275d529f489537f179c05d50c2f3:timer', 'i:1764427995;', 1764427995);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `demografi_detail`
--

CREATE TABLE `demografi_detail` (
  `id` bigint UNSIGNED NOT NULL,
  `demografi_dusun_id` bigint UNSIGNED NOT NULL,
  `wilayah` json DEFAULT NULL,
  `usia` json DEFAULT NULL,
  `agama` json DEFAULT NULL,
  `pekerjaan` json DEFAULT NULL,
  `pendidikan` json DEFAULT NULL,
  `perkawinan` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `demografi_detail`
--

INSERT INTO `demografi_detail` (`id`, `demografi_dusun_id`, `wilayah`, `usia`, `agama`, `pekerjaan`, `pendidikan`, `perkawinan`, `created_at`, `updated_at`) VALUES
(1, 1, '{\"kk\": \"20\", \"rt\": \"6\"}', '{\"0_5\": {\"l\": \"10\", \"p\": \"10\"}, \"6_12\": {\"l\": \"10\", \"p\": \"10\"}, \"13_17\": {\"l\": \"10\", \"p\": \"9\"}, \"18_40\": {\"l\": \"10\", \"p\": \"10\"}, \"41_plus\": {\"l\": \"11\", \"p\": \"10\"}}', '{\"hindu\": \"10\", \"islam\": \"60\", \"buddha\": \"9\", \"katolik\": \"8\", \"kristen\": \"10\", \"lainnya\": \"12\", \"konghucu\": \"10\"}', '{\"petani\": \"10\", \"lainnya\": \"12\", \"karyawan\": \"9\", \"buruh_tani\": \"9\", \"wiraswasta\": \"10\", \"belum_bekerja\": \"88\", \"pns_tni_polri\": \"9\", \"ibu_rumah_tangga\": \"10\", \"pelajar_mahasiswa\": \"10\"}', '{\"s2\": \"3\", \"s3\": \"-2\", \"diploma\": \"10\", \"sarjana\": \"9\", \"sd_sederajat\": \"9\", \"belum_sekolah\": \"10\", \"sma_sederajat\": \"99\", \"smp_sederajat\": \"9\", \"tidak_tamat_sd\": \"10\"}', '{\"kawin\": \"28\", \"cerai_mati\": \"0\", \"belum_kawin\": \"90\", \"cerai_hidup\": \"3\"}', '2025-11-23 19:55:25', '2025-11-23 19:55:25'),
(2, 2, '{\"kk\": \"189\", \"rt\": \"6\"}', '{\"0_5\": {\"l\": \"27\", \"p\": \"29\"}, \"6_12\": {\"l\": \"40\", \"p\": \"34\"}, \"13_17\": {\"l\": \"12\", \"p\": \"35\"}, \"18_40\": {\"l\": \"106\", \"p\": \"37\"}, \"41_plus\": {\"l\": \"30\", \"p\": \"10\"}}', '{\"hindu\": 0, \"islam\": \"175\", \"buddha\": 0, \"katolik\": \"-1\", \"kristen\": \"3\", \"lainnya\": 0, \"konghucu\": 0}', '{\"petani\": \"107\", \"lainnya\": 0, \"karyawan\": \"8\", \"buruh_tani\": \"45\", \"wiraswasta\": \"12\", \"belum_bekerja\": \"21\", \"pns_tni_polri\": \"9\", \"ibu_rumah_tangga\": \"34\", \"pelajar_mahasiswa\": \"56\"}', '{\"s2\": \"-1\", \"s3\": 0, \"diploma\": \"8\", \"sarjana\": \"8\", \"sd_sederajat\": \"85\", \"belum_sekolah\": \"30\", \"sma_sederajat\": \"25\", \"smp_sederajat\": \"37\", \"tidak_tamat_sd\": \"11\"}', '{\"kawin\": \"207\", \"cerai_mati\": \"26\", \"belum_kawin\": \"87\", \"cerai_hidup\": \"24\"}', '2025-11-28 22:22:14', '2025-11-28 22:25:32'),
(3, 3, '{\"kk\": \"306\", \"rt\": \"7\"}', '{\"0_5\": {\"l\": \"21\", \"p\": \"27\"}, \"6_12\": {\"l\": \"28\", \"p\": \"30\"}, \"13_17\": {\"l\": \"27\", \"p\": \"21\"}, \"18_40\": {\"l\": \"56\", \"p\": \"85\"}, \"41_plus\": {\"l\": \"39\", \"p\": \"23\"}}', '{\"hindu\": \"3\", \"islam\": \"287\", \"buddha\": 0, \"katolik\": 0, \"kristen\": \"10\", \"lainnya\": 0, \"konghucu\": 0}', '{\"petani\": \"54\", \"lainnya\": 0, \"karyawan\": \"7\", \"buruh_tani\": \"37\", \"wiraswasta\": \"18\", \"belum_bekerja\": \"59\", \"pns_tni_polri\": \"8\", \"ibu_rumah_tangga\": \"40\", \"pelajar_mahasiswa\": \"101\"}', '{\"s2\": 0, \"s3\": 0, \"diploma\": \"8\", \"sarjana\": \"6\", \"sd_sederajat\": \"88\", \"belum_sekolah\": \"56\", \"sma_sederajat\": \"19\", \"smp_sederajat\": \"26\", \"tidak_tamat_sd\": \"11\"}', '{\"kawin\": \"106\", \"cerai_mati\": \"8\", \"belum_kawin\": \"65\", \"cerai_hidup\": \"17\"}', '2025-11-28 22:30:56', '2025-11-28 22:30:56');

-- --------------------------------------------------------

--
-- Table structure for table `demografi_dusun`
--

CREATE TABLE `demografi_dusun` (
  `id_dusun` bigint UNSIGNED NOT NULL,
  `tahun_id` bigint UNSIGNED NOT NULL,
  `nama_dusun` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `demografi_dusun`
--

INSERT INTO `demografi_dusun` (`id_dusun`, `tahun_id`, `nama_dusun`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, 1, 'dusun 1', 'ksjvja', '2025-11-23 19:47:29', '2025-11-23 19:47:29'),
(2, 1, 'dusun 2', 'dusun 2', '2025-11-23 19:47:51', '2025-11-23 19:47:51'),
(3, 1, 'Dusun 3', 'maju tak gentar', '2025-11-28 22:20:04', '2025-11-28 22:20:04');

-- --------------------------------------------------------

--
-- Table structure for table `detail_apbdes`
--

CREATE TABLE `detail_apbdes` (
  `id` bigint UNSIGNED NOT NULL,
  `laporan_apbdes_id` bigint UNSIGNED NOT NULL,
  `tipe` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uraian` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `anggaran` decimal(15,2) NOT NULL DEFAULT '0.00',
  `realisasi` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `detail_apbdes`
--

INSERT INTO `detail_apbdes` (`id`, `laporan_apbdes_id`, `tipe`, `uraian`, `anggaran`, `realisasi`, `created_at`, `updated_at`) VALUES
(1, 1, 'pendapatan', 'hasil usaha desa (bumdes)', '10000000.00', '9000000.00', '2025-11-23 20:31:22', '2025-11-23 20:31:22'),
(2, 2, 'pendapatan', 'pendapatan fadjlhu', '10000000.00', '10000000.00', '2025-11-28 20:41:14', '2025-11-28 20:41:14'),
(3, 1, 'belanja', 'pembangunan masjid', '300000000.00', '298700000.00', '2025-11-28 22:42:15', '2025-11-28 22:42:15'),
(4, 1, 'belanja', 'membeli gorong-gorong', '34000000.00', '33989000.00', '2025-11-28 22:42:15', '2025-11-28 22:42:15'),
(5, 1, 'pendapatan', 'hasil usaha', '32000000.00', '32000000.00', '2025-11-28 22:42:15', '2025-11-28 22:42:15'),
(6, 2, 'pendapatan', 'dana daerah', '2000000000000.00', '2000000000000.00', '2025-11-28 22:45:17', '2025-11-28 22:47:26'),
(7, 2, 'pembiayaan', 'galponik', '10000000.00', '10000000.00', '2025-11-28 22:45:17', '2025-11-28 22:45:17'),
(8, 2, 'belanja', 'galon', '5000000.00', '5000000.00', '2025-11-28 22:45:17', '2025-11-28 22:45:17');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_umkm`
--

CREATE TABLE `kategori_umkm` (
  `id` bigint UNSIGNED NOT NULL,
  `nama_kategori` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kategori_umkm`
--

INSERT INTO `kategori_umkm` (`id`, `nama_kategori`, `deskripsi`, `created_at`, `updated_at`) VALUES
(1, 'n', 'khi', '2025-11-20 09:48:02', '2025-11-20 09:48:02');

-- --------------------------------------------------------

--
-- Table structure for table `laporan_apbdes`
--

CREATE TABLE `laporan_apbdes` (
  `id` bigint UNSIGNED NOT NULL,
  `tahun_id` bigint UNSIGNED NOT NULL,
  `nama_laporan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bulan_rilis` int NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `laporan_apbdes`
--

INSERT INTO `laporan_apbdes` (`id`, `tahun_id`, `nama_laporan`, `bulan_rilis`, `deskripsi`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'apbdes awal 2025', 2, 'anfakjas', 'draft', '2025-11-23 20:30:34', '2025-11-23 20:30:34'),
(2, 2, 'apbdes awal 2026', 2, 'snljdfakv', 'draft', '2025-11-28 20:40:31', '2025-11-28 20:40:31');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '2025_11_11_000000_create_tahun_data_table', 1),
(4, '2025_11_11_000008_create_struktur_organisasi_table', 1),
(5, '2025_11_11_100000_create_ppid_dokumen_table', 1),
(6, '2025_11_11_100003_5_create_kategori_umkm_table', 1),
(7, '2025_11_11_100004_create_umkm_table', 1),
(8, '2025_11_12_123555_create_laporan_apbdes_table', 1),
(9, '2025_11_12_123859_create_detail_apbdes_table', 1),
(10, '2025_11_13_054729_create_demografi_dusun_table', 1),
(11, '2025_11_13_065943_create_berita_table_new', 1),
(12, '2025_11_17_062540_drop_admin_fields_from_demografi_dusuns_table', 1),
(13, '2025_11_17_070200_create_demografi_detail_table', 1),
(14, '2025_11_18_181347_add_is_active_to_tahun_data_table', 1),
(15, '2025_11_19_131814_modify_tipe_nullable_on_detail_apbdes_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ppid_dokumen`
--

CREATE TABLE `ppid_dokumen` (
  `id` bigint UNSIGNED NOT NULL,
  `judul_dokumen` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kategori` enum('informasi berkala','informasi sertamerta','informasi setiap saat','informasi dikecualikan') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'informasi berkala',
  `tahun` int NOT NULL,
  `tanggal_upload` date NOT NULL,
  `uploader` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0NjRpxGUzWHs5r8yRqvbHHk8VhiVgqyjYe9Siq3v', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTo2OntzOjY6Il90b2tlbiI7czo0MDoiUm9jVk96R2tya0ZPeUVCMlJ4VFVUbzV0SnRsNXFvZ2NxY0x6VThWVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hZG1pbi91bWttcyI7czo1OiJyb3V0ZSI7czozNjoiZmlsYW1lbnQuYWRtaW4ucmVzb3VyY2VzLnVta21zLmluZGV4Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czozOiJ1cmwiO2E6MDp7fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7czoxNzoicGFzc3dvcmRfaGFzaF93ZWIiO3M6NjA6IiQyeSQxMiQ1R3pZaHlkMVVVN21Nbk90Q0M1aEdPS1ZUR0xlbC5ZVFAva1RWTDN3THNpZThoa25aZGNBZSI7fQ==', 1764428010);

-- --------------------------------------------------------

--
-- Table structure for table `struktur_organisasi`
--

CREATE TABLE `struktur_organisasi` (
  `id_struktur` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jabatan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tahun_data`
--

CREATE TABLE `tahun_data` (
  `id_tahun` bigint UNSIGNED NOT NULL,
  `tahun` int DEFAULT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tahun_data`
--

INSERT INTO `tahun_data` (`id_tahun`, `tahun`, `keterangan`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 2025, NULL, 1, '2025-11-23 19:47:09', '2025-11-28 20:39:42'),
(2, 2026, NULL, 0, '2025-11-28 20:39:10', '2025-11-28 20:39:42');

-- --------------------------------------------------------

--
-- Table structure for table `umkms`
--

CREATE TABLE `umkms` (
  `id` bigint UNSIGNED NOT NULL,
  `kategori_id` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `alamat` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telepon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sosial_facebook` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sosial_instagram` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sosial_tiktok` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shopee_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tokopedia_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiktokshop_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_galeri` text COLLATE utf8mb4_unicode_ci COMMENT 'json array url jika ingin',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `umkms`
--

INSERT INTO `umkms` (`id`, `kategori_id`, `nama`, `deskripsi`, `alamat`, `telepon`, `sosial_facebook`, `sosial_instagram`, `sosial_tiktok`, `shopee_url`, `tokopedia_url`, `tiktokshop_url`, `logo_url`, `foto_galeri`, `created_at`, `updated_at`) VALUES
(1, 1, 'n jh', ' j nj hihbh', 'j b,mbm, bm', '2321134131', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[\"umkm_galleries\\/01KAH37XSJ0214GCZRPY1HYPHK.png\"]', '2025-11-20 09:58:25', '2025-11-20 09:58:25'),
(2, 1, 'kripik tempe', 'jual ayam', 'krebet pilangkenceng', '0987252820', 'krikrip', '@kripkripsih', 'kripsih', NULL, NULL, NULL, NULL, '[\"umkm_galleries\\/01KB71KZKZ8P54A4E2P8W76EZB.jpg\"]', '2025-11-28 22:33:21', '2025-11-28 22:33:21'),
(3, 1, 'pentol mantul', 'mantul bngt nihhh', 'krebet pilangkenceng', '101928376347', 'pentolmantull', '@mantulpentol', 'pentoltul', NULL, NULL, NULL, NULL, '[\"umkm_galleries\\/01KB71R10KGBV997XSR6AG3RET.png\"]', '2025-11-28 22:35:33', '2025-11-28 22:35:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@example.com', '2025-11-20 06:21:44', '$2y$12$5GzYhyd1UU7mMnOtCC5hGOKVTGLel.YTP/kTVL3wLsie8hknZdcAe', '7Qs3get2NK', '2025-11-20 06:21:44', '2025-11-20 06:21:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `demografi_detail`
--
ALTER TABLE `demografi_detail`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `demografi_detail_demografi_dusun_id_unique` (`demografi_dusun_id`);

--
-- Indexes for table `demografi_dusun`
--
ALTER TABLE `demografi_dusun`
  ADD PRIMARY KEY (`id_dusun`),
  ADD UNIQUE KEY `unique_dusun_per_tahun` (`tahun_id`,`nama_dusun`);

--
-- Indexes for table `detail_apbdes`
--
ALTER TABLE `detail_apbdes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detail_apbdes_laporan_apbdes_id_foreign` (`laporan_apbdes_id`);

--
-- Indexes for table `kategori_umkm`
--
ALTER TABLE `kategori_umkm`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `laporan_apbdes`
--
ALTER TABLE `laporan_apbdes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `laporan_apbdes_tahun_id_foreign` (`tahun_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `ppid_dokumen`
--
ALTER TABLE `ppid_dokumen`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `struktur_organisasi`
--
ALTER TABLE `struktur_organisasi`
  ADD PRIMARY KEY (`id_struktur`);

--
-- Indexes for table `tahun_data`
--
ALTER TABLE `tahun_data`
  ADD PRIMARY KEY (`id_tahun`);

--
-- Indexes for table `umkms`
--
ALTER TABLE `umkms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `umkms_kategori_id_foreign` (`kategori_id`),
  ADD KEY `umkms_nama_index` (`nama`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `berita`
--
ALTER TABLE `berita`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `demografi_detail`
--
ALTER TABLE `demografi_detail`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `demografi_dusun`
--
ALTER TABLE `demografi_dusun`
  MODIFY `id_dusun` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `detail_apbdes`
--
ALTER TABLE `detail_apbdes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `kategori_umkm`
--
ALTER TABLE `kategori_umkm`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `laporan_apbdes`
--
ALTER TABLE `laporan_apbdes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `ppid_dokumen`
--
ALTER TABLE `ppid_dokumen`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `struktur_organisasi`
--
ALTER TABLE `struktur_organisasi`
  MODIFY `id_struktur` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tahun_data`
--
ALTER TABLE `tahun_data`
  MODIFY `id_tahun` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `umkms`
--
ALTER TABLE `umkms`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `demografi_detail`
--
ALTER TABLE `demografi_detail`
  ADD CONSTRAINT `demografi_detail_demografi_dusun_id_foreign` FOREIGN KEY (`demografi_dusun_id`) REFERENCES `demografi_dusun` (`id_dusun`) ON DELETE CASCADE;

--
-- Constraints for table `demografi_dusun`
--
ALTER TABLE `demografi_dusun`
  ADD CONSTRAINT `demografi_dusun_tahun_id_foreign` FOREIGN KEY (`tahun_id`) REFERENCES `tahun_data` (`id_tahun`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `detail_apbdes`
--
ALTER TABLE `detail_apbdes`
  ADD CONSTRAINT `detail_apbdes_laporan_apbdes_id_foreign` FOREIGN KEY (`laporan_apbdes_id`) REFERENCES `laporan_apbdes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `laporan_apbdes`
--
ALTER TABLE `laporan_apbdes`
  ADD CONSTRAINT `laporan_apbdes_tahun_id_foreign` FOREIGN KEY (`tahun_id`) REFERENCES `tahun_data` (`id_tahun`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `umkms`
--
ALTER TABLE `umkms`
  ADD CONSTRAINT `umkms_kategori_id_foreign` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_umkm` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
