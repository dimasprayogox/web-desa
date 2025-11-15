import { Typography, Card, CardBody } from "@material-tailwind/react";
import {
  HomeIcon,
  UsersIcon,
  NewspaperIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
 
export function ServicesSection() {
  const services = [
    {
      icon: <HomeIcon className="h-8 w-8" />,
      title: "Administrasi Desa",
      description: "Layanan pembuatan surat keterangan, KTP, KK, dan dokumen lainnya",
    },
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: "Pemberdayaan Masyarakat",
      description: "Program pelatihan dan pengembangan UMKM lokal",
    },
    {
      icon: <NewspaperIcon className="h-8 w-8" />,
      title: "Informasi Publik",
      description: "Akses informasi transparansi desa dan pengumuman penting",
    },
    {
      icon: <PhotoIcon className="h-8 w-8" />,
      title: "Wisata Desa",
      description: "Promosi potensi wisata dan budaya desa Krebet",
    },
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Typography variant="h2" className="text-3xl lg:text-5xl font-bold text-blue-gray-900 mb-4">
            Layanan Desa
          </Typography>
          <Typography variant="lead" className="text-gray-600 max-w-3xl mx-auto">
            Berbagai layanan untuk memudahkan masyarakat dan pengunjung
          </Typography>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow">
              <CardBody className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  {service.icon}
                </div>
                <Typography variant="h5" className="font-bold text-blue-gray-900 mb-3">
                  {service.title}
                </Typography>
                <Typography className="text-gray-600">
                  {service.description}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;