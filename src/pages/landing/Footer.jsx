import { Typography } from "@material-tailwind/react";

export function Footer() {
  const navigation = [
    { name: "Beranda", href: "#home" },
    { name: "Tentang", href: "#about" },
    { name: "Layanan", href: "#services" },
    { name: "Berita", href: "#news" },
    { name: "Galeri", href: "#gallery" },
    { name: "Kontak", href: "#contact" },
  ];
 
  return (
    <footer className="bg-blue-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <Typography variant="h5" className="font-bold mb-4">
              Desa Krebet
            </Typography>
            <Typography className="text-gray-400">
              Desa wisata dengan kerajinan batik kayu terbaik di Yogyakarta
            </Typography>
          </div>
          <div>
            <Typography variant="h6" className="font-bold mb-4">
              Link Cepat
            </Typography>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Typography variant="h6" className="font-bold mb-4">
              Jam Pelayanan
            </Typography>
            <Typography className="text-gray-400">
              Senin - Jumat: 08.00 - 15.00 WIB<br />
              Sabtu: 08.00 - 12.00 WIB<br />
              Minggu & Libur: Tutup
            </Typography>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center">
          <Typography className="text-gray-400">
            © 2025 Desa Krebet. All rights reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
}

export default Footer;