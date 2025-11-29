import { useState, useEffect } from 'react';
import { apbdesService } from '@/api/services/apbdesService';

export function useApbdes(selectedYear) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchApbdesData(selectedYear);
    }
  }, [selectedYear]);

  const fetchAvailableYears = async () => {
    try {
      console.log('🔄 Fetching available years...');
      const response = await apbdesService.getAvailableYears();
      
      if (response.success) {
        console.log('✅ Available years:', response.data);
        setAvailableYears(response.data);
      }
    } catch (err) {
      console.error('❌ Error fetching years:', err);
    }
  };

  const fetchApbdesData = async (year) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching APBDes data for year:', year);

      const response = await apbdesService.getYearlyData(year);

      if (response.success) {
        console.log('✅ APBDes data fetched:', response.data);
        setData(response.data);
      } else {
        throw new Error('Gagal mengambil data APBDes');
      }
    } catch (err) {
      console.error('❌ Error fetching APBDes:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data');
      
      // Set empty data on error
      setData({
        summary: {
          total_anggaran: 0,
          total_realisasi: 0,
          persentase_realisasi: 0,
        },
        by_tipe: [],
        yearly_comparison: [],
        laporan_list: []
      });
    } finally {
      setLoading(false);
      console.log('✅ APBDes fetch complete');
    }
  };

  const refetch = () => {
    if (selectedYear) {
      fetchApbdesData(selectedYear);
    }
  };

  return { 
    data, 
    loading, 
    error, 
    availableYears,
    refetch 
  };
}