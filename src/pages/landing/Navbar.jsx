import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Typography, IconButton } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export function Navbar() {
  const [openNav, setOpenNav] = useState(false);

  const navigation = [
    { name: "Beranda", href: "#home" },
    { name: "Tentang", href: "#about" },
    { name: "Layanan", href: "#services" },
    { name: "Berita", href: "#news" },
    { name: "Galeri", href: "#gallery" },
    { name: "Kontak", href: "#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Typography variant="h6" color="white" className="font-bold">
                DK
              </Typography>
            </div>
            <div>
              <Typography variant="h6" className="font-bold text-blue-gray-900">
                Desa Krebet
              </Typography>
              <Typography variant="small" className="text-gray-600 -mt-1">
                Kabupaten Bantul
              </Typography>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-blue-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li>
              <Link to="/auth/login">
                <Button size="sm" color="blue">
                  Login Admin
                </Button>
              </Link>
            </li>
          </ul>
 
          {/* Mobile Menu Button */}
          <IconButton
            variant="text"
            className="lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </IconButton>
        </div>

        {/* Mobile Navigation */}
        {openNav && (
          <div className="lg:hidden pb-4">
            <ul className="flex flex-col gap-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="block py-2 text-blue-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setOpenNav(false)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/auth/login">
                  <Button size="sm" color="blue" fullWidth>
                    Login Admin
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;