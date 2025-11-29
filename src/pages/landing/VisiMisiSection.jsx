import { Typography, Card, CardBody } from "@material-tailwind/react";
import {
  SparklesIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  GlobeAsiaAustraliaIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";

export function VisiMisiSection() {
  const misi = [
    {
      icon: <AcademicCapIcon className="h-8 w-8" />,
      title: "Peningkatan Kualitas SDM",
      description:
        "Meningkatkan kualitas sumber daya manusia melalui pendidikan, pelatihan, dan pemberdayaan masyarakat",
      color: "blue",
    },
    {
      icon: <GlobeAsiaAustraliaIcon className="h-8 w-8" />,
      title: "Pelestarian Budaya",
      description:
        "Melestarikan dan mengembangkan budaya lokal sebagai identitas desa",
      color: "blue",
    },
    {
      icon: <LightBulbIcon className="h-8 w-8" />,
      title: "Inovasi & Teknologi",
      description:
        "Menerapkan inovasi dan teknologi untuk meningkatkan pelayanan publik",
      color: "blue",
    },
  ];

  return (
    <section id="visi-misi" className="py-20 bg-gradient-to-b from-blue-50 to-white relative">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-6">
          <Typography
            variant="h2"
            className="text-3xl lg:text-5xl font-bold text-blue-gray-900 mb-4"
          >
            Visi & Misi Desa Krebet
          </Typography>
          <Typography
            variant="lead"
            className="text-gray-600 max-w-3xl mx-auto"
          >
            Komitmen kami untuk membangun Desa Krebet yang maju, sejahtera, dan
            berdaya saing
          </Typography>
        </div>

        {/* Visi Card */}
        <div className="max-w-5xl mx-auto mb-16 relative">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 relative">
            <CardBody className="p-8 md:p-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <SparklesIcon className="h-5 w-5" />
                <Typography
                  variant="small"
                  className="font-bold uppercase tracking-wide"
                >
                  Visi Desa Krebet 2024-2029
                </Typography>
              </div>

              {/* Visi Text */}
              <Typography
                variant="h3"
                className="font-bold mb-6 leading-tight"
              >
                "Terwujudnya Desa Krebet yang Maju, Sejahtera, dan Berdaya Saing
                Berbasis Pertanian Berkelanjutan dan Pemberdayaan Masyarakat"
              </Typography>

              {/* Decorative Elements */}
              <div className="flex gap-2 mt-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 bg-white/30 rounded-full"
                    style={{ width: `${100 - i * 20}px` }}
                  />
                ))}
              </div>
            </CardBody>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          </Card>
        </div>

        {/* Misi Section */}
        <div className="mb-12">
          <div className="text-center mb-2">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-6 py-3 rounded-full mb-4">
              <RocketLaunchIcon className="h-6 w-6 text-blue-600" />
              <Typography
                variant="h4"
                className="font-bold text-blue-900"
              >
                Misi Desa Krebet
              </Typography>
            </div>
          </div>

          {/* Misi Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {misi.map((item, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100"
              >
                <CardBody className="p-6 flex flex-col items-center text-center">
                  {/* Icon + Number (center) */}
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${item.color}-100 text-${item.color}-600 group-hover:bg-${item.color}-600 group-hover:text-white transition-all duration-300`}
                    >
                      {item.icon}
                    </div>
                    
                  </div>

                  {/* Content */}
                  <Typography
                    variant="h5"
                    className="font-bold text-blue-gray-900 mb-3"
                  >
                    {item.title}
                  </Typography>
                  <Typography className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="inline-block bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-blue-200">
            <CardBody className="p-8">
              <Typography
                variant="h5"
                className="font-bold text-blue-gray-900 mb-3"
              >
                Mari Bersama Membangun Desa Krebet
              </Typography>
              <Typography className="text-gray-600 mb-6 max-w-2xl">
                Partisipasi dan dukungan masyarakat sangat penting dalam
                mewujudkan visi dan misi desa. Mari bersama-sama membangun Desa
                Krebet yang lebih baik.
              </Typography>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="text-2xl">🤝</span>
                  <Typography
                    variant="small"
                    className="font-semibold text-gray-700"
                  >
                    Gotong Royong
                  </Typography>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="text-2xl">💡</span>
                  <Typography
                    variant="small"
                    className="font-semibold text-gray-700"
                  >
                    Inovasi
                  </Typography>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="text-2xl">🌱</span>
                  <Typography
                    variant="small"
                    className="font-semibold text-gray-700"
                  >
                    Berkelanjutan
                  </Typography>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="text-2xl">🎯</span>
                  <Typography
                    variant="small"
                    className="font-semibold text-gray-700"
                  >
                    Berintegritas
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}

export default VisiMisiSection;
