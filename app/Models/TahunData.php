<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TahunData extends Model
{
    // Ganti kalau primary key Anda bernama lain (mis: id_tahun)
    protected $primaryKey = 'id_tahun';

    // Jika primary key bertipe integer autoincrement (default), biarkan true
    public $incrementing = true;

    // Jika primary key bukan integer, set 'string'
    protected $keyType = 'int';

    protected $table = 'tahun_data';

    protected $fillable = [
        'tahun',
        'keterangan',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'tahun' => 'integer',
    ];

    protected static function booted()
    {
        static::creating(function (TahunData $model) {
            // Matikan semua aktif sebelumnya
            DB::table($model->getTable())
                ->where('is_active', true)
                ->update(['is_active' => false]);

            // Pastikan model baru aktif
            $model->is_active = true;
        });

        static::updating(function (TahunData $model) {
            if ($model->is_active) {
                DB::table($model->getTable())
                    ->where($model->getKeyName(), '!=', $model->getKey())
                    ->update(['is_active' => false]);
            }
        });
    }

    // ========== TAMBAHKAN SCOPE INI ==========

    /**
     * Scope untuk filter tahun yang aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope untuk filter tahun yang tidak aktif
     */
    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    /**
     * Scope untuk filter berdasarkan tahun tertentu
     */
    public function scopeByYear($query, $year)
    {
        return $query->where('tahun', $year);
    }

    // ========== END SCOPE ==========

    // Relasi — sesuaikan nama FK jika berbeda
    public function demografiDusun()
    {
        return $this->hasMany(\App\Models\DemografiDusun::class, 'tahun_id', $this->getKeyName());
    }

    public function laporanApbdes()
    {
        return $this->hasMany(\App\Models\LaporanApbdes::class, 'tahun_id', $this->getKeyName());
    }

    // ========== HELPER METHODS ==========

    /**
     * Get tahun aktif saat ini
     */
    public static function getActiveTahun()
    {
        return static::where('is_active', true)->first();
    }

    /**
     * Cek apakah tahun ini aktif
     */
    public function isActive(): bool
    {
        return $this->is_active === true;
    }

    /**
     * Aktifkan tahun ini (dan nonaktifkan yang lain)
     */
    public function activate(): bool
    {
        DB::table($this->getTable())
            ->where($this->getKeyName(), '!=', $this->getKey())
            ->update(['is_active' => false]);

        return $this->update(['is_active' => true]);
    }

    /**
     * Nonaktifkan tahun ini
     */
    public function deactivate(): bool
    {
        return $this->update(['is_active' => false]);
    }
}
