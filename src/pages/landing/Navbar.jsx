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
  const location = useLocation();
  const navigate = useNavigate();

  // Effect untuk detect scroll
  useEffect(() => {
    const handleScroll = () => {
      // Set scrolled state untuk background navbar
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);

      // Update active section berdasarkan scroll position
      updateActiveSection();
    };

    // Intersection Observer untuk detect section yang aktif
    const setupIntersectionObserver = () => {
      const sections = document.querySelectorAll("section[id]");
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          rootMargin: "-20% 0px -70% 0px", // Adjust untuk sensitivity
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
  }, [location]);

  // Function untuk update active section
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

  // Struktur navigasi baru
  const navLinks = [
    {
      name: "Profil Desa",
      isDropdown: true,
      items: [
        { name: "Beranda", href: "#home", isAnchor: true, id: "home" },
        { name: "Tentang", href: "#about", isAnchor: true, id: "about" },
        { name: "Visi & Misi", href: "#visi-misi", isAnchor: true, id: "visi-misi" },
        { name: "Layanan", href: "#services", isAnchor: true, id: "services" },
        { name: "Berita", href: "#news", isAnchor: true, id: "news" },
        { name: "Kontak", href: "#contact", isAnchor: true, id: "contact" },
      ],
    },
    { name: "Infografis", href: "/infografis", isRoute: true },
    { name: "Berita", href: "/berita", isRoute: true },
    { name: "UMKM", href: "/umkm", isRoute: true },
  ];

  // Kelas link dengan hover effects yang lebih baik
  const getLinkClass = (link, isMobile = false) => {
    const baseClass = isMobile 
      ? "block py-3 px-4 rounded-lg transition-all duration-300 font-medium w-full text-left border-l-4"
      : "flex items-center gap-1 transition-all duration-300 font-medium relative";

    const activeClass = isMobile
      ? "bg-blue-50 text-[#455300] border-[#455300] shadow-sm"
      : "text-[#455300]";

    const inactiveClass = isMobile
      ? "text-blue-gray-700 hover:bg-blue-50 hover:text-[#455300] border-transparent hover:border-blue-200 hover:shadow-sm"
      : "text-blue-gray-700 hover:text-[#455300]";

    // Check if this link is active
    let isActive = false;
    if (link.isAnchor && link.id === activeSection && location.pathname === "/") {
      isActive = true;
    }

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  // Function untuk smooth scroll ke section dengan easing
  const handleScrollToSection = (sectionId) => {
    const id = sectionId.replace("#", "");

    // Jika tidak di landing page, navigate dulu ke landing
    if (location.pathname !== "/") {
      navigate("/");
      // Tunggu sebentar agar page ter-render, baru scroll
      setTimeout(() => {
        smoothScrollToElement(id);
      }, 300);
    } else {
      // Langsung scroll jika sudah di landing page
      smoothScrollToElement(id);
    }

    // Tutup mobile menu
    setOpenNav(false);
  };

  // Enhanced smooth scroll function dengan easing
  const smoothScrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      // Custom easing function untuk animasi yang lebih smooth
      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const startPosition = window.pageYOffset;
      const distance = offsetPosition - startPosition;
      const duration = 1000; // 1 second
      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * easeProgress);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  // Handle click untuk link (anchor atau route)
  const handleLinkClick = (link, e) => {
    if (link.isAnchor) {
      e.preventDefault();
      handleScrollToSection(link.href);
    } else {
      setOpenNav(false);
    }
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100" 
          : "bg-white/80 backdrop-blur-sm shadow-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo dengan hover effect */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                smoothScrollToElement("home");
              }
            }}
          >
            <div className="h-10 w-10 bg-[#455300] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <Typography variant="h6" color="white" className="font-bold">
                DK
              </Typography>
            </div>
            <div className="transition-all duration-300 group-hover:translate-x-1">
              <Typography variant="h6" className="font-bold text-blue-gray-900">
                Desa Krebet
              </Typography>
              <Typography variant="small" className="text-gray-600 -mt-1">
                Kabupaten Madiun
              </Typography>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8 list-none">
            {navLinks.map((link) =>
              link.isDropdown ? (
                // Enhanced Dropdown Menu dengan animasi
                <li key={link.name} className="relative">
                  <Menu allowHover placement="bottom" offset={10}>
                    <MenuHandler>
                      <button
                        className={getLinkClass(link)}
                        onClick={(e) => e.preventDefault()}
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span className="relative">
                          {link.name}
                          {/* Animated underline */}
                          <span 
                            className={`absolute -bottom-1 left-0 h-0.5 bg-[#455300] transition-all duration-300 ${
                              link.items.some(item => item.id === activeSection) 
                                ? "w-full opacity-100" 
                                : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                            }`}
                          />
                        </span>
                        <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                      </button>
                    </MenuHandler>

                    <MenuList className="p-2 shadow-xl border border-gray-100 min-w-[200px] backdrop-blur-sm bg-white/95">
                      {link.items.map((item) => (
                        <MenuItem
                          key={item.name}
                          onClick={(e) => handleLinkClick(item, e)}
                          className={`p-3 rounded-lg transition-all duration-200 ${
                            item.id === activeSection && location.pathname === "/"
                              ? "bg-blue-50 text-[#455300] font-semibold shadow-sm"
                              : "hover:bg-blue-50 hover:text-[#455300] hover:shadow-sm"
                          }`}
                        >
                          {item.isAnchor ? (
                            <button className="w-full text-left flex items-center gap-2">
                              <span 
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                  item.id === activeSection && location.pathname === "/"
                                    ? "bg-[#455300] scale-125"
                                    : "bg-gray-300 group-hover:bg-[#455300]"
                                }`}
                              />
                              {item.name}
                            </button>
                          ) : (
                            <Link to={item.href} className="block w-full flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                              {item.name}
                            </Link>
                          )}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </li>
              ) : (
                // Enhanced Regular Link dengan animated underline
                <li key={link.name} className="relative">
                  {link.isRoute ? (
                    <Link 
                      to={link.href} 
                      className={getLinkClass(link)}
                      onClick={() => setOpenNav(false)}
                    >
                      <span className="relative">
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#455300] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                      </span>
                    </Link>
                  ) : (
                    <button
                      onClick={(e) => handleLinkClick(link, e)}
                      className={getLinkClass(link)}
                    >
                      <span className="relative">
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#455300] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                      </span>
                    </button>
                  )}
                </li>
              )
            )}

            {/* Optional Login Button dengan enhanced hover */}
            {/* <li>
              <Link to="/auth/login">
                <Button 
                  size="sm" 
                  className="bg-[#455300] hover:bg-[#364800] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Login Admin
                </Button>
              </Link>
            </li> */}
          </ul>

          {/* Enhanced Mobile Menu Button */}
          <IconButton
            variant="text"
            className="lg:hidden transition-all duration-300 hover:bg-blue-50 hover:text-[#455300]"
            onClick={() => setOpenNav((p) => !p)}
            aria-label="Toggle navigation"
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6 transition-transform duration-300 rotate-90" />
            ) : (
              <Bars3Icon className="h-6 w-6 transition-transform duration-300" />
            )}
          </IconButton>
        </div>

        {/* Enhanced Mobile Navigation dengan animasi */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            openNav ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-1 list-none">
            {navLinks.map((link) =>
              link.isDropdown ? (
                // Enhanced Dropdown Group di Mobile
                <Fragment key={link.name}>
                  <li className="mt-4 mb-2 ml-1 ">
                    <Typography
                      variant="small"
                      className="font-bold text-blue-gray-500 uppercase tracking-wide text-xs"
                    >
                      {link.name}
                    </Typography>
                  </li>

                  {link.items.map((item) => (
                    <li key={item.name}>
                      {item.isAnchor ? (
                        <button
                          onClick={(e) => handleLinkClick(item, e)}
                          className={getLinkClass(item, true)}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                item.id === activeSection && location.pathname === "/"
                                  ? "bg-[#455300] scale-125"
                                  : "bg-gray-300"
                              }`}
                            />
                            {item.name}
                            {item.id === activeSection && location.pathname === "/" && (
                              <div className="ml-auto w-2 h-2 bg-[#455300] rounded-full animate-pulse" />
                            )}
                          </div>
                        </button>
                      ) : (
                        <Link
                          to={item.href}
                          className={getLinkClass(item, true)}
                          onClick={() => setOpenNav(false)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gray-300 rounded-full" />
                            {item.name}
                          </div>
                        </Link>
                      )}
                    </li>
                  ))}
                </Fragment>
              ) : (
                // Enhanced Regular Link di Mobile
                <li key={link.name}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className={getLinkClass(link, true)}
                      onClick={() => setOpenNav(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        {link.name}
                      </div>
                    </Link>
                  ) : (
                    <button
                      onClick={(e) => handleLinkClick(link, e)}
                      className={getLinkClass(link, true)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        {link.name}
                      </div>
                    </button>
                  )}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;