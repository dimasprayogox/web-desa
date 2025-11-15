import { Typography } from "@material-tailwind/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
 
export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Typography variant="h2" className="text-3xl lg:text-5xl font-bold text-blue-gray-900 mb-4">
            Tentang Desa Krebet
          </Typography>
          <Typography variant="lead" className="text-gray-600 max-w-3xl mx-auto">
            Desa Krebet adalah desa wisata yang terkenal dengan kerajinan batik kayu dan topeng kayu yang unik
          </Typography>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="rounded-2xl shadow-xl w-full h-[400px] bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Typography variant="h3" color="white" className="font-bold">
                Batik Kayu
              </Typography>
            </div>
          </div>
          <div>
            <Typography variant="h4" className="font-bold text-blue-gray-900 mb-4">
              Sejarah & Budaya
            </Typography>
            <Typography className="text-gray-600 mb-4">
              Desa Krebet terletak di Kecamatan Pajangan, Kabupaten Bantul, Yogyakarta.
              Sejak tahun 1970-an, desa ini telah dikenal sebagai sentra kerajinan batik kayu
              yang berkualitas tinggi.
            </Typography>
            <Typography className="text-gray-600 mb-4">
              Kerajinan batik kayu Krebet telah menembus pasar nasional dan internasional,
              menjadi ikon pariwisata budaya Yogyakarta.
            </Typography>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-700">
                <ChevronRightIcon className="h-5 w-5 text-blue-600" />
                Sentra kerajinan batik kayu terbesar di Yogyakarta
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <ChevronRightIcon className="h-5 w-5 text-blue-600" />
                Memiliki lebih dari 15 UMKM kerajinan lokal
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <ChevronRightIcon className="h-5 w-5 text-blue-600" />
                Destinasi wisata edukatif dan budaya
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;