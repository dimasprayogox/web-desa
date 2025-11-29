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

      // Fetch dari API /demografi-detail
      const response = await apiClient.get('/demografi-detail', {
        params: { 
          per_page: 100 // ambil semua data
        }
      });

      console.log('✅ Raw API Response:', response.data);

      if (!response.data.success) {
        throw new Error('Gagal mengambil data demografi');
      }

      const demografiData = response.data.data.data; // array of demografi items
      console.log('📊 Demografi Items:', demografiData);

      if (!demografiData || demografiData.length === 0) {
        throw new Error('Data demografi kosong');
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
    // Aggregate USIA (Kelompok Umur)
    if (item.usia) {
      Object.entries(item.usia).forEach(([key, value]) => {
        if (!aggregated.usia[key]) {
          aggregated.usia[key] = { laki_laki: 0, perempuan: 0 };
        }
        aggregated.usia[key].laki_laki += parseInt(value.l || 0);
        aggregated.usia[key].perempuan += parseInt(value.p || 0);
      });
    }

    // Aggregate PENDIDIKAN
    if (item.pendidikan) {
      Object.entries(item.pendidikan).forEach(([key, value]) => {
        if (!aggregated.pendidikan[key]) {
          aggregated.pendidikan[key] = 0;
        }
        aggregated.pendidikan[key] += parseInt(value || 0);
      });
    }

    // Aggregate PEKERJAAN
    if (item.pekerjaan) {
      Object.entries(item.pekerjaan).forEach(([key, value]) => {
        if (!aggregated.pekerjaan[key]) {
          aggregated.pekerjaan[key] = 0;
        }
        aggregated.pekerjaan[key] += parseInt(value || 0);
      });
    }

    // Aggregate AGAMA
    if (item.agama) {
      Object.entries(item.agama).forEach(([key, value]) => {
        if (!aggregated.agama[key]) {
          aggregated.agama[key] = 0;
        }
        aggregated.agama[key] += parseInt(value || 0);
      });
    }

    // Aggregate PERKAWINAN
    if (item.perkawinan) {
      Object.entries(item.perkawinan).forEach(([key, value]) => {
        if (!aggregated.perkawinan[key]) {
          aggregated.perkawinan[key] = 0;
        }
        aggregated.perkawinan[key] += parseInt(value || 0);
      });
    }

    // Aggregate DUSUN
    if (item.dusun && item.statistik) {
      const dusunName = item.dusun.nama;
      if (!aggregated.dusun[dusunName]) {
        aggregated.dusun[dusunName] = 0;
      }
      aggregated.dusun[dusunName] += parseInt(item.statistik.total_penduduk || 0);
    }
  });

  console.log('📊 Aggregated Data:', aggregated);

  // Transform ke format yang dibutuhkan charts
  const transformed = {
    // Kelompok Umur
    by_kelompok_umur: Object.entries(aggregated.usia).map(([key, value]) => ({
      kelompok_umur: formatKelompokUmur(key),
      laki_laki: value.laki_laki,
      perempuan: value.perempuan,
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

  return transformed;
}

// Helper functions untuk format label
function formatKelompokUmur(key) {
  const mapping = {
    '0_5': '0-5',
    '6_12': '6-12',
    '13_17': '13-17',
    '18_40': '18-40',
    '41_plus': '41+'
  };
  return mapping[key] || key;
}

function formatPendidikan(key) {
  const mapping = {
    'belum_sekolah': 'Belum Sekolah',
    'tidak_tamat_sd': 'Tidak Tamat SD',
    'sd_sederajat': 'SD/Sederajat',
    'smp_sederajat': 'SMP/Sederajat',
    'sma_sederajat': 'SMA/Sederajat',
    'diploma': 'Diploma',
    'sarjana': 'Sarjana (S1)',
    's2': 'Magister (S2)',
    's3': 'Doktor (S3)'
  };
  return mapping[key] || key.replace(/_/g, ' ').toUpperCase();
}

function formatPekerjaan(key) {
  const mapping = {
    'belum_bekerja': 'Belum Bekerja',
    'pelajar_mahasiswa': 'Pelajar/Mahasiswa',
    'ibu_rumah_tangga': 'Ibu Rumah Tangga',
    'petani': 'Petani',
    'buruh_tani': 'Buruh Tani',
    'wiraswasta': 'Wiraswasta',
    'karyawan': 'Karyawan Swasta',
    'pns_tni_polri': 'PNS/TNI/POLRI',
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