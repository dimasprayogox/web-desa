<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class Berita extends Model
{
    use HasFactory;

    /**
     * Sesuaikan nama tabel dengan yang ada di DB.
     * Dari error terlihat tabelmu bernama `berita`.
     */
    protected $table = 'berita';

    protected $fillable = [
        'judul',
        'slug',
        'isi',
        'kategori',    // key kategori
        'gambar_url',  // nama kolom yang ada di DB
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public const KATEGORI = [
        'umum' => 'Umum',
        'pengumuman' => 'Pengumuman',
        'kegiatan' => 'Kegiatan',
    ];

    public static function getKategoriOptions(): array
    {
        return self::KATEGORI;
    }

    public function getKategoriLabelAttribute(): ?string
    {
        return self::KATEGORI[$this->kategori] ?? null;
    }

    /**
     * Boot model: hapus file gambar ketika record dihapus
     */
    protected static function booted()
    {
        static::deleting(function (Berita $berita) {
            $raw = $berita->getAttributes()['gambar_url'] ?? null;
            if ($raw && Storage::disk('public')->exists($raw)) {
                Storage::disk('public')->delete($raw);
            }
        });
    }

    /**
     * Mutator untuk kolom gambar_url
     *
     * - Jika diberikan UploadedFile -> simpan ke disk 'public' di folder 'berita' dan simpan path ke kolom gambar_url.
     * - Jika null -> hapus file lama dan set null.
     * - Jika string -> anggap path sudah benar, simpan apa adanya.
     */
    public function setGambarUrlAttribute($value)
    {
        $old = $this->getAttributes()['gambar_url'] ?? null;

        if ($value instanceof UploadedFile) {
            $disk = 'public';
            $directory = 'berita';
            $original = $value->getClientOriginalName();
            $timestamp = time();
            $filename = $timestamp . '_' . preg_replace('/[^A-Za-z0-9\-\_\.]/', '_', $original);
            $path = $value->storeAs($directory, $filename, $disk);
            $this->attributes['gambar_url'] = $path;

            if ($old && Storage::disk($disk)->exists($old)) {
                Storage::disk($disk)->delete($old);
            }

            return;
        }

        if (is_null($value)) {
            if ($old && Storage::disk('public')->exists($old)) {
                Storage::disk('public')->delete($old);
            }
            $this->attributes['gambar_url'] = null;
            return;
        }

        if (is_string($value)) {
            $this->attributes['gambar_url'] = $value;
            return;
        }
    }

    /**
     * Accessor untuk URL penuh gambar (mis. https://.../storage/berita/xxx.jpg)
     */
    public function getGambarUrlAttribute(): ?string
    {
        $path = $this->getAttributes()['gambar_url'] ?? null;
        if (empty($path)) {
            return null;
        }
        return Storage::disk('public')->url($path);
    }

    /**
     * Helper apakah ada gambar fisik
     */
    public function hasGambar(): bool
    {
        $path = $this->getAttributes()['gambar_url'] ?? null;
        return !empty($path) && Storage::disk('public')->exists($path);
    }
}
