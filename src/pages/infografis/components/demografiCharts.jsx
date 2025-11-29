import { Card, CardBody, Typography } from "@material-tailwind/react";
import {
  UserGroupIcon,
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  HeartIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/solid";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

// Import custom hooks
import { useStats } from '@/hooks/useStats';
import { useDemografi } from '@/hooks/useDemografi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

export function DemografiCharts() {
  // Gunakan useStats untuk summary (SAMA SEPERTI DI HeroSection.jsx)
  const { stats, loading: statsLoading, error: statsError } = useStats();
  
  // Gunakan useDemografi untuk data chart detail
  const { data, loading: demografiLoading, error: demografiError, refetch } = useDemografi();

  

  // Combined loading state
  const loading = statsLoading || demografiLoading;
  const error = statsError || demografiError;

  // Loading State
  if (loading) {
    return (
      <div className="p-4 space-y-8 min-h-screen bg-gray-50">
        <div className="text-center py-8">
          <Typography variant="h5" className="text-gray-600 mb-2">
            Memuat data demografi...
          </Typography>
        </div>
        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardBody>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-4 min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="bg-red-50 max-w-md">
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
            <Typography className="text-red-800 mb-2">
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
      </div>
    );
  }

  // 🔍 Check if data exists
  if (!data) {
    return (
      <div className="p-4 min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="bg-yellow-50 max-w-md">
          <CardBody className="text-center">
            <Typography variant="h5" className="text-yellow-600 font-bold mb-2">
              Data Tidak Tersedia
            </Typography>
            <Typography className="text-yellow-800 mb-4">
              Data demografi belum dimuat. Klik tombol di bawah untuk memuat ulang.
            </Typography>
            <button
              onClick={refetch}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Muat Data
            </button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Chart Options Template
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
          pointStyle: 'circle',
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
      }
    },
  };

  // Age Group Aggregation
  const getAgeCategory = (groupLabel) => {
    if (!groupLabel) return 'Lainnya';
    
    if (groupLabel.includes('+')) {
      return 'Lansia';
    }

    const parts = groupLabel.split('-');
    const minAge = parseInt(parts[0]);
    
    if (isNaN(minAge)) return 'Lainnya';

    if (minAge <= 4) return 'Balita';
    if (minAge >= 5 && minAge <= 12) return 'Anak-anak';
    if (minAge >= 13 && minAge <= 19) return 'Remaja';
    if (minAge >= 20 && minAge <= 59) return 'Dewasa';
    if (minAge >= 60) return 'Lansia';

    return 'Lainnya';
  };

  const aggregatedAgeData = (data?.by_kelompok_umur || []).reduce((acc, item) => {
    const labelKey = item.kelompok_umur || item['kelompok umur'] || '';
    const category = getAgeCategory(labelKey);

    if (!acc[category]) acc[category] = { laki_laki: 0, perempuan: 0 };

    acc[category].laki_laki += Number(item.laki_laki || 0);
    acc[category].perempuan += Number(item.perempuan || 0);

    return acc;
  }, {});

  const ageGroupLabels = ['Balita', 'Anak-anak', 'Remaja', 'Dewasa', 'Lansia'];

  // Aggregated Age Group Chart Data
  const aggregatedAgeChartData = {
    labels: ageGroupLabels,
    datasets: [
      {
        label: 'Laki-Laki',
        data: ageGroupLabels.map((label) => aggregatedAgeData[label]?.laki_laki || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderSkipped: false,
        borderRadius: { topLeft: 0, bottomLeft: 0, topRight: 10, bottomRight: 10 },
        barThickness: 20,
        maxBarThickness: 20,
      },
      {
        label: 'Perempuan',
        data: ageGroupLabels.map((label) => -(aggregatedAgeData[label]?.perempuan || 0)),
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 1,
        borderSkipped: false,
        borderRadius: { topLeft: 10, bottomLeft: 10, topRight: 0, bottomRight: 0 },
        barThickness: 20,
        maxBarThickness: 20,
      },
    ],
  };

  const aggregatedAgeOptions = {
    ...defaultOptions,
    indexAxis: 'y',
    maintainAspectRatio: false,
    layout: {
      padding: 0,
    },
    plugins: {
      ...defaultOptions.plugins,
      legend: {
        display: false,
      },
      tooltip: {
        ...defaultOptions.plugins.tooltip,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = Math.abs(context.raw || 0);
            return `${label}: ${value.toLocaleString('id-ID')}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: true, color: 'rgba(0,0,0,0.05)' },
        ticks: {
          font: { size: 11 },
          callback: (v) => Math.abs(Number(v || 0)).toLocaleString('id-ID'),
          padding: 6,
        },
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: { font: { size: 11 }, padding: 6 },
        categoryPercentage: 1,
        barPercentage: 1,
      },
    },
  };

  // Education Chart
  const educationChartData = {
    labels: data?.by_pendidikan?.map(item => item.tingkat_pendidikan) || [],
    datasets: [{
      label: 'Jumlah Penduduk',
      data: data?.by_pendidikan?.map(item => item.total) || [],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(234, 179, 8, 0.8)',
        'rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(99, 102, 241, 0.8)',
        'rgba(168, 85, 247, 0.8)', 'rgba(236, 72, 153, 0.8)',
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)', 'rgba(249, 115, 22, 1)', 'rgba(234, 179, 8, 1)',
        'rgba(34, 197, 94, 1)', 'rgba(59, 130, 246, 1)', 'rgba(99, 102, 241, 1)',
        'rgba(168, 85, 247, 1)', 'rgba(236, 72, 153, 1)',
      ],
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const educationOptions = {
    ...defaultOptions,
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 45 } },
    },
  };

  // Dusun Chart
  const dusunData = data?.by_dusun || [];
  const dusunChartData = {
    labels: dusunData.map(item => item.dusun),
    datasets: [{
      data: dusunData.map(item => item.total),
      backgroundColor: [
        'rgba(249, 115, 22, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ],
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 15,
    }],
  };

  // Use stats.penduduk for percentage calculation (SAMA SEPERTI DI HeroSection)
  const dusunPercentages = dusunData.map(item => ({
    dusun: item.dusun,
    percentage: ((item.total / (stats?.penduduk || 1)) * 100).toFixed(1),
    total: item.total.toLocaleString("id-ID"),
  }));

  // Occupation Chart
  const topOccupations = data?.by_pekerjaan?.slice(0, 10) || [];
  const occupationChartData = {
    labels: topOccupations.map(item => item.jenis_pekerjaan),
    datasets: [{
      data: topOccupations.map(item => item.total),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(234, 179, 8, 0.8)',
        'rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(99, 102, 241, 0.8)',
        'rgba(168, 85, 247, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(14, 165, 233, 0.8)',
        'rgba(20, 184, 166, 0.8)',
      ],
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 15,
    }],
  };

  const doughnutOptions = {
    ...defaultOptions,
    cutout: '60%',
    plugins: {
      ...defaultOptions.plugins,
      legend: { ...defaultOptions.plugins.legend, position: 'right' }
    }
  };

  // Religion Chart
  const religionData = data?.by_agama || [];
  const religionChartData = {
    labels: religionData.map(item => item.agama),
    datasets: [{
      data: religionData.map(item => item.total),
      backgroundColor: [
        'rgba(34, 197, 94, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(168, 85, 247, 0.7)',
        'rgba(249, 115, 22, 0.7)', 'rgba(234, 179, 8, 0.7)', 'rgba(236, 72, 153, 0.7)',
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  // Marriage Status Chart
  const marriageData = data?.by_status_perkawinan || [];
  const marriageChartData = {
    labels: marriageData.map(item => item.status_perkawinan),
    datasets: [{
      data: marriageData.map(item => item.total),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)', 'rgba(34, 197, 94, 0.8)',
        'rgba(249, 115, 22, 0.8)', 'rgba(239, 68, 68, 0.8)',
      ],
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 15,
    }],
  };

  return (
    <div className="p-4 space-y-8 min-h-screen bg-gray-50 font-sans">
      {/* Summary Cards - MENGGUNAKAN stats DARI useStats (SAMA SEPERTI HeroSection.jsx) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-xl transition-shadow">
          <CardBody className="text-white">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3" className="font-bold mb-1">
                  {statsLoading ? "..." : stats.penduduk.toLocaleString("id-ID")}
                </Typography>
                <Typography variant="small" className="opacity-80">
                  Total Penduduk
                </Typography>
              </div>
              <UserGroupIcon className="h-12 w-12 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 hover:shadow-xl transition-shadow">
          <CardBody className="text-white">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3" className="font-bold mb-1">
                  {statsLoading ? "..." : stats.kk.toLocaleString("id-ID")}
                </Typography>
                <Typography variant="small" className="opacity-80">
                  Kepala Keluarga
                </Typography>
              </div>
              <HomeIcon className="h-12 w-12 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 hover:shadow-xl transition-shadow">
          <CardBody className="text-white">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3" className="font-bold mb-1">
                  {statsLoading ? "..." : stats.laki_laki.toLocaleString("id-ID")}
                </Typography>
                <Typography variant="small" className="opacity-80">
                  Laki-Laki
                </Typography>
              </div>
              <UsersIcon className="h-12 w-12 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 hover:shadow-xl transition-shadow">
          <CardBody className="text-white">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3" className="font-bold mb-1">
                  {statsLoading ? "..." : stats.perempuan.toLocaleString("id-ID")}
                </Typography>
                <Typography variant="small" className="opacity-80">
                  Perempuan
                </Typography>
              </div>
              <UsersIcon className="h-12 w-12 opacity-50" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Age Distribution Chart */}
      <Card className="hover:shadow-xl transition-all duration-300 mb-8">
        <CardBody>
          <div className="flex items-center gap-2 mb-4">
            <Typography variant="h6" className="font-bold">
              Distribusi Kelompok Usia 
            </Typography>
          </div>
          <div className="h-60 flex items-center justify-center">
            <Bar data={aggregatedAgeChartData} options={aggregatedAgeOptions} />
          </div>
        </CardBody>
      </Card>

      {/* Dusun Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="hover:shadow-xl transition-all duration-300">
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <HomeIcon className="h-5 w-5 text-red-600" /> 
              <Typography variant="h6" className="font-bold">
                Populasi Berdasarkan Dusun
              </Typography>
            </div>
            <div className="h-80 flex items-center justify-center">
              <Pie data={dusunChartData} options={defaultOptions} />
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300">
          <CardBody>
            <Typography
              variant="small"
              className="uppercase tracking-[0.2em] text-indigo-500 font-semibold mb-1"
            >
              Ringkasan Populasi
            </Typography>

            <Typography
              variant="h5"
              className="mb-4 font-extrabold text-slate-800"
            >
              Distribusi Persentase Populasi per Dusun
            </Typography>

            <div className="bg-slate-50 rounded-2xl p-4">
              <ul className="space-y-2">
                {dusunPercentages.map((item, index) => (
                  <li key={index} className="flex items-baseline gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-sm font-semibold text-slate-800">
                          {item.dusun}
                        </span>
                        <span className="text-sm font-bold tracking-wide text-indigo-600">
                          {item.percentage}%
                        </span>
                      </div>
                      <span className="text-[0.75rem] text-slate-500">
                        {item.total} jiwa
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Education Level */}
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardBody>
          <div className="flex items-center gap-2 mb-4">
            <AcademicCapIcon className="h-5 w-5 text-green-600" />
            <Typography variant="h6" className="font-bold">
              Tingkat Pendidikan
            </Typography>
          </div>
          <div className="h-80 flex items-center justify-center">
            <Bar data={educationChartData} options={educationOptions} />
          </div>
        </CardBody>
      </Card>

      {/* Occupation & Religion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300">
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <BriefcaseIcon className="h-5 w-5 text-purple-600" />
              <Typography variant="h6" className="font-bold">
                Top 10 Pekerjaan
              </Typography>
            </div>
            <div className="h-80 flex items-center justify-center">
              <Doughnut data={occupationChartData} options={doughnutOptions} />
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300">
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <BuildingLibraryIcon className="h-5 w-5 text-orange-600" />
              <Typography variant="h6" className="font-bold">
                Distribusi Agama
              </Typography>
            </div>
            <div className="h-80 flex items-center justify-center">
              <Pie data={religionChartData} options={defaultOptions} />
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300">
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <HeartIcon className="h-5 w-5 text-pink-600" />
              <Typography variant="h6" className="font-bold">
                Status Perkawinan
              </Typography>
            </div>
            <div className="h-80 flex items-center justify-center">
              <Pie data={marriageChartData} options={defaultOptions} />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default DemografiCharts;