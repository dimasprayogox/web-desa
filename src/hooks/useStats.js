import { useState, useEffect } from 'react';
import { demografiService } from '@/api/services/demografiService';

export function useStats() {
  const [stats, setStats] = useState({
    penduduk: 0,
    kk: 0,
    laki_laki: 0,
    perempuan: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch demografi detail dengan tahun aktif
        const demografiRes = await demografiService.getAll({ 
          active_year: 1,
          per_page: 100 // Ambil semua data untuk dijumlahkan
        });

        if (demografiRes.success && demografiRes.data) {
          let totalPenduduk = 0;
          let totalKK = 0;
          let totalLakiLaki = 0;
          let totalPerempuan = 0;

          // Loop semua data demografi detail (per dusun/RT)
          demografiRes.data.data.forEach(item => {
            // Hitung KK dari kolom wilayah
            if (item.wilayah) {
              const wilayahData = demografiService.getFromWilayah(item.wilayah);
              totalKK += wilayahData.kk;
            }

            // Hitung penduduk dari kolom usia
            if (item.usia) {
              const breakdown = demografiService.calculateFromUsia(item.usia);
              totalPenduduk += breakdown.total;
              totalLakiLaki += breakdown.laki_laki;
              totalPerempuan += breakdown.perempuan;
            }
          });

          setStats({
            penduduk: totalPenduduk,
            kk: totalKK,
            laki_laki: totalLakiLaki,
            perempuan: totalPerempuan,
          });
        } else {
          throw new Error('Gagal mengambil data statistik');
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message || 'Gagal memuat data');
        
        // Set default values on error
        setStats({
          penduduk: 0,
          kk: 0,
          laki_laki: 0,
          perempuan: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}