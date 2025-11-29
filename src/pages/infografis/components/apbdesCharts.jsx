import { useState } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
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
import { useApbdes } from '@/hooks/useApbdes';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Use custom hook
  const { data, loading, error, availableYears, refetch } = useApbdes(selectedYear);

  // 🔍 DEBUG LOGS
  console.group('=== APBDES CHARTS DEBUG ===');
  console.log('📊 Loading:', loading);
  console.log('❌ Error:', error);
  console.log('📅 Available Years:', availableYears);
  console.log('📅 Selected Year:', selectedYear);
  console.log('📈 Data:', data);
  console.groupEnd();

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
            family: "'Inter', sans-serif",
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
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardBody>
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded mt-6"></div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <Card className="bg-red-50">
        <CardBody className="text-center">
          <svg 
            className="w-16 h-16 mx-auto mb-4 text-red-500"
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
          <Typography variant="h5" className="text-red-600 font-bold mb-2">
            Gagal Memuat Data
          </Typography>
          <Typography className="text-red-800 mb-4">
            {error}
          </Typography>
          <button
            onClick={refetch}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Coba Lagi
          </button>
        </CardBody>
      </Card>
    );
  }

  // No Data State
  if (!data || !data.by_tipe || data.by_tipe.length === 0) {
    return (
      <Card className="bg-yellow-50">
        <CardBody className="text-center">
          <Typography variant="h5" className="text-yellow-600 font-bold mb-2">
            Data Tidak Tersedia
          </Typography>
          <Typography className="text-yellow-800 mb-4">
            Belum ada data APBDes untuk tahun {selectedYear}.
          </Typography>
          <button
            onClick={refetch}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Muat Ulang
          </button>
        </CardBody>
      </Card>
    );
  }

  // Chart data preparation
  const overviewChartData = {
    labels: data.by_tipe.map(item => 
      item.tipe.charAt(0).toUpperCase() + item.tipe.slice(1)
    ),
    datasets: [
      {
        label: 'Anggaran',
        data: data.by_tipe.map(item => item.total_anggaran),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Realisasi',
        data: data.by_tipe.map(item => item.total_realisasi),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 8,
      }
    ],
  };

  const realisasiChartData = {
    labels: data.by_tipe.map(item => 
      item.tipe.charAt(0).toUpperCase() + item.tipe.slice(1)
    ),
    datasets: [{
      data: data.by_tipe.map(item => item.persentase),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(234, 179, 8, 0.8)',
      ],
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 15,
    }],
  };

  const comparisonChartData = data.yearly_comparison && data.yearly_comparison.length > 0 ? {
    labels: data.yearly_comparison.map(item => item.tahun),
    datasets: [
      {
        label: 'Pendapatan',
        data: data.yearly_comparison.map(item => item.pendapatan),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Belanja',
        data: data.yearly_comparison.map(item => item.belanja),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Pembiayaan',
        data: data.yearly_comparison.map(item => item.pembiayaan),
        borderColor: 'rgba(234, 179, 8, 1)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  } : null;

  return (
    <div className="space-y-6">
      {/* Header dengan Year Selector */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Typography variant="h4" className="font-bold">
              Laporan APBDes
            </Typography>
            <div className="flex items-center gap-3">
              <Typography variant="h6" className="text-gray-700">
                Tahun:
              </Typography>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {availableYears.length > 0 ? (
                  availableYears.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))
                ) : (
                  <option value={selectedYear}>{selectedYear}</option>
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
              {formatCurrency(data.summary.total_anggaran)}
            </Typography>
            <Typography variant="small" className="opacity-80 mt-2">
              Tahun {selectedYear}
            </Typography>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 hover:shadow-lg transition-shadow">
          <CardBody className="text-white">
            <Typography variant="h6" className="opacity-90 mb-2">
              Total Realisasi
            </Typography>
            <Typography variant="h4" className="font-bold">
              {formatCurrency(data.summary.total_realisasi)}
            </Typography>
            <Typography variant="small" className="opacity-80 mt-2">
              {data.summary.persentase_realisasi}% dari anggaran
            </Typography>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 hover:shadow-lg transition-shadow">
          <CardBody className="text-white">
            <Typography variant="h6" className="opacity-90 mb-2">
              Persentase Realisasi
            </Typography>
            <Typography variant="h4" className="font-bold">
              {data.summary.persentase_realisasi}%
            </Typography>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-3">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${data.summary.persentase_realisasi}%` }}
              ></div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardBody>
          <div className="flex space-x-4 mb-6 border-b">
            {['overview', 'realisasi', 'perbandingan'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'realisasi' && 'Realisasi'}
                {tab === 'perbandingan' && 'Perbandingan Tahun'}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <Typography variant="h5" className="mb-4">
                Perbandingan Anggaran vs Realisasi {selectedYear}
              </Typography>
              <div className="h-80">
                <Bar 
                  data={overviewChartData} 
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
                      },
                    },
                  }} 
                />
              </div>

              {/* Detail Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {data.by_tipe.map((tipe) => (
                  <Card key={tipe.tipe} className="border hover:shadow-md transition-shadow">
                    <CardBody>
                      <div className="flex items-center justify-between mb-4">
                        <Typography variant="h6" className="capitalize font-bold">
                          {tipe.tipe}
                        </Typography>
                        <Typography
                          variant="small"
                          className={`font-bold px-2 py-1 rounded ${
                            tipe.persentase >= 85
                              ? 'bg-green-100 text-green-800'
                              : tipe.persentase >= 70
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {tipe.persentase}%
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
                                    {detail.uraian}
                                  </Typography>
                                  <div className="flex space-x-3 text-xs text-gray-600 mt-1">
                                    <span>A: {formatCurrency(detail.anggaran)}</span>
                                    <span>•</span>
                                    <span>R: {formatCurrency(detail.realisasi)}</span>
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
            </div>
          )}

          {/* Realisasi Tab */}
          {activeTab === 'realisasi' && (
            <div className="space-y-6">
              <Typography variant="h5" className="mb-4">
                Persentase Realisasi per Kategori {selectedYear}
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
                            label: function(context) {
                              return `${context.label}: ${context.parsed}%`;
                            }
                          }
                        }
                      }
                    }} 
                  />
                </div>
                <div className="space-y-4">
                  {data.by_tipe.map((tipe) => (
                    <Card key={tipe.tipe} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                      <CardBody>
                        <div className="flex justify-between items-center mb-3">
                          <Typography variant="h6" className="capitalize font-bold">
                            {tipe.tipe}
                          </Typography>
                          <Typography
                            variant="h5"
                            className={`font-bold ${
                              tipe.persentase >= 85
                                ? 'text-green-600'
                                : tipe.persentase >= 70
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {tipe.persentase}%
                          </Typography>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${
                                tipe.persentase >= 85
                                  ? 'bg-green-500'
                                  : tipe.persentase >= 70
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${tipe.persentase}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>Realisasi: {formatCurrency(tipe.total_realisasi)}</span>
                            <span>Anggaran: {formatCurrency(tipe.total_anggaran)}</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Perbandingan Tahun Tab */}
          {activeTab === 'perbandingan' && comparisonChartData && (
            <div className="space-y-6">
              <Typography variant="h5" className="mb-4">
                Perbandingan APBDes 4 Tahun Terakhir
              </Typography>
              <div className="h-80">
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
                      },
                    },
                  }} 
                />
              </div>
              
              {/* Tabel Perbandingan */}
              <Card>
                <CardBody>
                  <Typography variant="h6" className="mb-4">
                    Data Perbandingan Tahunan
                  </Typography>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left border">Tahun</th>
                          <th className="px-4 py-2 text-right border">Pendapatan</th>
                          <th className="px-4 py-2 text-right border">Belanja</th>
                          <th className="px-4 py-2 text-right border">Pembiayaan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.yearly_comparison.map((item) => (
                          <tr key={item.tahun} className={item.tahun === selectedYear ? 'bg-blue-50' : ''}>
                            <td className="px-4 py-2 border font-medium">{item.tahun}</td>
                            <td className="px-4 py-2 border text-right">{formatCurrency(item.pendapatan)}</td>
                            <td className="px-4 py-2 border text-right">{formatCurrency(item.belanja)}</td>
                            <td className="px-4 py-2 border text-right">{formatCurrency(item.pembiayaan)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default ApbdesCharts;