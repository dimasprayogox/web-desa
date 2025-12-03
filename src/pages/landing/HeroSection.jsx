import { Typography, Card, CardBody } from "@material-tailwind/react";
import { useStats } from "@/hooks/useStats";

export function HeroSection() {
  const { stats, loading, error } = useStats();

  // Buat array untuk display
  const statsDisplay = [
    { 
      value: loading ? "..." : stats.penduduk.toLocaleString("id-ID"), 
      label: "Total Penduduk",
      key: "penduduk",
      hoverColor: "blue-600",
      hoverBg: "blue-50"
    },
    { 
      value: loading ? "..." : stats.kk.toLocaleString("id-ID"), 
      label: "Kepala Keluarga",
      key: "kk",
      hoverColor: "green-600",
      hoverBg: "green-50"
    },
    { 
      value: loading ? "..." : stats.laki_laki.toLocaleString("id-ID"), 
      label: "Laki-Laki",
      key: "laki_laki",
      hoverColor: "gray-900",
      hoverBg: "gray-700"
    },
    { 
      value: loading ? "..." : stats.perempuan.toLocaleString("id-ID"), 
      label: "Perempuan",
      key: "perempuan",
      hoverColor: "red-600",
      hoverBg: "red-50"
    },
  ];

  return (
    <section id="home" className="relative py-20 lg:py-32 bg-[#e3f8df]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <Typography 
              variant="h1" 
              className="text-4xl lg:text-6xl font-bold text-[#104911] mb-6"
            >
              Selamat Datang di
              <span className="text-[#69d223]"> Desa Krebet</span>
            </Typography>
            <Typography variant="lead" className="text-gray-600 mb-8">
           Desa Krebet merupakan salah satu desa di Kecamatan Pilangkenceng, Kabupaten Madiun. Masyarakatnya sebagian besar bekerja di sektor pertanian, peternakan, serta usaha kecil dan menengah. Desa ini juga memiliki potensi alam yang asri dengan lingkungan yang hijau, serta nilai kearifan lokal yang terus dijaga dari generasi ke generasi. </Typography>
          </div>

          {/* Hero Image dengan Efek yang Diperbaiki */}
          <div className="relative">
            <div className="relative group">
              {/* Main Image Container */}
              <div className="rounded-2xl w-full h-[400px] overflow-hidden 
                            bg-gradient-to-br from-blue-400 to-blue-600 
                            shadow-2xl shadow-gray-900/60 
                            hover:shadow-3xl hover:shadow-gray-900/60 
                            transition-all duration-500 ease-out
                            transform group-hover:scale-[1.02]">
                <img 
                  src="/img/hero-section.jpg" 
                  alt="Desa Krebet" 
                  className="w-full h-full object-cover 
                           transition-transform duration-700 ease-out
                           group-hover:scale-110"
                  onError={(e) => {
                    // Fallback jika gambar tidak ditemukan
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "/img/hero-section.png"; // Try PNG
                    
                    // Jika PNG juga tidak ada, tampilkan placeholder
                    setTimeout(() => {
                      if (e.target.complete && e.target.naturalHeight === 0) {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-400', 'to-blue-600', 'flex', 'items-center', 'justify-center');
                        e.target.parentElement.innerHTML = `
                          <div class="text-center text-white">
                            <svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p class="text-2xl font-bold">Desa Krebet</p>
                            <p class="text-sm opacity-75">Hero Image</p>
                          </div>
                        `;
                      }
                    }, 100);
                  }}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rounded-full 
                            shadow-lg shadow-yellow-500/50 animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full 
                            shadow-lg shadow-green-500/50 animate-pulse delay-1000"></div>
            </div>
            
            {/* Badge dengan Efek Shadow yang Diperbaiki */}
            <div className="absolute -bottom-6 -left-6 bg-gray-100 p-6 rounded-xl 
                          shadow-2xl shadow-gray-500/25 
                          hover:shadow-3xl hover:shadow-gray-500/40 
                          transition-all duration-300 
                          transform hover:-translate-y-1">
              <Typography variant="h4" className="text-[#69d223] font-bold">
                Desa Krebet
              </Typography>
              <Typography variant="small" className="text-gray-600">
                Pilangkenceng, Madiun
              </Typography>
            </div>

            {/* Decorative Corner Accents */}
            <div className="absolute -top-2 -right-2 w-16 h-16 border-t-2 border-r-2 border-green-300 rounded-tr-2xl 
                          opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            
          </div>
        </div>

        {/* ✅ Stats Cards - Gray default, colored on hover */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {statsDisplay.map((stat) => (
            <Card 
              key={stat.key} 
              className={`text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl
                        group cursor-pointer overflow-hidden relative
                        hover:bg-${stat.hoverBg}`}
            >
              {/* Animated background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${stat.hoverBg} to-white opacity-0 
                             group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <CardBody className="relative z-10">
                {loading ? (
                  // Loading Skeleton
                  <div className="animate-pulse">
                    <div className="h-12 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  </div>
                ) : error ? (
                  // Error State
                  <div className="text-gray-400">
                    <Typography variant="h2" className="mb-2">-</Typography>
                    <Typography variant="small">{stat.label}</Typography>
                  </div>
                ) : (
                  // Success State
                  <>
                    <Typography 
                      variant="h2" 
                      className={`font-bold mb-2 transition-colors duration-300
                                text-green-700 group-hover:text-${stat.hoverColor}
                                transform group-hover:scale-110 transition-transform`}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="small" 
                      className="text-gray-600 font-medium uppercase tracking-wide
                               group-hover:text-gray-700 transition-colors duration-300"
                    >
                      {stat.label}
                    </Typography>

                    {/* Icon indicator on hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 
                                  transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className={`w-2 h-2 rounded-full bg-${stat.hoverColor} animate-pulse`}></div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              <Typography variant="small" className="font-medium">
                {error}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;