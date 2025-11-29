<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('umkms', function (Blueprint $table) {
            $table->id(); // increments("id").primary()

            // Relasi ke kategori_umkm
            $table->foreignId('kategori_id')
                ->unsigned()
                ->nullable(false)
                ->references('id')
                ->on('kategori_umkm')
                ->onDelete('restrict') // Disesuaikan dari Knex: RESTRICT
                ->onUpdate('cascade');

            $table->string('nama', 255)->nullable(false)->index();
            $table->text('deskripsi')->nullable();

            $table->string('alamat', 500)->nullable();

            $table->string('telepon', 50)->nullable();
            $table->string('sosial_facebook', 255)->nullable();
            $table->string('sosial_instagram', 255)->nullable();
            $table->string('sosial_tiktok', 255)->nullable();
            $table->string('shopee_url', 255)->nullable();
            $table->string('tokopedia_url', 255)->nullable();
            $table->string('tiktokshop_url', 255)->nullable();

            // Media / Gambar
            $table->string('logo_url', 500)->nullable();
            $table->text('foto_galeri')->nullable()->comment('json array url jika ingin');

            // Timestamps
            $table->timestamps(); // creates created_at and updated_at

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkms');
    }
};
