import apiClient from '@/api/axiosInstance';

export const demografiService = {
  // Get all demografi detail
  getAll: async (params = {}) => {
    const response = await apiClient.get('/demografi-detail', { params });
    return response.data;
  },

  // Get single demografi
  getById: async (id) => {
    const response = await apiClient.get(`/demografi-detail/${id}`);
    return response.data;
  },

  // Get summary statistics (Total Penduduk, KK, Laki-laki, Perempuan)
  getSummary: async (params = {}) => {
    const response = await apiClient.get('/demografi-detail/statistics/summary', { params });
    return response.data;
  },

  // Get kelompok umur
  getKelompokUmur: async (params = {}) => {
    const response = await apiClient.get('/demografi-detail/statistics/kelompok-umur', { params });
    return response.data;
  },

  // Get pendidikan
  getPendidikan: async (params = {}) => {
    const response = await apiClient.get('/demografi-detail/statistics/pendidikan', { params });
    return response.data;
  },

  // Get pekerjaan
  getPekerjaan: async (params = {}) => {
    const response = await apiClient.get('/demografi-detail/statistics/pekerjaan', { params });
    return response.data;
  },

  // Get agama
  getAgama: async (params = {}) => {
    const response = await apiClient.get('/demografi-detail/statistics/agama', { params });
    return response.data;
  },

  // Get status perkawinan
  getStatusPerkawinan: async (params = {}) => {
    const response = await apiClient.get('/demografi-detail/statistics/status-perkawinan', { params });
    return response.data;
  },

  // Get dusun
  getDusun: async (params = {}) => {
    const response = await apiClient.get('/demografi-detail/statistics/dusun', { params });
    return response.data;
  },

  // Get by dusun
  getByDusun: async (dusunId) => {
    const response = await apiClient.get(`/demografi-detail/by-dusun/${dusunId}`);
    return response.data;
  },

  // Get by tahun
  getByTahun: async (tahun) => {
    const response = await apiClient.get(`/demografi-detail/by-tahun/${tahun}`);
    return response.data;
  },

  // Get piramida penduduk
  getPiramida: async (params = {}) => {
    const response = await apiClient.get('/demografi-detail/piramida', { params });
    return response.data;
  },

  // Helper function - calculate from usia
  calculateFromUsia: (usia) => {
    if (!usia || typeof usia !== 'object') {
      return { total: 0, laki_laki: 0, perempuan: 0 };
    } 

    let totalLakiLaki = 0;
    let totalPerempuan = 0;

    Object.values(usia).forEach(group => {
      if (group && typeof group === 'object') {
        totalLakiLaki += parseInt(group.l || 0, 10);
        totalPerempuan += parseInt(group.p || 0, 10);
      }
    });

    return {
      total: totalLakiLaki + totalPerempuan,
      laki_laki: totalLakiLaki,
      perempuan: totalPerempuan,
    };
  },

  // Helper function - get from wilayah
  getFromWilayah: (wilayah) => {
    if (!wilayah || typeof wilayah !== 'object') {
      return { kk: 0, rt: 0 };
    }

    return {
      kk: parseInt(wilayah.kk || 0, 10),
      rt: parseInt(wilayah.rt || 0, 10),
    };
  },
};