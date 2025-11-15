import { Button, Typography, Card, CardBody, CardHeader } from "@material-tailwind/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
 
export function NewsSection() {
  const news = [
    {
      id: 1,
      date: "15 November 2025",
      title: "Festival Batik Kayu Krebet 2025",
      excerpt: "Pameran dan workshop batik kayu dengan pengrajin lokal...",
    },
    {
      id: 2,
      date: "10 November 2025",
      title: "Pelatihan UMKM Digital Marketing",
      excerpt: "Program pemberdayaan UMKM desa melalui pemasaran digital...",
    },
    {
      id: 3,
      date: "5 November 2025",
      title: "Lomba Kreativitas Kerajinan Kayu",
      excerpt: "Kompetisi tingkat kabupaten untuk pengrajin muda...",
    },
  ];

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Typography variant="h2" className="text-3xl lg:text-5xl font-bold text-blue-gray-900 mb-4">
            Berita & Informasi
          </Typography>
          <Typography variant="lead" className="text-gray-600 max-w-3xl mx-auto">
            Update terbaru tentang kegiatan dan program desa
          </Typography>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item.id} className="hover:shadow-xl transition-shadow">
              <CardHeader color="blue-gray" className="relative h-56">
                <div className="h-full w-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <Typography variant="h4" color="white" className="font-bold">
                    News {item.id}
                  </Typography>
                </div>
              </CardHeader>
              <CardBody>
                <Typography variant="small" className="text-blue-600 font-semibold mb-2">
                  {item.date}
                </Typography>
                <Typography variant="h5" className="font-bold text-blue-gray-900 mb-3">
                  {item.title}
                </Typography>
                <Typography className="text-gray-600 mb-4">
                  {item.excerpt}
                </Typography>
                <Button variant="text" color="blue" className="flex items-center gap-2">
                  Baca Selengkapnya
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsSection;