import { useState, Fragment, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

export function Navbar() {
  const [openNav, setOpenNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolling, setIsScrolling] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Effect untuk detect scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
      updateActiveSection();
    };

    const setupIntersectionObserver = () => {
      const sections = document.querySelectorAll("section[id]");
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isScrolling) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          rootMargin: "-20% 0px -70% 0px",
          threshold: 0.1,
        }
      );

      sections.forEach((section) => {
        observer.observe(section);
      });

      return observer;
    };

    window.addEventListener("scroll", handleScroll);
    const observer = setupIntersectionObserver();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [location, isScrolling]);

  const updateActiveSection = () => {
    const sections = document.querySelectorAll("section[id]");
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    if (current) {
      setActiveSection(current);
    }
  };

  // Struktur navigasi yang diperbarui
  const navLinks = [
    {
      name: "Profil Desa",
      isDropdown: true,
      items: [
        { name: "Beranda", href: "#home", isAnchor: true, id: "home" },
        { name: "Tentang", href: "#about", isAnchor: true, id: "about" },
        { name: "Visi & Misi", href: "#visi-misi", isAnchor: true, id: "visi-misi"},
        { name: "Layanan", href: "#services", isAnchor: true, id: "services"},
        { name: "Berita", href: "#news", isAnchor: true, id: "news" },
        { name: "Kontak", href: "#contact", isAnchor: true, id: "contact" },
      ],
    },
    { name: "Infografis", href: "/infografis", isRoute: true },
    { name: "Berita", href: "/berita", isRoute: true },
    { name: "UMKM", href: "/umkm", isRoute: true },
  ];

  // Helper untuk mendapatkan kelas link yang aktif
  const isLinkActive = (link) => {
    if (link.isAnchor && link.id === activeSection && location.pathname === "/") {
      return true;
    }
    if (link.isRoute && location.pathname === link.href) {
      return true;
    }
    if (link.isDropdown && link.items.some(item => item.id === activeSection && location.pathname === "/")) {
      return true;
    }
    return false;
  };

  // Kelas link dengan perbaikan untuk mobile
  const getLinkClass = (link, isMobile = false) => {
    const isActive = isLinkActive(link);
    
    if (isMobile) {
      const baseClass = "flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium w-full text-left";
      
      if (isActive) {
        return `${baseClass} bg-gradient-to-r from-green-50 to-blue-50 text-[#104911] border-l-4 border-[#104911] shadow-sm`;
      }
      
      return `${baseClass} text-[#104911] hover:bg-gray-50 hover:text-[#104911] border-l-4 border-transparent hover:border-gray-200`;
    }

    // Desktop classes
    const baseClass = "flex items-center gap-1 transition-all duration-300 font-medium relative px-1";
    
    if (isActive) {
      return `${baseClass} text-[#104911] font-semibold`;
    }
    
    return `${baseClass} text-[#104911] hover:text-[#104911]`;
  };

  // ✅ IMPROVED - Function untuk smooth scroll dengan easing dan animasi mulus
  const handleScrollToSection = (sectionId) => {
    const id = sectionId.replace("#", "");

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      smoothScrollToElement(id);
    }

    setOpenNav(false);
  };

  // ✅ IMPROVED - Smooth scroll dengan custom easing function
  const smoothScrollToElement = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    setIsScrolling(true);
    setActiveSection(id);

    const navbarHeight = 80; // Height navbar + padding
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1200; // Durasi animasi dalam ms (lebih lama = lebih smooth)
    let start = null;

    // ✅ Easing function untuk animasi lebih natural (easeInOutCubic)
    const easeInOutCubic = (t) => {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    // ✅ Animation loop dengan requestAnimationFrame
    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Apply easing
      const easeProgress = easeInOutCubic(progress);
      
      // Calculate position with easing
      const scrollPosition = startPosition + (distance * easeProgress);
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'auto' // Gunakan 'auto' karena kita handle animation sendiri
      });

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        // ✅ Setelah selesai, set isScrolling ke false
        setTimeout(() => {
          setIsScrolling(false);
        }, 100);
      }
    };

    requestAnimationFrame(animation);
  };

  // ✅ IMPROVED - Handle link click dengan haptic feedback (untuk mobile)
  const handleLinkClick = (link, e) => {
    if (link.isAnchor) {
      e.preventDefault();
      
      // Haptic feedback untuk mobile (jika didukung)
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      
      handleScrollToSection(link.href);
    } else {
      setOpenNav(false);
    }
  };

  // ✅ Handle scroll dari navigate state
  useEffect(() => {
    if (location.state?.scrollTo && location.pathname === "/") {
      // Delay untuk memastikan DOM sudah ready
      setTimeout(() => {
        smoothScrollToElement(location.state.scrollTo);
        // Clear state setelah scroll
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location]);

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-[#e3f8df]/20 backdrop-blur-md shadow-lg border-b border-gray-100" 
          : "bg-[#e3f8df] backdrop-blur-sm shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Updated to use image */}
          <Link
            to="/"
            className="flex items-center gap-3 group flex-shrink-0"
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                smoothScrollToElement("home");
              }
            }}
          >
            {/* ✅ Logo Image dengan shadow dan border */}
            <div className="h-12 w-12 rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg shadow-md border-2 border-white/50">
              <img 
                src="/img/logo.png" 
                alt="Logo Desa Krebet" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="transition-all duration-300 group-hover:translate-x-1">
              <Typography variant="h6" className="font-bold text-[#104911]">
                Desa Krebet
              </Typography>
              <Typography variant="small" className="text-[#104911] -mt-1">
                Kabupaten Madiun
              </Typography>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) =>
              link.isDropdown ? (
                <div key={link.name} className="relative">
                  <Menu allowHover placement="bottom" offset={10}>
                    <MenuHandler>
                      <button
                        className={`${getLinkClass(link)} px-4 py-2 rounded-lg  group`}
                        aria-haspopup="true"
                      >
                        <span className="flex items-center gap-1">
                          <span className="relative">
                            {link.name}
                            <span 
                              className={`absolute -bottom-1 left-0 h-0.5 bg-[#104911] transition-all duration-300 ${
                                isLinkActive(link) 
                                  ? "w-full opacity-100" 
                                  : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                              }`}
                            />
                          </span>
                          <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                        </span>
                      </button>
                    </MenuHandler>

                    <MenuList className="p-2 shadow-xl border border-gray-100 min-w-[220px] backdrop-blur-sm bg-white/95">
                      {link.items.map((item) => {
                        const isActive = item.id === activeSection && location.pathname === "/";
                        return (
                          <MenuItem
                            key={item.name}
                            onClick={(e) => handleLinkClick(item, e)}
                            className={`p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                              isActive
                                ? "bg-gradient-to-r from-green-50 to-blue-50 text-[#104911] font-semibold"
                                : " hover:text-[#104911]"
                            }`}
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.name}</span>
                            {isActive && (
                              <div className="ml-auto w-2 h-2 bg-[#104911] rounded-full animate-pulse" />
                            )}
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </Menu>
                </div>
              ) : (
                <div key={link.name} className="relative">
                  <Link 
                    to={link.href}
                    className={`${getLinkClass(link)} px-4 py-2 rounded-lg  group`}
                    onClick={() => setOpenNav(false)}
                  >
                    <span className="flex items-center gap-2">
                      <span>{link.icon}</span>
                      <span className="relative">
                        {link.name}
                        <span 
                          className={`absolute -bottom-1 left-0 h-0.5 bg-[#104911] transition-all duration-300 ${
                            isLinkActive(link)
                              ? "w-full opacity-100"
                              : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                          }`}
                        />
                      </span>
                    </span>
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <IconButton
              variant="text"
              className="text-[#104911] hover:bg-gray-100 hover:text-[#104911] transition-all duration-300"
              onClick={() => setOpenNav(!openNav)}
              aria-label="Toggle navigation"
            >
              {openNav ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </IconButton>
          </div>
        </div>

        {/* Mobile Navigation - Fixed positioning */}
        {openNav && (
          <div className="lg:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-100 z-40 animate-slide-down">
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto pb-6">
              <div className="px-4 pt-4">
                {/* Profil Desa Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-1 h-4 bg-[#104911] rounded-full"></div>
                    <Typography
                      variant="small"
                      className="font-bold text-[#104911] uppercase tracking-wide"
                    >
                      Profil Desa
                    </Typography>
                  </div>
                  
                  <div className="space-y-1">
                    {navLinks.find(link => link.name === "Profil Desa")?.items.map((item, index) => {
                      const isActive = item.id === activeSection && location.pathname === "/";
                      return (
                        <button
                          key={item.name}
                          onClick={(e) => handleLinkClick(item, e)}
                          className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 animate-fade-in ${
                            isActive
                              ? "bg-gradient-to-r from-green-50 to-blue-50 text-[#104911] font-medium"
                              : "text-[#104911] hover:bg-gray-50"
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="flex-1 text-left">{item.name}</span>
                          {isActive && (
                            <div className="w-2 h-2 bg-[#104911] rounded-full animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Other Navigation Links */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="space-y-1">
                    {navLinks
                      .filter(link => !link.isDropdown)
                      .map((link, index) => {
                        const isActive = location.pathname === link.href;
                        return (
                          <Link
                            key={link.name}
                            to={link.href}
                            className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 animate-fade-in ${
                              isActive
                                ? "bg-gradient-to-r from-green-50 to-blue-50 text-[#104911] font-medium"
                                : "text-[#104911] hover:bg-gray-50"
                            }`}
                            style={{ animationDelay: `${(index + 6) * 50}ms` }}
                            onClick={() => setOpenNav(false)}
                          >
                            <span className="text-lg">{link.icon}</span>
                            <span className="flex-1 text-left">{link.name}</span>
                            {isActive && (
                              <div className="w-2 h-2 bg-[#104911] rounded-full animate-pulse" />
                            )}
                          </Link>
                        );
                      })}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 px-4 py-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg animate-fade-in" style={{ animationDelay: '450ms' }}>
                  <Typography variant="small" className="text-gray-600 text-center">
                    Desa Krebet, Kecamatan Pilangkenceng
                    <br />
                    Kabupaten Madiun, Jawa Timur
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;