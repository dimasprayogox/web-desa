<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// CATATAN: Nama file ini mungkin sudah ada, Anda hanya perlu MENGEDIT isinya.
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // GANTI 'demografi_dusuns' menjadi 'demografi_dusun' (atau nama tabel Anda yang benar)
        Schema::table('demografi_dusun', function (Blueprint $table) {

            // Cek dulu apakah kolomnya ada sebelum di-drop, agar lebih aman
            if (Schema::hasColumn('demografi_dusun', 'jumlah_rt')) {
                $table->dropColumn('jumlah_rt');
            }
            if (Schema::hasColumn('demografi_dusun', 'jumlah_rw')) {
                $table->dropColumn('jumlah_rw');
            }
            if (Schema::hasColumn('demografi_dusun', 'total_kk')) {
                $table->dropColumn('total_kk');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // GANTI 'demografi_dusuns' menjadi 'demografi_dusun' (atau nama tabel Anda yang benar)
        Schema::table('demografi_dusun', function (Blueprint $table) {
            $table->integer('jumlah_rt')->default(0);
            $table->integer('jumlah_rw')->default(0);
            $table->integer('total_kk')->default(0);
        });
    }
};
