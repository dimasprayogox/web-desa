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
  // ✅ Gunakan useStats untuk summary cards (data tahun aktif)
  const { stats, loading: statsLoading, error: statsError } = useStats();
  
  // ✅ Gunakan useDemografi untuk data chart detail (TANPA parameter tahun - otomatis pakai tahun aktif)
  const { data, loading: demografiLoading, error: demografiError, refetch } = useDemografi();

  // Combined loading state
  const loading = statsLoading || demografiLoading;
  const error = statsError || demografiError;

  // Loading State
  if (loading) {
    return (
      <div className="p-4 space-y-8 min-h-screen bg-gray-50">
        <div className="text-center py-8">
          <Typography variant="h4" className="text-gray-600 mb-2">
            Memuat data demografi...
          </Typography>
        </div>
        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardBody>
                <div className="h-10 bg-gray-200 rounded mb-3"></div>
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
            <Typography variant="h4" className="text-red-600 font-bold mb-3">
              Gagal Memuat Data
            </Typography>
            <Typography variant="paragraph" className="text-red-800 mb-4">
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

  // Check if data exists
  if (!data) {
    return (
      <div className="p-4 min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="bg-yellow-50 max-w-md">
          <CardBody className="text-center">
            <Typography variant="h4" className="text-yellow-600 font-bold mb-3">
              Data Tidak Tersedia
            </Typography>
            <Typography variant="paragraph" className="text-yellow-800 mb-4">
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
          weight: '600',
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
    
    const label = String(groupLabel).toLowerCase();
    
    if (label === '0_5') return 'Balita';
    if (label === '6_12') return 'Anak-anak';
    if (label === '13_17') return 'Remaja';
    if (label === '18_40') return 'Dewasa';
    if (label === '41_plus' || label.includes('plus') || label.includes('+')) return 'Lansia';
    
    if (label.includes('-')) {
      const parts = label.split('-');
      const minAge = parseInt(parts[0]);
      
      if (isNaN(minAge)) return 'Lainnya';

      if (minAge <= 5) return 'Balita';
      if (minAge >= 6 && minAge <= 12) return 'Anak-anak';
      if (minAge >= 13 && minAge <= 17) return 'Remaja';
      if (minAge >= 18 && minAge <= 40) return 'Dewasa';
      if (minAge >= 41) return 'Lansia';
    }

    return 'Lainnya';
  };

  const aggregatedAgeData = (data?.by_kelompok_umur || []).reduce((acc, item) => {
    const labelKey = item.kelompok_umur || item['kelompok umur'] || item.key || '';
    const category = getAgeCategory(labelKey);

    if (!acc[category]) acc[category] = { laki_laki: 0, perempuan: 0 };

    const lakiLaki = Number(item.l || item.laki_laki || item['laki-laki'] || 0);
    const perempuan = Number(item.p || item.perempuan || 0);

    acc[category].laki_laki += lakiLaki;
    acc[category].perempuan += perempuan;

    return acc;
  }, {});

  const ageGroupLabels = ['Balita', 'Anak-anak', 'Remaja', 'Dewasa', 'Lansia'];

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
        ticks: { font: { size: 12 }, padding: 6 },
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
        'rgba(101, 245, 68, 0.8)',
        'rgba(83, 218, 60, 0.8)',
        'rgba(69, 191, 52, 0.8)',
        'rgba(57, 165, 44, 0.8)',
        'rgba(46, 140, 37, 0.8)',
        'rgba(35, 116, 30, 0.8)',
        'rgba(26, 94, 24, 0.8)',
        'rgba(16, 73, 17, 0.8)',
      ],
    }],
  };

  const educationOptions = {
    ...defaultOptions,
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(0, 0, 0, 0.05)' }, 
        ticks: { font: { size: 12 } } 
      },
      x: { 
        grid: { display: false }, 
        ticks: { font: { size: 11 }, maxRotation: 45, minRotation: 45 } 
      },
    },
  };

  // Dusun Chart
  const dusunData = data?.by_dusun || [];
  const dusunChartData = {
    labels: dusunData.map(item => item.dusun),
    datasets: [{
      data: dusunData.map(item => item.total),
      backgroundColor: [
        'rgba(37, 143, 39, 1)',
        'rgba(64, 215, 67, 1)',
        'rgba(75, 255, 78, 1)',
      ],
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 15,
    }],
  };

  // ✅ Gunakan stats.penduduk untuk persentase (SAMA SEPERTI summary cards)
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
        'rgba(101, 245, 68, 0.8)',
        'rgba(76, 217, 89, 0.8)',
        'rgba(54, 190, 95, 0.8)',
        'rgba(42, 168, 100, 0.8)',
        'rgba(32, 148, 95, 0.8)',
        'rgba(22, 128, 80, 0.8)',
        'rgba(16, 110, 70, 0.8)',
        'rgba(12, 90, 55, 0.8)',
        'rgba(8, 72, 40, 0.8)',
        'rgba(4, 52, 26, 0.8)',
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
        'rgba(101, 245, 68, 0.8)',
        'rgba(76, 217, 89, 0.8)',
        'rgba(255, 206, 84, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(201, 203, 207, 0.8)',
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
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(236, 72, 153, 0.8)',
      ],
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 15,
    }],
  };

  return (
    <div className="p-4 space-y-8 min-h-screen font-sans">
      {/* ✅ Summary Cards - Menggunakan stats dari useStats (tahun aktif) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-xl transition-shadow">
          <CardBody className="text-white">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h2" className="font-bold mb-2">
                  {statsLoading ? "..." : stats.penduduk.toLocaleString("id-ID")}
                </Typography>
                <Typography variant="h6" className="opacity-90 font-medium">
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
                <Typography variant="h2" className="font-bold mb-2">
                  {statsLoading ? "..." : stats.kk.toLocaleString("id-ID")}
                </Typography>
                <Typography variant="h6" className="opacity-90 font-medium">
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
                <Typography variant="h2" className="font-bold mb-2">
                  {statsLoading ? "..." : stats.laki_laki.toLocaleString("id-ID")}
                </Typography>
                <Typography variant="h6" className="opacity-90 font-medium">
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
                <Typography variant="h2" className="font-bold mb-2">
                  {statsLoading ? "..." : stats.perempuan.toLocaleString("id-ID")}
                </Typography>
                <Typography variant="h6" className="opacity-90 font-medium">
                  Perempuan
                </Typography>
              </div>
              <UsersIcon className="h-12 w-12 opacity-50" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ✅ Age Distribution Chart - Data dari tahun aktif */}
      <Card className="hover:shadow-xl transition-all duration-300 mb-8">
        <CardBody>
          <div className="flex items-center gap-2 mb-6">
            <Typography variant="h4" className="font-bold text-gray-800">
              Distribusi Kelompok Usia
            </Typography>
          </div>
          <div className="h-60 flex items-center justify-center">
            <Bar data={aggregatedAgeChartData} options={aggregatedAgeOptions} />
          </div>
        </CardBody>
      </Card>

      {/* ✅ Dusun Distribution - Data dari tahun aktif */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="hover:shadow-xl transition-all duration-300">
          <CardBody>
            <div className="flex items-center gap-2 mb-6">
              <HomeIcon className="h-6 w-6 text-green-600" /> 
              <Typography variant="h4" className="font-bold text-gray-800">
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
            <div className="mb-12">
              <Typography variant="h4" className="font-bold text-gray-800 mb-4">
                Distribusi Persentase Populasi per Dusun
              </Typography>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6">
              <ul className="space-y-4">
                {dusunPercentages.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-4 h-3 w-3 rounded-full bg-green-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <Typography variant="h4" className="font-semibold text-gray-800">
                          {item.dusun}
                        </Typography>
                        <Typography variant="h4" className="font-semibold text-green-600">
                          {item.percentage}%
                        </Typography>
                      </div>
                      <Typography variant="small" className="text-gray-600">
                        {item.total} jiwa
                      </Typography>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ✅ Education Level - Data dari tahun aktif */}
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardBody>
          <div className="flex items-center gap-2 mb-6">
            <AcademicCapIcon className="h-6 w-6 text-green-600" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Tingkat Pendidikan
            </Typography>
          </div>
          <div className="h-80 flex items-center justify-center">
            <Bar data={educationChartData} options={educationOptions} />
          </div>
        </CardBody>
      </Card>

      {/* ✅ Occupation & Religion - Data dari tahun aktif */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300">
          <CardBody>
            <div className="flex items-center gap-2 mb-6">
              <BriefcaseIcon className="h-6 w-6 text-green-600" />
              <Typography variant="h4" className="font-bold text-gray-800">
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
            <div className="flex items-center gap-2 mb-6">
              <BuildingLibraryIcon className="h-6 w-6 text-green-600" />
              <Typography variant="h4" className="font-bold text-gray-800">
                Distribusi Agama
              </Typography>
            </div>
            <div className="h-80 flex items-center justify-center">
              <Pie data={religionChartData} options={defaultOptions} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ✅ Marriage Status - Data dari tahun aktif */}
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardBody>
          <div className="flex items-center gap-2 mb-6">
            <HeartIcon className="h-6 w-6 text-green-600" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Status Perkawinan
            </Typography>
          </div>
          <div className="h-80 flex items-center justify-center">
            <Pie data={marriageChartData} options={defaultOptions} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default DemografiCharts;