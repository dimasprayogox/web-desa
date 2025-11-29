import { Typography } from "@material-tailwind/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

export function AboutSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gambar-gambar Desa Krebet Pilangkenceng Madiun
  const slides = [
    {
      image: "/img/about-1.jpg",
      alt: "Desa Krebet Pilangkenceng"
    },
    {
      image: "/img/about-2.jpg",
      alt: "Desa Krebet Pilangkenceng"
    },
    {
      image: "/img/about-3.jpg", 
      alt: "Desa Krebet Pilangkenceng"
    },
  ];

  // Slideshow otomatis
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Ganti gambar setiap 4 detik

    return () => clearInterval(interval);
  }, [slides.length]);

  // Navigasi manual
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

 

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Typography variant="h2" className="text-3xl lg:text-5xl font-bold text-blue-gray-900 mb-4">
            Tentang Desa Krebet
          </Typography>
          <Typography variant="lead" className="text-gray-600 max-w-3xl mx-auto">
            Desa Krebet, Pilangkenceng - Madiun: Desa Agraris yang Kaya Akan Potensi Alam dan Budaya
          </Typography>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Slideshow Section */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gray-500/25 
                          hover:shadow-3xl hover:shadow-gray-500/40 transition-all duration-500">
              <div className="relative h-[400px] w-full overflow-hidden rounded-2xl">
                {/* Slides */}
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/600x400/4f46e5/ffffff?text=Gambar+${slide.alt}`;
                      }}
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div className="text-center mt-4">
              <Typography variant="small" className="text-gray-600 italic">
                {slides[currentSlide].alt}
              </Typography>
            </div>
          </div>

          {/* Content Section */}
          <div>
            <Typography variant="h4" className="font-bold text-blue-gray-900 mb-4">
              Sejarah & Profil Desa
            </Typography>
            <Typography className="text-gray-600 mb-4">
              <strong>Desa Krebet</strong> merupakan salah satu desa di Kecamatan Pilangkenceng, 
              Kabupaten Madiun, Jawa Timur. Desa ini terletak di wilayah agraris dengan 
              mayoritas penduduk bermata pencaharian sebagai petani dan peternak.
            </Typography>
            

            <Typography variant="h5" className="font-bold text-blue-gray-900 mb-3 mt-6">
              Potensi & Keunggulan
            </Typography>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-700">
                <ChevronRightIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Pertanian Organik:</strong> Pengembangan pertanian berkelanjutan 
                  dengan sistem organik
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <ChevronRightIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Peternakan Terintegrasi:</strong> Sistem peternakan yang terintegrasi 
                  dengan pertanian
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <ChevronRightIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>UMKM Lokal:</strong> Pengolahan hasil pertanian dan peternakan 
                  menjadi produk bernilai ekonomi
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <ChevronRightIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Wisata Edukasi:</strong> Potensi wisata edukasi pertanian dan 
                  kehidupan pedesaan
                </span>
              </li>
            </ul>

            
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;