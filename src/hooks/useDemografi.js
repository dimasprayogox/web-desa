import { useState, useEffect } from 'react';
import apiClient from '@/api/axiosInstance';

export function useDemografi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDemografi();
  }, []);
 
  const fetchDemografi = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching demografi data from API...');

      // ✅ Fetch dari API /demografi-detail dengan parameter active_year (SEPERTI useStats)
      const response = await apiClient.get('/demografi-detail', {
        params: { 
          active_year: 1, // ✅ TAMBAHKAN INI - ambil data tahun aktif saja
          per_page: 100
        }
      });

      console.log('✅ Raw API Response:', response.data);

      if (!response.data.success) {
        throw new Error('Gagal mengambil data demografi');
      }

      const demografiData = response.data.data.data; // array of demografi items
      console.log('📊 Demografi Items (Tahun Aktif):', demografiData);

      if (!demografiData || demografiData.length === 0) {
        throw new Error('Data demografi kosong untuk tahun aktif');
      }

      // Transform data untuk charts
      const transformedData = transformDemografiData(demografiData);
      console.log('✅ Transformed Data:', transformedData);

      setData(transformedData);

    } catch (err) {
      console.error('❌ Error fetching demografi:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data');
      
      // Set default empty data structure on error
      setData({
        by_kelompok_umur: [],
        by_pendidikan: [],
        by_pekerjaan: [],
        by_agama: [],
        by_status_perkawinan: [],
        by_dusun: [],
      });
    } finally {
      setLoading(false);
      console.log('✅ Demografi fetch complete');
    }
  };

  const refetch = () => {
    console.log('🔄 Refetching demografi data...');
    fetchDemografi();
  };

  return { data, loading, error, refetch };
}

// Helper function untuk transform data
function transformDemografiData(demografiItems) {
  console.log('🔄 Transforming demografi data...');

  // Aggregate semua data
  const aggregated = {
    usia: {},
    pendidikan: {},
    pekerjaan: {},
    agama: {},
    perkawinan: {},
    dusun: {}
  };

  demografiItems.forEach(item => {
    console.log('Processing item:', item);

    // Aggregate USIA (Kelompok Umur)
    if (item.usia && typeof item.usia === 'object') {
      Object.entries(item.usia).forEach(([key, value]) => {
        if (!aggregated.usia[key]) {
          aggregated.usia[key] = { laki_laki: 0, perempuan: 0 };
        }
        const lakiLaki = parseInt(value.l || 0, 10);
        const perempuan = parseInt(value.p || 0, 10);
        
        aggregated.usia[key].laki_laki += lakiLaki;
        aggregated.usia[key].perempuan += perempuan;

        console.log(`  Usia ${key}: L=${lakiLaki}, P=${perempuan}`);
      });
    }

    // Aggregate PENDIDIKAN
    if (item.pendidikan && typeof item.pendidikan === 'object') {
      Object.entries(item.pendidikan).forEach(([key, value]) => {
        if (!aggregated.pendidikan[key]) {
          aggregated.pendidikan[key] = 0;
        }
        const jumlah = parseInt(value || 0, 10);
        aggregated.pendidikan[key] += jumlah;
        
        if (jumlah > 0) {
          console.log(`  Pendidikan ${key}: ${jumlah}`);
        }
      });
    }

    // Aggregate PEKERJAAN
    if (item.pekerjaan && typeof item.pekerjaan === 'object') {
      Object.entries(item.pekerjaan).forEach(([key, value]) => {
        if (!aggregated.pekerjaan[key]) {
          aggregated.pekerjaan[key] = 0;
        }
        const jumlah = parseInt(value || 0, 10);
        aggregated.pekerjaan[key] += jumlah;
        
        if (jumlah > 0) {
          console.log(`  Pekerjaan ${key}: ${jumlah}`);
        }
      });
    }

    // Aggregate AGAMA
    if (item.agama && typeof item.agama === 'object') {
      Object.entries(item.agama).forEach(([key, value]) => {
        if (!aggregated.agama[key]) {
          aggregated.agama[key] = 0;
        }
        const jumlah = parseInt(value || 0, 10);
        aggregated.agama[key] += jumlah;
        
        if (jumlah > 0) {
          console.log(`  Agama ${key}: ${jumlah}`);
        }
      });
    }

    // Aggregate PERKAWINAN
    if (item.perkawinan && typeof item.perkawinan === 'object') {
      Object.entries(item.perkawinan).forEach(([key, value]) => {
        if (!aggregated.perkawinan[key]) {
          aggregated.perkawinan[key] = 0;
        }
        const jumlah = parseInt(value || 0, 10);
        aggregated.perkawinan[key] += jumlah;
        
        if (jumlah > 0) {
          console.log(`  Perkawinan ${key}: ${jumlah}`);
        }
      });
    }

    // Aggregate DUSUN
    if (item.dusun && item.statistik) {
      const dusunName = item.dusun.nama_dusun || item.dusun.nama || 'Tidak Diketahui';
      if (!aggregated.dusun[dusunName]) {
        aggregated.dusun[dusunName] = 0;
      }
      const totalPenduduk = parseInt(item.statistik.total_penduduk || 0, 10);
      aggregated.dusun[dusunName] += totalPenduduk;
      
      if (totalPenduduk > 0) {
        console.log(`  Dusun ${dusunName}: ${totalPenduduk}`);
      }
    }
  });

  console.log('📊 Aggregated Data:', aggregated);

  // Transform ke format yang dibutuhkan charts
  const transformed = {
    // Kelompok Umur
    by_kelompok_umur: Object.entries(aggregated.usia).map(([key, value]) => ({
      kelompok_umur: formatKelompokUmur(key),
      laki_laki: value.laki_laki,
      l: value.laki_laki, // alias
      perempuan: value.perempuan,
      p: value.perempuan, // alias
      total: value.laki_laki + value.perempuan
    })),

    // Pendidikan
    by_pendidikan: Object.entries(aggregated.pendidikan)
      .map(([key, value]) => ({
        tingkat_pendidikan: formatPendidikan(key),
        total: value
      }))
      .filter(item => item.total > 0) // filter yang > 0
      .sort((a, b) => b.total - a.total), // sort descending

    // Pekerjaan
    by_pekerjaan: Object.entries(aggregated.pekerjaan)
      .map(([key, value]) => ({
        jenis_pekerjaan: formatPekerjaan(key),
        total: value
      }))
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total),

    // Agama
    by_agama: Object.entries(aggregated.agama)
      .map(([key, value]) => ({
        agama: formatAgama(key),
        total: value
      }))
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total),

    // Status Perkawinan
    by_status_perkawinan: Object.entries(aggregated.perkawinan)
      .map(([key, value]) => ({
        status_perkawinan: formatStatusPerkawinan(key),
        total: value
      }))
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total),

    // Dusun
    by_dusun: Object.entries(aggregated.dusun)
      .map(([key, value]) => ({
        dusun: key,
        total: value
      }))
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total),
  };

  console.log('✅ Final Transformed Data:', transformed);
  console.log('  → Kelompok Umur:', transformed.by_kelompok_umur);
  console.log('  → Pendidikan:', transformed.by_pendidikan);
  console.log('  → Pekerjaan:', transformed.by_pekerjaan);
  console.log('  → Agama:', transformed.by_agama);
  console.log('  → Perkawinan:', transformed.by_status_perkawinan);
  console.log('  → Dusun:', transformed.by_dusun);

  return transformed;
}

// Helper functions untuk format label
function formatKelompokUmur(key) {
  const mapping = {
    '0_5': '0-5',
    '6_12': '6-12',
    '13_17': '13-17',
    '18_40': '18-40',
    '41_plus': '41+',
    '0-5': '0-5',
    '6-12': '6-12',
    '13-17': '13-17',
    '18-40': '18-40',
    '41+': '41+'
  };
  return mapping[key] || key;
}

function formatPendidikan(key) {
  const mapping = {
    'belum_sekolah': 'Belum Sekolah',
    'tidak_tamat_sd': 'Tidak Tamat SD',
    'sd_sederajat': 'SD/Sederajat',
    'sd': 'SD/Sederajat',
    'smp_sederajat': 'SMP/Sederajat',
    'smp': 'SMP/Sederajat',
    'sma_sederajat': 'SMA/Sederajat',
    'sma': 'SMA/Sederajat',
    'diploma': 'Diploma',
    'sarjana': 'Sarjana (S1)',
    's1': 'Sarjana (S1)',
    's2': 'Magister (S2)',
    's3': 'Doktor (S3)'
  };
  return mapping[key] || key.replace(/_/g, ' ').toUpperCase();
}

function formatPekerjaan(key) {
  const mapping = {
    'belum_bekerja': 'Belum Bekerja',
    'pelajar_mahasiswa': 'Pelajar/Mahasiswa',
    'pelajar': 'Pelajar/Mahasiswa',
    'mahasiswa': 'Pelajar/Mahasiswa',
    'ibu_rumah_tangga': 'Ibu Rumah Tangga',
    'petani': 'Petani',
    'buruh_tani': 'Buruh Tani',
    'buruh': 'Buruh Tani',
    'wiraswasta': 'Wiraswasta',
    'karyawan': 'Karyawan Swasta',
    'karyawan_swasta': 'Karyawan Swasta',
    'pns_tni_polri': 'PNS/TNI/POLRI',
    'pns': 'PNS/TNI/POLRI',
    'lainnya': 'Lainnya'
  };
  return mapping[key] || key.replace(/_/g, ' ').toUpperCase();
}

function formatAgama(key) {
  const mapping = {
    'islam': 'Islam',
    'kristen': 'Kristen',
    'katolik': 'Katolik',
    'hindu': 'Hindu',
    'buddha': 'Buddha',
    'konghucu': 'Konghucu',
    'lainnya': 'Lainnya'
  };
  return mapping[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

function formatStatusPerkawinan(key) {
  const mapping = {
    'belum_kawin': 'Belum Kawin',
    'kawin': 'Kawin',
    'cerai_hidup': 'Cerai Hidup',
    'cerai_mati': 'Cerai Mati'
  };
  return mapping[key] || key.replace(/_/g, ' ').toUpperCase();
}