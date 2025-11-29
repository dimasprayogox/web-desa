<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemografiDetail extends Model
{
    use HasFactory;

    protected $table = 'demografi_detail';

    protected $fillable = [
        'demografi_dusun_id',
        'wilayah',
        'usia',
        'agama',
        'pekerjaan',
        'pendidikan',
        'perkawinan',
    ];

    protected $casts = [
        'wilayah' => 'array',
        'usia' => 'array',
        'agama' => 'array',
        'pekerjaan' => 'array',
        'pendidikan' => 'array',
        'perkawinan' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Helper method untuk get total penduduk
    public function getTotalPendudukAttribute(): int
    {
        $usia = $this->usia ?? [];
        $total = 0;

        foreach ($usia as $range => $gender) {
            $total += ($gender['l'] ?? 0) + ($gender['p'] ?? 0);
        }

        return $total;
    }

    // Helper method untuk get total laki-laki
    public function getTotalLakiAttribute(): int
    {
        $usia = $this->usia ?? [];
        $total = 0;

        foreach ($usia as $range => $gender) {
            $total += ($gender['l'] ?? 0);
        }

        return $total;
    }

    // Helper method untuk get total perempuan
    public function getTotalPerempuanAttribute(): int
    {
        $usia = $this->usia ?? [];
        $total = 0;

        foreach ($usia as $range => $gender) {
            $total += ($gender['p'] ?? 0);
        }

        return $total;
    }

    public function demografiDusun()
    {
        return $this->belongsTo(DemografiDusun::class, 'demografi_dusun_id', 'id_dusun');
    }
}
