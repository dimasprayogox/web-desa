import { Button, Typography, Card, CardBody } from "@material-tailwind/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export function HeroSection() {
  const stats = [
    { value: "1,234", label: "Penduduk" },
    { value: "345", label: "KK" },
    { value: "15+", label: "UMKM" },
    { value: "25+", label: "RT/RW" },
  ];
 
  return (
    <section id="home" className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Typography variant="h1" className="text-4xl lg:text-6xl font-bold text-blue-gray-900 mb-6">
              Selamat Datang di
              <span className="text-blue-600"> Desa Krebet</span>
            </Typography>
            <Typography variant="lead" className="text-gray-600 mb-8">
              Desa wisata dengan kerajinan batik kayu yang terkenal, terletak di Bantul, Yogyakarta.
              Kaya akan budaya, tradisi, dan potensi UMKM lokal.
            </Typography>
            <div className="flex gap-4">
              <a href="#services">
                <Button size="lg" color="blue" className="flex items-center gap-2">
                  Layanan Desa
                  <ChevronRightIcon className="h-5 w-5" />
                </Button>
              </a>
              <a href="#about">
                <Button size="lg" variant="outlined" color="blue">
                  Tentang Kami
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="rounded-2xl shadow-2xl w-full h-[400px] bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Typography variant="h2" color="white" className="font-bold">
                Desa Krebet
              </Typography>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
              <Typography variant="h4" className="text-blue-600 font-bold">
                Desa Wisata
              </Typography>
              <Typography variant="small" className="text-gray-600">
                Batik Kayu Krebet
              </Typography>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardBody>
                <Typography variant="h2" className="text-blue-600 font-bold mb-2">
                  {stat.value}
                </Typography>
                <Typography variant="small" className="text-gray-600 font-medium">
                  {stat.label}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;