import { Typography, Card, CardBody } from "@material-tailwind/react";
import {
  HomeIcon,
  UsersIcon,
  NewspaperIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  HandRaisedIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";

export function ServicesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [cardsToShow, setCardsToShow] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const autoRef = useRef(null);
  
  // Touch/Swipe states
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const services = [
    { icon: <HomeIcon className="h-8 w-8" />, title: "Administrasi Desa", description: "Pelayanan pembuatan surat keterangan, KTP, KK, dan dokumen kependudukan" },
    { icon: <DocumentTextIcon className="h-8 w-8" />, title: "Pelayanan Umum", description: "Layanan surat menyurat, legalisasi dokumen, dan pengurusan perizinan" },
    { icon: <ShieldCheckIcon className="h-8 w-8" />, title: "Bantuan Sosial", description: "Penyaluran bantuan pemerintah untuk masyarakat kurang mampu" },
    { icon: <BuildingLibraryIcon className="h-8 w-8" />, title: "Kesehatan", description: "Posyandu, layanan kesehatan dasar, dan koordinasi puskesmas" },
    { icon: <UsersIcon className="h-8 w-8" />, title: "Pemberdayaan", description: "Program pelatihan, pengembangan UMKM, dan peningkatan kapasitas" },
    { icon: <NewspaperIcon className="h-8 w-8" />, title: "Informasi Publik", description: "Transparansi anggaran desa, pengumuman resmi, dan data publik" },
    { icon: <ChartBarIcon className="h-8 w-8" />, title: "Pembangunan", description: "Perencanaan dan pelaksanaan program pembangunan infrastruktur desa" },
    { icon: <HandRaisedIcon className="h-8 w-8" />, title: "Pengaduan", description: "Layanan pengaduan masyarakat dan penanganan keluhan warga" },
  ];

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Responsive cards to show
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // AUTO SLIDE every 4s
  useEffect(() => {
    autoRef.current = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(autoRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handleNext = () => {
    if (animating) return;
    setDirection("next");
    setAnimating(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
      setAnimating(false);
    }, 500);
  };

  const handlePrev = () => {
    if (animating) return;
    setDirection("prev");
    setAnimating(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
      setAnimating(false);
    }, 500);
  };

  const goToIndex = (index) => {
    if (animating || index === currentIndex) return;
    const dir = index > currentIndex ? "next" : "prev";
    setDirection(dir);
    setAnimating(true);
    
    setTimeout(() => {
      setCurrentIndex(index);
      setAnimating(false);
    }, 500);
  };

  // Touch handlers untuk swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    // Pause auto slide saat user touch
    clearInterval(autoRef.current);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    // Reset auto slide after swipe
    autoRef.current = setInterval(() => {
      handleNext();
    }, 4000);
  };

  // Get visible cards - responsive number of cards
  const getVisibleCards = () => {
    const cards = [];
    
    for (let i = 0; i < cardsToShow; i++) {
      const serviceIndex = (currentIndex + i) % services.length;
      const service = services[serviceIndex];
      
      cards.push({
        ...service,
        index: serviceIndex,
      });
    }
    
    return cards;
  };

  // Dots indicator
  const renderDots = () => {
    if (cardsToShow > 1) return null;
    
    return (
      <div className="flex justify-center mt-8 space-x-2">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              clearInterval(autoRef.current);
              goToIndex(index);
            }}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? "bg-blue-600 w-8 h-3" 
                : "bg-gray-300 hover:bg-gray-400 w-3 h-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  // Fungsi untuk mendapatkan class animasi
  const getAnimationClass = () => {
    if (!animating) return "";
    
    if (isMobile) {
      return direction === "next" ? "slide-mobile-next" : "slide-mobile-prev";
    } else {
      return direction === "next" ? "slide-all-next" : "slide-all-prev";
    }
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b  from-[#e3f8df] to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Typography variant="h2" className="text-3xl lg:text-5xl font-bold text-[#104911] mb-4">
            Layanan Desa
          </Typography>
          <Typography variant="lead" className="text-gray-600 max-w-3xl mx-auto">
            Berbagai layanan publik untuk memudahkan masyarakat Desa Krebet
          </Typography>
        </div>

        {/* SLIDER AREA */}
        <div className="relative">
          {/* Swipe hint untuk mobile */}
          {isMobile && (
            <div className="flex justify-center mb-4">
              
            </div>
          )}

          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[300px] transition-all duration-500 ease-in-out ${getAnimationClass()}`}
            onTouchStart={isMobile ? onTouchStart : undefined}
            onTouchMove={isMobile ? onTouchMove : undefined}
            onTouchEnd={isMobile ? onTouchEnd : undefined}
          >
            {getVisibleCards().map((service, i) => (
              <Card
                key={`${service.title}-${service.index}`}
                className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group touch-pan-y"
              >
                <CardBody className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e3f8df] text-[#104911] mb-4 group-hover:bg-[#104911] group-hover:text-white transition-all duration-300">
                    {service.icon}
                  </div>
                  <Typography variant="h5" className="font-bold text-[#104911] mb-3">
                    {service.title}
                  </Typography>
                  <Typography className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </Typography>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Arrow controls - show on desktop/tablet */}
          {cardsToShow > 1 && (
            <>
              <button
                onClick={() => {
                  clearInterval(autoRef.current);
                  handlePrev();
                }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white hover:bg-[#104911] text-[#104911] hover:text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 hover:scale-110"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => {
                  clearInterval(autoRef.current);
                  handleNext();
                }}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white hover:bg-[#104911] text-[#104911] hover:text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 hover:scale-110"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Mobile Navigation Buttons (optional alternative to swipe) */}
          {isMobile && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => {
                  clearInterval(autoRef.current);
                  handlePrev();
                }}
                className="bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-full p-3 shadow-lg transition-all duration-300"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => {
                  clearInterval(autoRef.current);
                  handleNext();
                }}
                className="bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-full p-3 shadow-lg transition-all duration-300"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

    
      </div>

      {/* CSS untuk animasi responsive */}
      <style jsx>{`
        /* Animasi untuk Desktop/Tablet (multiple cards) */
        @keyframes slideAllNext {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-29%);
          }
        }
        
        @keyframes slideAllPrev {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(29%);
          }
        }
        
        .slide-all-next {
          animation: slideAllNext 0.7s ease-out forwards;
        }
        
        .slide-all-prev {
          animation: slideAllPrev 0.7s ease-out forwards;
        }

        /* Animasi untuk Mobile (single card) */
        @keyframes slideMobileNext {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        
        @keyframes slideMobilePrev {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .slide-mobile-next {
          animation: slideMobileNext 0.5s ease-out forwards;
        }
        
        .slide-mobile-prev {
          animation: slideMobilePrev 0.5s ease-out forwards;
        }

        /* Prevent text selection during swipe */
        .touch-pan-y {
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }
      `}</style>
    </section>
  );
}

export default ServicesSection;