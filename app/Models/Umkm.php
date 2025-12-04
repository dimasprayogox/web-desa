<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class Umkm extends Model
{
    use HasFactory;

    protected $table = 'umkms';

    protected $fillable = [
        'kategori_id',
        'nama',
        'deskripsi',
        'pemilik',
        'alamat',
        'dusun',
        'rt',
        'telepon',
        'sosial_facebook',
        'sosial_instagram',
        'sosial_tiktok',
        'shopee_url',
        'tokopedia_url',
        'tiktokshop_url',
        'logo_url',
        'foto_galeri',
    ];

    protected $casts = [
        'nama' => 'string',
        'deskripsi' => 'string',
        'pemilik' => 'string',
        'alamat' => 'string',
        'dusun' => 'string',
        'rt' => 'string',
        'telepon' => 'string',
        'whatsapp' => 'string',
        'sosial_facebook' => 'string',
        'sosial_instagram' => 'string',
        'sosial_tiktok' => 'string',
        'shopee_url' => 'string',
        'tokopedia_url' => 'string',
        'tiktokshop_url' => 'string',
        'logo_url' => 'string',
        'foto_galeri' => 'array', // JSON array
    ];

    // Relasi belongs to kategori_umkm (jika ada)
    public function kategori()
    {
        return $this->belongsTo(KategoriUmkm::class, 'kategori_id');
    }

    // Accessor untuk format omset
    public function getFormattedOmsetAttribute()
    {
        return 'Rp ' . number_format((float) $this->omset_per_bulan, 0, ',', '.');
    }

    // Scope untuk pencarian
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nama', 'like', "%{$search}%")
                ->orWhere('pemilik', 'like', "%{$search}%")
                ->orWhere('jenis_usaha', 'like', "%{$search}%")
                ->orWhere('deskripsi', 'like', "%{$search}%");
        });
    }

    // Jika ingin tetap ada accessor untuk frontend, ubah jadi method biasa:
    public function getFotoGaleriUrls(): array
    {
        $paths = $this->getAttributes()['foto_galeri'];

        if (empty($paths)) {
            return [];
        }

        // Decode JSON jadi array
        if (is_string($paths)) {
            $paths = json_decode($paths, true);
        }

        if (!is_array($paths)) {
            return [];
        }

        // Return array URL absolut
        return array_map(function ($path) {
            return Storage::disk('public')->url($path);
        }, $paths);
    }
}
