<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanApbdes extends Model
{
    use HasFactory;

    protected $table = 'laporan_apbdes';

    protected $fillable = [
        'tahun_id',
        'nama_laporan',
        'bulan_rilis',
        'deskripsi',
    ];

    protected $casts = [
        'bulan_rilis' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relasi ke TahunData
    public function tahunData()
    {
        return $this->belongsTo(TahunData::class, 'tahun_id', 'id_tahun');
    }

    // Relasi ke DetailApbdes (PASTIKAN INI ADA)
    public function detailApbdes()
    {
        return $this->hasMany(DetailApbdes::class, 'laporan_apbdes_id', 'id');
    }
}
