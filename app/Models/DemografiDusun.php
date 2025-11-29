<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DemografiDusun extends Model
{
    use HasFactory;

    protected $table = 'demografi_dusun';

    /**
     * Beri tahu Eloquent apa nama Primary Key Anda.
     */
    protected $primaryKey = 'id_dusun';

  

    /**
     * PERBAIKAN: Sesuaikan $fillable agar cocok dengan kolom 'keterangan' di migrasi Anda.
     */
    protected $fillable = [
        'tahun_id',
        'nama_dusun',
        'keterangan', // Diubah dari 'keterangan_dusun'
    ];

    /**
     * Relasi ke TahunData (Induk)
     */
    public function tahunData(): BelongsTo
    {
        // 'id_tahun' adalah foreign key di tabel ini
        // 'id_tahun' adalah primary key di tabel TahunData
        // Sesuaikan 'id_tahun' jika nama kolom Anda berbeda
        return $this->belongsTo(TahunData::class, 'tahun_id', 'id_tahun');
    }

    /**
     * Relasi ke DemografiDetail (Anak)
     */
    public function demografiDetails(): HasMany
    {
        // Argumen ke-3 (localKey) adalah 'id_dusun', bukan 'id'
        return $this->hasMany(DemografiDetail::class, 'demografi_dusun_id', 'id_dusun');
    }
}
