import apiClient from '@/api/axiosInstance';

export const apbdesService = {
  // Get all laporan APBDes
  getAll: async (params = {}) => {
    const response = await apiClient.get('/laporan-apbdes', { params });
    return response.data;
  },

  // Get laporan by ID
  getById: async (id) => {
    const response = await apiClient.get(`/laporan-apbdes/${id}`);
    return response.data;
  },

  // Get laporan by tahun
  getByTahun: async (tahun, params = {}) => {
    const response = await apiClient.get('/laporan-apbdes', {
      params: { tahun, ...params }
    });
    return response.data;
  },

  // ✅ UPDATED: Get ALL detail APBDes (bukan per laporan)
  getAllDetail: async (params = {}) => {
    const response = await apiClient.get('/detail-apbdes', { params });
    return response.data;
  },

  // ✅ NEW: Get detail APBDes by laporan_id
  getDetailByLaporan: async (laporanId, params = {}) => {
    const response = await apiClient.get('/detail-apbdes', {
      params: { laporan_id: laporanId, per_page: 100, ...params }
    });
    return response.data;
  },

  // ✅ NEW: Get detail APBDes by tahun
  getDetailByTahun: async (tahun, params = {}) => {
    const response = await apiClient.get('/detail-apbdes', {
      params: { tahun, per_page: 100, ...params }
    });
    return response.data;
  },

  // Get available years
  getAvailableYears: async () => {
    try {
      const response = await apiClient.get('/laporan-apbdes', {
        params: { per_page: 100 }
      });

      if (response.data.success && response.data.data.data) {
        const years = [...new Set(
          response.data.data.data.map(item => item.tahun.tahun)
        )].sort((a, b) => b - a);

        return {
          success: true,
          data: years
        };
      }

      return {
        success: true,
        data: [new Date().getFullYear()]
      };
    } catch (error) {
      console.error('Error fetching available years:', error);
      return {
        success: false,
        data: [new Date().getFullYear()]
      };
    }
  },

  // ✅ UPDATED: Get yearly data with real detail from /detail-apbdes
  getYearlyData: async (tahun) => {
    try {
      console.log(`🔄 Fetching APBDes data for year ${tahun}...`);

      // 1. Get laporan list untuk tahun ini
      const laporanResponse = await apiClient.get('/laporan-apbdes', {
        params: { tahun, per_page: 100 }
      });

      console.log('📊 Laporan Response:', laporanResponse.data);

      if (!laporanResponse.data.success) {
        throw new Error('Gagal mengambil data laporan APBDes');
      }

      const laporanList = laporanResponse.data.data.data || [];

      if (laporanList.length === 0) {
        return {
          success: true,
          data: {
            summary: {
              total_anggaran: 0,
              total_realisasi: 0,
              persentase_realisasi: 0,
            },
            by_tipe: [],
            yearly_comparison: [],
            laporan_list: []
          }
        };
      }

      // 2. Aggregate summary dari semua laporan
      let totalAnggaran = 0;
      let totalRealisasi = 0;

      laporanList.forEach(laporan => {
        if (laporan.summary) {
          totalAnggaran += parseInt(laporan.summary.total_anggaran || 0);
          totalRealisasi += parseInt(laporan.summary.total_realisasi || 0);
        }
      });

      const persentaseRealisasi = totalAnggaran > 0 
        ? parseFloat(((totalRealisasi / totalAnggaran) * 100).toFixed(1))
        : 0;

      // 3. ✅ Get ALL detail untuk tahun ini dari /detail-apbdes
      const detailResponse = await apiClient.get('/detail-apbdes', {
        params: { tahun, per_page: 1000 } // Get semua detail untuk tahun ini
      });

      console.log('📊 Detail Response:', detailResponse.data);

      const allDetails = detailResponse.data.success && detailResponse.data.data.data 
        ? detailResponse.data.data.data 
        : [];

      console.log('✅ All Details:', allDetails);

      // 4. Aggregate by tipe
      const byTipeMap = {
        pendapatan: { total_anggaran: 0, total_realisasi: 0, details: [] },
        belanja: { total_anggaran: 0, total_realisasi: 0, details: [] },
        pembiayaan: { total_anggaran: 0, total_realisasi: 0, details: [] },
      };

      allDetails.forEach(detail => {
        const tipe = detail.tipe ? detail.tipe.toLowerCase() : '';
        
        if (byTipeMap[tipe]) {
          const anggaran = parseInt(detail.anggaran || 0);
          const realisasi = parseInt(detail.realisasi || 0);

          byTipeMap[tipe].total_anggaran += anggaran;
          byTipeMap[tipe].total_realisasi += realisasi;
          
          // Add to details (sort by anggaran descending, limit top 10 per tipe)
          byTipeMap[tipe].details.push({
            id: detail.id,
            uraian: detail.uraian || 'Tidak ada uraian',
            anggaran: anggaran,
            realisasi: realisasi,
            persentase: detail.persentase || 0,
            laporan_id: detail.laporan?.id,
            laporan_nama: detail.laporan?.nama,
          });
        }
      });

      // Sort details by anggaran and limit to top 10
      Object.keys(byTipeMap).forEach(tipe => {
        byTipeMap[tipe].details = byTipeMap[tipe].details
          .sort((a, b) => b.anggaran - a.anggaran)
          .slice(0, 10);
      });

      // 5. Format by_tipe untuk chart
      const byTipe = Object.entries(byTipeMap)
        .map(([tipe, data]) => ({
          tipe: tipe,
          total_anggaran: data.total_anggaran,
          total_realisasi: data.total_realisasi,
          persentase: data.total_anggaran > 0 
            ? parseFloat(((data.total_realisasi / data.total_anggaran) * 100).toFixed(1))
            : 0,
          details: data.details
        }))
        .filter(item => item.total_anggaran > 0); // Filter yang ada data

      console.log('📊 By Tipe:', byTipe);

      // 6. Get yearly comparison
      const yearlyComparison = await getYearlyComparison(tahun);

      return {
        success: true,
        data: {
          summary: {
            total_anggaran: totalAnggaran,
            total_realisasi: totalRealisasi,
            persentase_realisasi: persentaseRealisasi,
          },
          by_tipe: byTipe,
          yearly_comparison: yearlyComparison,
          laporan_list: laporanList
        }
      };

    } catch (error) {
      console.error('❌ Error fetching yearly APBDes data:', error);
      throw error;
    }
  }
};

// ✅ UPDATED: Helper function untuk yearly comparison menggunakan /detail-apbdes
async function getYearlyComparison(currentYear) {
  try {
    const years = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
    
    const yearlyDataPromises = years.map(async (year) => {
      try {
        // Get detail APBDes untuk tahun ini
        const detailResponse = await apiClient.get('/detail-apbdes', {
          params: { tahun: year, per_page: 1000 }
        });

        if (detailResponse.data.success && detailResponse.data.data.data) {
          const details = detailResponse.data.data.data;
          
          // Aggregate by tipe
          let pendapatan = 0;
          let belanja = 0;
          let pembiayaan = 0;

          details.forEach(detail => {
            const anggaran = parseInt(detail.anggaran || 0);
            const tipe = detail.tipe ? detail.tipe.toLowerCase() : '';

            if (tipe === 'pendapatan') pendapatan += anggaran;
            else if (tipe === 'belanja') belanja += anggaran;
            else if (tipe === 'pembiayaan') pembiayaan += anggaran;
          });

          return {
            tahun: year,
            pendapatan,
            belanja,
            pembiayaan
          };
        }

        return {
          tahun: year,
          pendapatan: 0,
          belanja: 0,
          pembiayaan: 0
        };
      } catch (err) {
        console.error(`Error fetching year ${year}:`, err);
        return {
          tahun: year,
          pendapatan: 0,
          belanja: 0,
          pembiayaan: 0
        };
      }
    });

    const yearlyData = await Promise.all(yearlyDataPromises);
    console.log('📊 Yearly Comparison:', yearlyData);
    return yearlyData;

  } catch (error) {
    console.error('Error in getYearlyComparison:', error);
    return [];
  }
}