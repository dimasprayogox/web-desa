<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailApbdes extends Model
{
    use HasFactory;

    protected $table = 'detail_apbdes';

    protected $fillable = [
        'laporan_apbdes_id',
        'tipe',
        'uraian',
        'anggaran',
        'realisasi',
    ];

    /**
     * Casting untuk memastikan nilai uang adalah float/decimal
     */
    protected $casts = [
        'anggaran' => 'decimal:2',
        'realisasi' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi balik ke Laporan APBDes
     */
    public function laporanApbdes(): BelongsTo
    {
        return $this->belongsTo(LaporanApbdes::class, 'laporan_apbdes_id', 'id');
    }
}
