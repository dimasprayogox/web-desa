<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('detail_apbdes', function (Blueprint $table) {
            // Ubah kolom 'tipe' menjadi nullable
            $table->string('tipe')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('detail_apbdes', function (Blueprint $table) {
            $table->string('tipe')->nullable(false)->change();
        });
    }
};
