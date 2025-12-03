<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('demografi_dusun', function (Blueprint $table) {
            // 1. Tambah kolom dusun_id (nullable dulu)
            $table->unsignedBigInteger('dusun_id')->nullable()->after('tahun_id');
            
            // 2. Ubah nama_dusun jadi nullable (data lama tetap ada)
            $table->string('nama_dusun', 100)->nullable()->change();
        });
        
        // 3. Tambah foreign key setelah data di-migrate
        // (akan dilakukan di seeder dulu)
    }

    public function down(): void
    {
        Schema::table('demografi_dusun', function (Blueprint $table) {
            $table->dropColumn('dusun_id');
            $table->string('nama_dusun', 100)->nullable(false)->change();
        });
    }
};
