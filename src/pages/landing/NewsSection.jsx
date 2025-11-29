import { Button, Typography, Card, CardBody, CardHeader, Chip } from "@material-tailwind/react";
import { ChevronRightIcon, CalendarIcon, EyeIcon, UserIcon, NewspaperIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useLatestBerita } from "@/hooks/useBerita";

export function NewsSection() {
  // ✅ Fetch 3 berita terbaru dari API
  const { data: latestNews, loading, error } = useLatestBerita(3);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'Asia/Jakarta'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const truncateText = (html, maxLength) => {
    if (!html) return '';
    // Remove HTML tags
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // ✅ Helper to generate slug
  const generateSlug = (title, id) => {
    if (!title) return id;
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100) + '-' + id;
  };

  // ✅ Loading State
  if (loading) {
    return (
      <section id="news" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-3xl lg:text-5xl font-bold text-blue-gray-900 mb-4">
              Berita & Informasi Desa
            </Typography>
            <Typography variant="lead" className="text-gray-600 max-w-3xl mx-auto">
              Update terbaru tentang kegiatan, program, dan pengumuman Desa Krebet
            </Typography>
          </div>

          {/* Loading Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-full animate-pulse">
                <CardHeader floated={false} className="h-56 m-0 rounded-t-xl bg-gray-300"></CardHeader>
                <CardBody className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <section id="news" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-3xl lg:text-5xl font-bold text-blue-gray-900 mb-4">
              Berita & Informasi Desa
            </Typography>
            <Typography variant="lead" className="text-gray-600 max-w-3xl mx-auto">
              Update terbaru tentang kegiatan, program, dan pengumuman Desa Krebet
            </Typography>
          </div>

          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <NewspaperIcon className="h-8 w-8 text-red-600" />
            </div>
            <Typography variant="h6" color="gray" className="mb-2">
              Gagal memuat berita
            </Typography>
            <Typography variant="small" className="text-gray-600 mb-6">
              {error}
            </Typography>
            <Link to="/berita">
              <Button color="blue" variant="outlined">
                Coba Lagi
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Empty State
  if (!latestNews || latestNews.length === 0) {
    return (
      <section id="news" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-3xl lg:text-5xl font-bold text-blue-gray-900 mb-4">
              Berita & Informasi Desa
            </Typography>
            <Typography variant="lead" className="text-gray-600 max-w-3xl mx-auto">
              Update terbaru tentang kegiatan, program, dan pengumuman Desa Krebet
            </Typography>
          </div>

          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <NewspaperIcon className="h-8 w-8 text-gray-400" />
            </div>
            <Typography variant="h6" color="gray" className="mb-2">
              Belum ada berita tersedia
            </Typography>
            <Typography variant="small" className="text-gray-600">
              Berita akan segera ditampilkan di sini
            </Typography>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Typography variant="h2" className="text-3xl lg:text-5xl font-bold text-blue-gray-900 mb-4">
            Berita & Informasi Desa
          </Typography>
          <Typography variant="lead" className="text-gray-600 max-w-3xl mx-auto">
            Update terbaru tentang kegiatan, program, dan pengumuman Desa Krebet
          </Typography>
        </div>

        {/* News Grid - Only 3 items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {latestNews.map((item) => {
            // ✅ Extract data dengan fallback
            const imageUrl = item.has_gambar && item.gambar_url
              ? item.gambar_url
              : item.gambar || 'https://via.placeholder.com/600x400?text=No+Image';

            const kategoriLabel = item.kategori?.label || item.kategori?.key || item.kategori?.nama || 'Berita';
            const linkSlug = item.slug || generateSlug(item.judul, item.id);

            return (
              <Link key={item.id} to={`/berita/${linkSlug}`}>
                <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group h-full">
                  <CardHeader floated={false} className="relative h-56 m-0 rounded-t-xl overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={item.judul}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                      }}
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Chip
                        value={kategoriLabel}
                        className="bg-blue-600 text-white font-semibold"
                        size="sm"
                      />
                    </div>

                    {/* Views Badge (if available) */}
                    {item.views && (
                      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                        <EyeIcon className="h-4 w-4 text-white" />
                        <Typography variant="small" className="text-white font-medium">
                          {item.views}
                        </Typography>
                      </div>
                    )}
                  </CardHeader>

                  <CardBody className="p-6">
                    {/* Date & Author */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <Typography variant="small">
                          {item.created_at_human || formatDate(item.created_at || item.tanggal_publikasi)}
                        </Typography>
                      </div>
                      {item.penulis && (
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          <Typography variant="small">
                            {item.penulis}
                          </Typography>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <Typography 
                      variant="h5" 
                      className="font-bold text-blue-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {item.judul}
                    </Typography>

                    {/* Excerpt */}
                    <Typography className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {item.excerpt || truncateText(item.isi || item.konten || item.content, 120)}
                    </Typography>

                    {/* Read More Button */}
                    <Button 
                      variant="text" 
                      color="blue" 
                      className="flex items-center gap-2 p-0 group-hover:gap-3 transition-all"
                    >
                      Baca Selengkapnya
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/berita">
            <Button 
              size="lg" 
              color="blue"
              className="flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all"
            >
              Lihat Berita Lainnya
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NewsSection;