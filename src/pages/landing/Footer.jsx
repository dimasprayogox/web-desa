import { Typography } from "@material-tailwind/react";
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export function Footer() {
  const villageInfo = {
    name: "Desa Krebet",
    address: "Jl. Raya Krebet, Pilangkenceng, Madiun",
    phone: "(0351) 123-456",
    email: "desakrebet@email.com"
  };

  return (
    <footer className="bg-[#104911] text-white py-8">
      <div className="container mx-auto px-4">
        
        {/* Grid 2 kolom, simpel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          
          {/* Identitas Desa */}
          <div>
            <Typography variant="h5" className="font-bold mb-2">
              {villageInfo.name}
            </Typography>

            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4" />
                <Typography variant="small">
                  {villageInfo.address}
                </Typography>
              </div>

              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" />
                <Typography variant="small">
                  {villageInfo.phone}
                </Typography>
              </div>

              <div className="flex items-center gap-2">
                <EnvelopeIcon className="w-4 h-4" />
                <Typography variant="small">
                  {villageInfo.email}
                </Typography>
              </div>
            </div>
          </div>

          {/* Info Singkat */}
          <div>
            <Typography variant="h6" className="font-bold mb-3">
              Tentang Website
            </Typography>

            <Typography variant="small" className="text-gray-300">
              Website resmi pelayanan informasi Desa Krebet.
            </Typography>

            <Typography variant="small" className="text-gray-300 mt-2 block">
              Update terakhir: {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </Typography>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-4">
          <Typography
            variant="small"
            className="text-gray-400 text-center"
          >
            © {new Date().getFullYear()} KKN Kelompok 6 UNIPMA 2025 — Desa Krebet
          </Typography>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
