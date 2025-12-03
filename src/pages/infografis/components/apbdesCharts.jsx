import { useState, useEffect } from "react";
import { Card, CardBody, Typography, Spinner, Alert } from "@material-tailwind/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Import custom hook
import apiClient from '@/api/axiosInstance';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

// Format currency helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function ApbdesCharts() {
  const [selectedLaporanId, setSelectedLaporanId] = useState(null);
  const [availableLaporan, setAvailableLaporan] = useState([]);
  const [currentLaporanData, setCurrentLaporanData] = useState(null);
  const [allYearsData, setAllYearsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // ✅ Fetch daftar laporan APBDes dengan error handling lebih baik
  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const response = await apiClient.get('/laporan-apbdes', {
          timeout: 30000 // 30 seconds
        });
        
        // ✅ Handle berbagai struktur response
        let laporanList = [];
        
        if (response.data?.data?.data) {
          laporanList = response.data.data.data;
        } else if (response.data?.data) {
          laporanList = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        } else if (Array.isArray(response.data)) {
          laporanList = response.data;
        }
        
        // ✅ FIX: Ensure all list items have required properties and are primitive safe
        laporanList = laporanList.map(item => ({
            id: Number(item.id),
            nama: String(item.nama_laporan || item.nama || 'Laporan'), // ✅ Ambil dari nama_laporan
            nama_laporan: String(item.nama_laporan || item.nama || 'Laporan'), // ✅ Tambahkan field nama_laporan juga
            tahun: typeof item.tahun === 'object' 
              ? Number(item.tahun?.tahun || new Date().getFullYear()) 
              : Number(item.tahun || new Date().getFullYear()),
        }));


        setAvailableLaporan(laporanList);
        
        // Set laporan pertama sebagai default
        if (laporanList.length > 0 && !selectedLaporanId) {
          setSelectedLaporanId(laporanList[0].id);
        } else if (laporanList.length === 0) {
          setError('Tidak ada laporan APBDes yang tersedia');
          setLoading(false);
        }
      } catch (error) {
        
        // ✅ Detail error handling
        if (error.code === 'ECONNABORTED') {
          setError('⏱️ Request timeout. Server membutuhkan waktu terlalu lama untuk merespons.');
        } else if (error.response?.status === 404) {
          setError('❌ Endpoint /laporan-apbdes tidak ditemukan. Periksa konfigurasi backend.');
        } else if (error.message === 'Network Error') {
          setError('🌐 Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
        } else {
          setError(error.response?.data?.message || error.message || 'Gagal memuat daftar laporan');
        }
        
        setDebugInfo({
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message
        });
        
        setLoading(false);
      }
    };

    fetchLaporan();
  }, []);

  // ✅ Fetch data detail berdasarkan laporan yang dipilih
  useEffect(() => {
    if (!selectedLaporanId) return;

    const fetchLaporanData = async () => {
      setLoading(true);
      setError(null);
      setDebugInfo(null);
      
      try {
       
        
        const response = await apiClient.get('/detail-apbdes', {
          params: { laporan_id: selectedLaporanId },
          timeout: 30000
        });
        
        // ✅ Handle berbagai struktur response
        let details = [];
        
        if (response.data?.data?.data) {
          details = response.data.data.data;
        } else if (response.data?.data) {
          details = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        } else if (Array.isArray(response.data)) {
          details = response.data;
        }

        // ✅ Validasi data
        if (!details || details.length === 0) {
          setError('Tidak ada detail data untuk laporan yang dipilih');
          setLoading(false);
          return;
        }

        // Group data berdasarkan tipe
        const groupedByTipe = {
          pendapatan: { details: [], total_anggaran: 0, total_realisasi: 0 },
          belanja: { details: [], total_anggaran: 0, total_realisasi: 0 },
          pembiayaan: { details: [], total_anggaran: 0, total_realisasi: 0 },
        };

        details.forEach(item => {
          const tipe = item.tipe?.toLowerCase();
          if (tipe && groupedByTipe[tipe]) {
            groupedByTipe[tipe].details.push({
              uraian: String(item.uraian || 'Tidak ada uraian'),
              anggaran: parseInt(item.anggaran) || 0,
              realisasi: parseInt(item.realisasi) || 0,
            });
            groupedByTipe[tipe].total_anggaran += parseInt(item.anggaran) || 0;
            groupedByTipe[tipe].total_realisasi += parseInt(item.realisasi) || 0;
          } else {
            console.warn('⚠️ Invalid tipe:', tipe, 'for item:', item);
          }
        });

        // Calculate summary
        const totalAnggaran = Object.values(groupedByTipe).reduce(
          (sum, tipe) => sum + tipe.total_anggaran, 0
        );
        const totalRealisasi = Object.values(groupedByTipe).reduce(
          (sum, tipe) => sum + tipe.total_realisasi, 0
        );

        const formattedData = {
          summary: {
            total_anggaran: totalAnggaran,
            total_realisasi: totalRealisasi,
            persentase_realisasi: totalAnggaran > 0 
              ? String(((totalRealisasi / totalAnggaran) * 100).toFixed(2))
              : '0'
          },
          by_tipe: Object.entries(groupedByTipe).map(([tipe, data]) => ({
            tipe,
            details: data.details,
            total_anggaran: data.total_anggaran,
            total_realisasi: data.total_realisasi,
            persentase: data.total_anggaran > 0
              ? String(((data.total_realisasi / data.total_anggaran) * 100).toFixed(2))
              : '0'
          }))
        };
        setCurrentLaporanData(formattedData);
      } catch (error) {
        
        if (error.code === 'ECONNABORTED') {
          setError('⏱️ Request timeout saat memuat detail laporan.');
        } else if (error.response?.status === 404) {
          setError('❌ Endpoint /detail-apbdes tidak ditemukan.');
        } else {
          setError(error.response?.data?.message || error.message || 'Gagal memuat data laporan');
        }
        
        setDebugInfo({
          url: error.config?.url,
          params: error.config?.params,
          status: error.response?.status,
          message: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLaporanData();
  }, [selectedLaporanId]);

  // ✅ Fetch data untuk semua laporan (perbandingan)
  useEffect(() => {
    const fetchAllLaporanData = async () => {
      setLoadingComparison(true);
      try {

        // FIX: Remove params to fetch all data for comparison
        const response = await apiClient.get('/detail-apbdes', { 
          timeout: 30000
        });

        // ✅ Handle berbagai struktur response
        let allDetails = [];
        
        if (response.data?.data?.data) {
          allDetails = response.data.data.data;
        } else if (response.data?.data) {
          allDetails = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        } else if (Array.isArray(response.data)) {
          allDetails = response.data;
        }


        if (!allDetails || allDetails.length === 0) {
          setAllYearsData([]);
          setLoadingComparison(false);
          return;
        }

        // Group data berdasarkan laporan_id
        const groupedByLaporan = {};
        
        allDetails.forEach(item => {
          if (!item.laporan || !item.laporan.id) {
            // FIX: Use optional chaining defensively
            const tempId = item.laporan_id || item.laporan?.id;
            if (!tempId) {
                return;
            }
          }
          
          const laporanId = Number(item.laporan.id);
          
          if (!groupedByLaporan[laporanId]) {
            // FIX: Ensure all nested properties are handled safely
            groupedByLaporan[laporanId] = {
              id: laporanId,
              // ✅ FIX: Pastikan semua value adalah primitive
              nama: String(item.laporan?.nama || 'Laporan'),
              tahun: typeof item.laporan?.tahun === 'object' 
                ? (item.laporan.tahun?.tahun || new Date().getFullYear()) // Access nested year if object
                : (Number(item.laporan?.tahun) || new Date().getFullYear()),
              pendapatan: { anggaran: 0, realisasi: 0 },
              belanja: { anggaran: 0, realisasi: 0 },
              pembiayaan: { anggaran: 0, realisasi: 0 },
            };
          }

          const tipe = item.tipe?.toLowerCase();
          if (tipe && groupedByLaporan[laporanId][tipe]) {
            groupedByLaporan[laporanId][tipe].anggaran += parseInt(item.anggaran) || 0;
            groupedByLaporan[laporanId][tipe].realisasi += parseInt(item.realisasi) || 0;
          }
        });

        // Transform ke format yang dibutuhkan chart
        const transformedData = Object.values(groupedByLaporan)
          .map(laporanData => {
            // ✅ PISAHKAN: Pendapatan + Pembiayaan vs Belanja
            const totalAnggaranPendapatan = 
              laporanData.pendapatan.anggaran + 
              laporanData.pembiayaan.anggaran;
            
            const totalRealisasiPendapatan = 
              laporanData.pendapatan.realisasi + 
              laporanData.pembiayaan.realisasi;
            
            const totalAnggaranBelanja = laporanData.belanja.anggaran;
            const totalRealisasiBelanja = laporanData.belanja.realisasi;
            
            // Total keseluruhan
            const totalAnggaran = totalAnggaranPendapatan + totalAnggaranBelanja;
            const totalRealisasi = totalRealisasiPendapatan + totalRealisasiBelanja;

            // ✅ FIX: Return hanya primitive values
            return {
              id: Number(laporanData.id),
              nama: String(laporanData.nama),
              tahun: Number(laporanData.tahun),
              
              // Individual items
              pendapatan: Number(laporanData.pendapatan.anggaran),
              belanja: Number(laporanData.belanja.anggaran),
              pembiayaan: Number(laporanData.pembiayaan.anggaran),
              
              // ✅ NEW: Anggaran & Realisasi Pendapatan (Pendapatan + Pembiayaan)
              total_anggaran_pendapatan: Number(totalAnggaranPendapatan),
              total_realisasi_pendapatan: Number(totalRealisasiPendapatan),
              persentase_realisasi_pendapatan: totalAnggaranPendapatan > 0 
                ? Number(((totalRealisasiPendapatan / totalAnggaranPendapatan) * 100).toFixed(2))
                : 0,
              
              // ✅ NEW: Anggaran & Realisasi Belanja
              total_anggaran_belanja: Number(totalAnggaranBelanja),
              total_realisasi_belanja: Number(totalRealisasiBelanja),
              persentase_realisasi_belanja: totalAnggaranBelanja > 0 
                ? Number(((totalRealisasiBelanja / totalAnggaranBelanja) * 100).toFixed(2))
                : 0,
              
              // Keep old values
              total_anggaran: Number(totalAnggaran),
              total_realisasi: Number(totalRealisasi),
              persentase_realisasi: totalAnggaran > 0 
                ? Number(((totalRealisasi / totalAnggaran) * 100).toFixed(2))
                : 0
            };
          })
          .filter(item => item.total_anggaran > 0)
          .sort((a, b) => a.tahun - b.tahun);

        setAllYearsData(transformedData);
      } catch (error) {
        setAllYearsData([]);
      } finally {
        setLoadingComparison(false);
      }
    };

    fetchAllLaporanData();
  }, []);

  // Chart options
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: "'poppins', sans-serif",
          },
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            // FIX: Handle Line/Bar Chart (y-axis)
            if (context.parsed.y !== undefined && context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            } 
            // FIX: Handle Doughnut Chart (parsed.y is not available)
            else if (context.parsed !== undefined && context.dataset.label !== 'Realisasi (%)') {
                 label += formatCurrency(context.parsed);
            }
            return label;
          }
        }
      }
    },
  };

  // ✅ Enhanced Loading State
  if (loading && !currentLaporanData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardBody className="text-center py-12">
            <Spinner className="h-12 w-12 mx-auto mb-4" color="blue" />
            <Typography variant="h6" className="mb-2">
              Memuat data APBDes...
            </Typography>
            <Typography variant="small" className="text-gray-600">
              Mohon tunggu sebentar
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ✅ Enhanced Error State dengan Debug Info
  if (error) {
    return (
      <div className="space-y-4">
        <Card className="bg-red-50 border-l-4 border-l-red-500">
          <CardBody>
            <div className="flex items-start gap-4">
              <svg 
                className="w-12 h-12 text-red-500 flex-shrink-0"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <div className="flex-1">
                <Typography variant="h5" className="text-red-600 font-bold mb-2">
                  Gagal Memuat Data APBDes
                </Typography>
                <Typography className="text-red-800 mb-4">
                  {error}
                </Typography>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                  >
                    Muat Ulang Halaman
                  </button>
                  <button
                    onClick={() => {
                      setError(null);
                      setDebugInfo(null);
                      window.location.reload();
                    }}
                    className="bg-white hover:bg-gray-50 text-red-600 border border-red-600 font-semibold px-6 py-2 rounded-lg transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        
      
      </div>
    );
  }

  // No Data State
  if (!currentLaporanData || !currentLaporanData.by_tipe || currentLaporanData.by_tipe.length === 0) {
    return (
      <Card className="bg-yellow-50 border-l-4 border-l-yellow-500">
        <CardBody className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <Typography variant="h5" className="text-yellow-600 font-bold mb-2">
            Data Tidak Tersedia
          </Typography>
          <Typography className="text-yellow-800 mb-4">
            Belum ada detail data untuk laporan yang dipilih.
          </Typography>
          <Typography variant="small" className="text-yellow-700">
            Silakan pilih laporan lain atau tambahkan data APBDes melalui dashboard admin.
          </Typography>
        </CardBody>
      </Card>
    );
  }

  // Get selected laporan info
  const selectedLaporan = availableLaporan.find(l => l.id === selectedLaporanId);

  // Chart data preparation
  const overviewChartData = {
    labels: currentLaporanData.by_tipe.map(item => 
      item.tipe.charAt(0).toUpperCase() + item.tipe.slice(1)
    ),
    datasets: [
      {
        label: 'Anggaran',
        data: currentLaporanData.by_tipe.map(item => item.total_anggaran),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Realisasi',
        data: currentLaporanData.by_tipe.map(item => item.total_realisasi),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 8,
      }
    ],
  };

  const realisasiChartData = {
    labels: currentLaporanData.by_tipe.map(item => 
      item.tipe.charAt(0).toUpperCase() + item.tipe.slice(1)
    ),
    datasets: [{
      label: 'Realisasi (%)', // Added label for better tooltip
      data: currentLaporanData.by_tipe.map(item => Number(item.persentase)),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)',  // Belanja (Red)
        'rgba(234, 179, 8, 0.8)',  // Pembiayaan (Yellow)
      ],
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 15,
    }],
  };

  // Comparison chart data
  const comparisonChartData = allYearsData.length > 0 ? {
    labels: allYearsData.map(item => `${item.nama}\n(${item.tahun})`),
    datasets: [
      {
        label: 'Pendapatan',
        data: allYearsData.map(item => item.pendapatan),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Belanja',
        data: allYearsData.map(item => item.belanja),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Pembiayaan',
        data: allYearsData.map(item => item.pembiayaan),
        borderColor: 'rgba(234, 179, 8, 1)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ],
  } : null;

  const comparisonBarChartData = allYearsData.length > 0 ? {
    labels: allYearsData.map(item => `${item.nama}\n(${item.tahun})`),
    datasets: [
      {
        label: 'Total Anggaran',
        data: allYearsData.map(item => item.total_anggaran),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: 'Total Realisasi',
        data: allYearsData.map(item => item.total_realisasi),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 6,
      }
    ],
  } : null;

  return (
    <div className="space-y-6 p-4">
      {/* Header dengan Laporan Selector */}
      
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Typography variant="h4" className="font-bold">
                Laporan APBDes
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <Typography variant="h6" className="text-gray-700">
                Pilih Laporan:
              </Typography>
              <select 
                value={selectedLaporanId || ''}
                onChange={(e) => setSelectedLaporanId(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[250px]"
              >
                {availableLaporan.length > 0 ? (
                  availableLaporan.map(laporan => (
                    <option key={laporan.id} value={laporan.id}>
                      {/* ✅ FIX: Render Nama Laporan + Tahun */}
                      {String(laporan.nama_laporan || 'Laporan')} ({String(laporan.tahun || 'N/A')})
                    </option>
                  ))
                ) : (
                  <option value="">Tidak ada laporan</option>
                )}
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-lg transition-shadow">
          <CardBody className="text-white">
            <Typography variant="h6" className="opacity-90 mb-2">
              Total Anggaran
            </Typography>
            <Typography variant="h4" className="font-bold">
              {/* ✅ FIX: Pastikan value ada sebelum format */}
              {formatCurrency(currentLaporanData?.summary?.total_anggaran || 0)}
            </Typography>
            <Typography variant="small" className="opacity-80 mt-2">
              {/* ✅ FIX: Render string saja */}
              {String(selectedLaporan?.nama || 'Laporan')}
            </Typography>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 hover:shadow-lg transition-shadow">
          <CardBody className="text-white">
            <Typography variant="h6" className="opacity-90 mb-2">
              Total Realisasi
            </Typography>
            <Typography variant="h4" className="font-bold">
              {formatCurrency(currentLaporanData?.summary?.total_realisasi || 0)}
            </Typography>
            <Typography variant="small" className="opacity-80 mt-2">
              {/* ✅ FIX: Render persentase sebagai string */}
              {currentLaporanData?.summary?.persentase_realisasi || 0}% dari anggaran
            </Typography>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 hover:shadow-lg transition-shadow">
          <CardBody className="text-white">
            <Typography variant="h6" className="opacity-90 mb-2">
              Persentase Realisasi
            </Typography>
            <Typography variant="h4" className="font-bold">
              {currentLaporanData?.summary?.persentase_realisasi || 0}%
            </Typography>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-3">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${currentLaporanData?.summary?.persentase_realisasi || 0}%` }}
              ></div>
            </div>
          </CardBody>
        </Card>
      </div>

       {/* Realisasi Chart */}
      <Card>
        <CardBody>
          <Typography variant="h5" className="mb-4">
            {/* ✅ FIX: Render nama sebagai string */}
            Persentase Realisasi per Kategori - {String(selectedLaporan?.nama || 'Laporan')}
          </Typography>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
              <Doughnut 
                data={realisasiChartData} 
                options={{
                  ...defaultOptions,
                  plugins: {
                    ...defaultOptions.plugins,
                    tooltip: {
                      ...defaultOptions.plugins.tooltip,
                      callbacks: {
                        // FIX: Change label callback for percentage chart
                        label: function(context) {
                          let label = context.label || context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          label += `${context.parsed.toFixed(1)}%`;
                          return label;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
            <div className="space-y-4">
              {currentLaporanData.by_tipe.map((tipe) => (
                <Card key={tipe.tipe} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                  <CardBody>
                    <div className="flex justify-between items-center mb-3">
                      <Typography variant="h6" className="capitalize font-bold">
                        {tipe.tipe || 'Kategori'}
                      </Typography>
                      <Typography
                        variant="h5"
                        className={`font-bold ${
                          parseFloat(tipe.persentase) >= 85
                            ? 'text-green-600'
                            : parseFloat(tipe.persentase) >= 70
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {parseFloat(tipe.persentase || 0).toFixed(1)}%
                      </Typography>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            parseFloat(tipe.persentase) >= 85
                              ? 'bg-green-500'
                              : parseFloat(tipe.persentase) >= 70
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${parseFloat(tipe.persentase || 0)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>Realisasi: {formatCurrency(tipe.total_realisasi || 0)}</span>
                        <span>•</span>
                        <span>Anggaran: {formatCurrency(tipe.total_anggaran || 0)}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Detail Tables */}
      <Card>
        <CardBody>
          <Typography variant="h5" className="mb-6">
            {/* ✅ FIX: Render string */}
            Detail Anggaran dan Realisasi - {String(selectedLaporan?.nama || 'Laporan')}
          </Typography>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currentLaporanData.by_tipe.map((tipe) => (
              <Card key={tipe.tipe} className="border hover:shadow-md transition-shadow">
                <CardBody>
                  <div className="flex items-center justify-between mb-4">
                    <Typography variant="h6" className="capitalize font-bold">
                      {/* ✅ FIX: Pastikan tipe adalah string */}
                      {tipe.tipe || 'Kategori'}
                    </Typography>
                    <Typography
                      variant="small"
                      className={`font-bold px-2 py-1 rounded ${
                        parseFloat(tipe.persentase) >= 85
                          ? 'bg-green-100 text-green-800'
                          : parseFloat(tipe.persentase) >= 70
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {/* ✅ FIX: Convert to number then format */}
                      {parseFloat(tipe.persentase || 0).toFixed(1)}%
                    </Typography>
                  </div>
                  <div className="space-y-3">
                    {tipe.details && tipe.details.length > 0 ? (
                      tipe.details.map((detail, idx) => {
                        const persentaseDetail = detail.anggaran > 0 
                          ? (detail.realisasi / detail.anggaran) * 100 
                          : 0;
                        return (
                          <div key={idx} className="flex justify-between items-center py-2 border-b">
                            <div className="flex-1">
                              <Typography variant="small" className="font-medium text-gray-800">
                                {/* ✅ FIX: Render uraian sebagai string */}
                                {String(detail.uraian || 'Tidak ada uraian')}
                              </Typography>
                              <div className="flex space-x-3 text-xs text-gray-600 mt-1">
                                <span>A: {formatCurrency(detail.anggaran || 0)}</span>
                                <span>R: {formatCurrency(detail.realisasi || 0)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Typography
                                variant="small"
                                className={`font-bold ${
                                  persentaseDetail >= 85
                                    ? 'text-green-600'
                                    : persentaseDetail >= 70
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {persentaseDetail.toFixed(1)}%
                              </Typography>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <Typography variant="small" className="text-gray-500 text-center py-4">
                        Belum ada detail
                      </Typography>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

     

      {/* Perbandingan Semua Laporan */}
      {!loadingComparison && allYearsData.length > 1 && (
        <>
          <Card>
            <CardBody>
              <Typography variant="h5" className="mb-6">
                Perbandingan Semua Laporan APBDes
              </Typography>
              
             

              {/* Line Chart */}
              <div className="mb-8">
                <Typography variant="h6" className="mb-4">
                  Tren Pendapatan, Belanja & Pembiayaan
                </Typography>
                <div className="h-96">
                  <Line 
                    data={comparisonChartData} 
                    options={{
                      ...defaultOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: 'rgba(0, 0, 0, 0.05)' },
                          ticks: {
                            font: { size: 11 },
                            callback: (value) => formatCurrency(value),
                          },
                        },
                        x: {
                          grid: { display: false },
                          ticks: {
                            font: { size: 10, weight: 'bold' },
                            maxRotation: 45,
                            minRotation: 45,
                          }
                        },
                      },
                    }} 
                  />
                </div>
              </div>

             
              
              
              {/* Tabel Perbandingan - UPDATED */}
              <div className="mb-8">
                <Typography variant="h6" className="mb-4">
                  Data Perbandingan Detail Semua Laporan
                </Typography>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left border font-semibold" rowSpan="2">Nama Laporan</th>
                        <th className="px-4 py-3 text-center border font-semibold" rowSpan="2">Tahun</th>
                        <th className="px-4 py-3 text-center border font-semibold" colSpan="3">Sumber Dana</th>
                        <th className="px-4 py-3 text-center border font-semibold " colSpan="2">Pendapatan & Pembiayaan</th>
                        <th className="px-4 py-3 text-center border font-semibold " colSpan="2">Belanja</th>
                      </tr>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-right border font-semibold">Pendapatan</th>
                        <th className="px-4 py-3 text-right border font-semibold">Belanja</th>
                        <th className="px-4 py-3 text-right border font-semibold">Pembiayaan</th>
                        <th className="px-4 py-3 text-right border font-semibold">Total Anggaran</th>
                        <th className="px-4 py-3 text-right border font-semibold ">Realisasi (%)</th>
                        <th className="px-4 py-3 text-right border font-semibold">Total Anggaran</th>
                        <th className="px-4 py-3 text-right border font-semibold ">Realisasi (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allYearsData.map((item, idx) => (
                        <tr 
                          key={`laporan-${item.id}-${idx}`}
                          className={`
                            ${item.id === selectedLaporanId ? 'bg-blue-50 font-medium' : ''} 
                            ${idx % 2 === 0 ? 'bg-gray-25' : 'bg-white'}
                            hover:bg-blue-50 transition-colors
                          `}
                        >
                          {/* Nama Laporan */}
                          <td className="px-4 py-3 border font-semibold">
                            {String(item.nama || 'Laporan')}
                            
                          </td>
                          
                          {/* Tahun */}
                          <td className="px-4 py-3 border text-center">
                            {String(item.tahun || 'N/A')}
                          </td>
                          
                          {/* Detail Sumber Dana */}
                          <td className="px-4 py-3 border text-right">
                            {formatCurrency(Number(item.pendapatan) || 0)}
                          </td>
                          <td className="px-4 py-3 border text-right">
                            {formatCurrency(Number(item.belanja) || 0)}
                          </td>
                          <td className="px-4 py-3 border text-right">
                            {formatCurrency(Number(item.pembiayaan) || 0)}
                          </td>
                          
                          {/* Total Anggaran Pendapatan (Pendapatan + Pembiayaan) */}
                          <td className="px-4 py-3 border text-right font-semibold ">
                            {formatCurrency(Number(item.total_anggaran_pendapatan) || 0)}
                          </td>
                          
                          {/* Realisasi Pendapatan */}
                          <td className="px-4 py-3 border text-right ">
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-gray-600">
                                {formatCurrency(Number(item.total_realisasi_pendapatan) || 0)}
                              </span>
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mt-1 ${
                                parseFloat(item.persentase_realisasi_pendapatan) >= 85
                                  ? 'bg-green-600 text-white'
                                  : parseFloat(item.persentase_realisasi_pendapatan) >= 70
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-red-600 text-white'
                              }`}>
                                {parseFloat(item.persentase_realisasi_pendapatan || 0).toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          
                          {/* Total Anggaran Belanja */}
                          <td className="px-4 py-3 border text-right font-semibold ">
                            {formatCurrency(Number(item.total_anggaran_belanja) || 0)}
                          </td>
                          
                          {/* Realisasi Belanja */}
                          <td className="px-4 py-3 border text-right ">
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-gray-600">
                                {formatCurrency(Number(item.total_realisasi_belanja) || 0)}
                              </span>
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mt-1 ${
                                parseFloat(item.persentase_realisasi_belanja) >= 85
                                  ? 'bg-green-600 text-white'
                                  : parseFloat(item.persentase_realisasi_belanja) >= 70
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-red-600 text-white'
                              }`}>
                                {parseFloat(item.persentase_realisasi_belanja || 0).toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-bold">
                        <td className="px-4 py-3 border" colSpan="2">RATA-RATA</td>
                        <td className="px-4 py-3 border text-right">
                          {formatCurrency(allYearsData.reduce((sum, item) => sum + (Number(item.pendapatan) || 0), 0) / allYearsData.length)}
                        </td>
                        <td className="px-4 py-3 border text-right">
                          {formatCurrency(allYearsData.reduce((sum, item) => sum + (Number(item.belanja) || 0), 0) / allYearsData.length)}
                        </td>
                        <td className="px-4 py-3 border text-right">
                          {formatCurrency(allYearsData.reduce((sum, item) => sum + (Number(item.pembiayaan) || 0), 0) / allYearsData.length)}
                        </td>
                        
                        {/* Rata-rata Total Anggaran Pendapatan */}
                        <td className="px-4 py-3 border text-right ">
                          {formatCurrency(allYearsData.reduce((sum, item) => sum + (Number(item.total_anggaran_pendapatan) || 0), 0) / allYearsData.length)}
                        </td>
                        
                        {/* Rata-rata Persentase Realisasi Pendapatan */}
                        <td className="px-4 py-3 border text-center ">
                          {(allYearsData.reduce((sum, item) => sum + (parseFloat(item.persentase_realisasi_pendapatan) || 0), 0) / allYearsData.length).toFixed(1)}%
                        </td>
                        
                        {/* Rata-rata Total Anggaran Belanja */}
                        <td className="px-4 py-3 border text-right ">
                          {formatCurrency(allYearsData.reduce((sum, item) => sum + (Number(item.total_anggaran_belanja) || 0), 0) / allYearsData.length)}
                        </td>
                        
                        {/* Rata-rata Persentase Realisasi Belanja */}
                        <td className="px-4 py-3 border text-center ">
                          {(allYearsData.reduce((sum, item) => sum + (parseFloat(item.persentase_realisasi_belanja) || 0), 0) / allYearsData.length).toFixed(1)}%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Summary Stats Cards - FIX */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardBody>
                    <Typography variant="small" className="text-gray-600 mb-1">
                      Anggaran Tertinggi
                    </Typography>
                    <Typography variant="h6" className="font-bold text-blue-600">
                      {/* ✅ FIX: Safe access dan convert to string */}
                      {String(allYearsData.reduce((max, item) => 
                        (Number(item.total_anggaran) || 0) > (Number(max.total_anggaran) || 0) ? item : max, 
                        allYearsData[0] || { nama: 'N/A', total_anggaran: 0 } // Safe default
                      )?.nama || 'N/A')}
                    </Typography>
                    <Typography variant="small" className="text-gray-500">
                      {formatCurrency(Math.max(...allYearsData.map(i => Number(i.total_anggaran) || 0)))}
                    </Typography>
                  </CardBody>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardBody>
                    <Typography variant="small" className="text-gray-600 mb-1">
                      Realisasi Terbaik
                    </Typography>
                    <Typography variant="h6" className="font-bold text-green-600">
                      {/* ✅ FIX: Safe access dan convert to string */}
                      {String(allYearsData.reduce((max, item) => 
                        (parseFloat(item.persentase_realisasi) || 0) > (parseFloat(max.persentase_realisasi) || 0) ? item : max, 
                        allYearsData[0] || { nama: 'N/A', persentase_realisasi: 0 } // Safe default
                      )?.nama || 'N/A')}
                    </Typography>
                    <Typography variant="small" className="text-gray-500">
                      {Math.max(...allYearsData.map(i => parseFloat(i.persentase_realisasi) || 0)).toFixed(1)}%
                    </Typography>
                  </CardBody>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardBody>
                    <Typography variant="small" className="text-gray-600 mb-1">
                      Total Laporan
                    </Typography>
                    <Typography variant="h6" className="font-bold text-yellow-600">
                      {/* ✅ FIX: Explicit number */}
                      {Number(allYearsData.length)} Laporan
                    </Typography>
                    <Typography variant="small" className="text-gray-500">
                      Tersedia
                    </Typography>
                  </CardBody>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardBody>
                    <Typography variant="small" className="text-gray-600 mb-1">
                      Periode
                    </Typography>
                    <Typography variant="h6" className="font-bold text-red-600">
                      {/* ✅ FIX: Get min/max year safely */}
                      {(() => {
                        const tahunValues = allYearsData.map(i => Number(i.tahun) || new Date().getFullYear());
                        if (tahunValues.length === 0) return 'N/A';
                        const minTahun = Math.min(...tahunValues);
                        const maxTahun = Math.max(...tahunValues);
                        return `${minTahun} - ${maxTahun}`;
                      })()}
                    </Typography>
                    <Typography variant="small" className="text-gray-500">
                      Rentang Tahun
                    </Typography>
                  </CardBody>
                </Card>
              </div>
            </CardBody>
          </Card>
        </>
      )}

      {/* Loading State untuk Perbandingan */}
      {loadingComparison && (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <Typography className="mt-4 text-gray-600">
                Memuat data perbandingan...
              </Typography>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default ApbdesCharts;