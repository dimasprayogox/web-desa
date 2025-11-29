<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demografi_detail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demografi_dusun_id')
                ->constrained('demografi_dusun', 'id_dusun')
                ->onDelete('cascade');

            $table->json('wilayah')->nullable();    // { "rt": 5, "kk": 120 }
            $table->json('usia')->nullable();       // { "0_5": {"l":1,"p":2}, ... }
            $table->json('agama')->nullable();
            $table->json('pekerjaan')->nullable();
            $table->json('pendidikan')->nullable();
            $table->json('perkawinan')->nullable();

            $table->timestamps();
            $table->unique('demografi_dusun_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demografi_detail');
    }
};
