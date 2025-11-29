import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";
import {
  CalendarIcon,
  UserIcon,
  EyeIcon,
  TagIcon,
  ArrowLeftIcon,
  ShareIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useBeritaDetail, useLatestBerita } from "@/hooks/useBerita";

export function BeritaDetail() {
  const { slug } = useParams(); // ✅ Bisa berisi slug atau ID
  const navigate = useNavigate();

  // ✅ Auto-detect akan dilakukan di hook
  const { 
    data: berita, 
    loading, 
    error 
  } = useBeritaDetail(slug); // ✅ Simplified - no need to specify type

  // ✅ Fetch latest berita for sidebar
  const { 
    data: latestBerita, 
    loading: latestLoading 
  } = useLatestBerita(5);

  // ✅ Helper to generate slug
  const generateSlug = (title, id) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100) + '-' + id;
  };

  // 🔍 DEBUG LOGS
  console.group('=== BERITA DETAIL DEBUG ===');
  console.log('📄 Slug/ID from URL:', slug);
  console.log('📊 Loading:', loading);
  console.log('❌ Error:', error);
  console.log('📈 Berita Data:', berita);
  console.log('📰 Latest Berita:', latestBerita);
  console.groupEnd();

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatDateShort = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: berita.judul,
        text: berita.excerpt || '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  // Calculate reading time (approx 200 words per minute)
  const calculateReadingTime = (content) => {
    if (!content) return '5 menit';
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} menit`;
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="h-96 bg-gray-200"></div>
                  <div className="p-8">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !berita) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="text-center py-12">
            <svg 
              className="w-16 h-16 mx-auto mb-4 text-red-500"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <Typography variant="h4" color="gray" className="mb-2">
              Berita Tidak Ditemukan
            </Typography>
            <Typography className="text-gray-600 mb-6">
              {error || 'Berita yang Anda cari tidak tersedia atau telah dihapus.'}
            </Typography>
            <Button
              color="green"
              onClick={() => navigate('/berita')}
              className="flex items-center gap-2 mx-auto"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Kembali ke Berita
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ✅ Extract data dari response
  const imageUrl = berita.has_gambar && berita.gambar_url
    ? berita.gambar_url
    : 'https://via.placeholder.com/1200x600?text=No+Image';

  const kategoriLabel = berita.kategori?.label || berita.kategori?.key || 'Umum';
  const kategoriKey = berita.kategori?.key || 'umum';

  // Kategori color mapping
  const kategoriColors = {
    'pengumuman': 'blue',
    'berita': 'green',
    'kegiatan': 'orange',
    'artikel': 'purple',
    'default': 'gray'
  };
  const kategoriColor = kategoriColors[kategoriKey] || kategoriColors.default;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="text"
            onClick={() => navigate('/berita')}
            className="flex items-center gap-2 text-green-600 hover:bg-green-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Daftar Berita
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {/* Featured Image */}
              <div className="relative h-96">
                <img
                  src={imageUrl}
                  alt={berita.judul}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/1200x600?text=Image+Not+Found';
                  }}
                />
                <div className="absolute top-4 left-4">
                  <Chip
                    value={kategoriLabel}
                    color={kategoriColor}
                    className="font-semibold"
                  />
                </div>
              </div>

              <CardBody className="p-8">
                {/* Title */}
                <Typography variant="h2" className="mb-4 text-gray-900">
                  {berita.judul}
                </Typography>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 pb-6 mb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="h-5 w-5" />
                    <Typography variant="small">
                      {berita.created_at_human || formatDateShort(berita.created_at)}
                    </Typography>
                  </div>

                  {berita.penulis && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <UserIcon className="h-5 w-5" />
                      <Typography variant="small">{berita.penulis}</Typography>
                    </div>
                  )}

                  {berita.views && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <EyeIcon className="h-5 w-5" />
                      <Typography variant="small">
                        {berita.views} views
                      </Typography>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600">
                    <ClockIcon className="h-5 w-5" />
                    <Typography variant="small">
                      {calculateReadingTime(berita.isi || berita.konten || berita.content)} baca
                    </Typography>
                  </div>
                </div>

                {/* Excerpt */}
                {berita.excerpt && (
                  <Typography 
                    variant="lead" 
                    className="text-gray-700 mb-6 font-medium italic border-l-4 border-green-500 pl-4"
                  >
                    {berita.excerpt}
                  </Typography>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none mb-8">
                  {berita.isi || berita.konten || berita.content ? (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: berita.isi || berita.konten || berita.content 
                      }} 
                    />
                  ) : (
                    <Typography className="text-gray-600">
                      Konten tidak tersedia.
                    </Typography>
                  )}
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-6">
                  <TagIcon className="h-5 w-5 text-gray-600" />
                  <Chip value={kategoriLabel} color={kategoriColor} />
                </div>

                {/* Share Button */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                  <Typography variant="h6" className="text-gray-700">
                    Bagikan:
                  </Typography>
                  <Button
                    size="sm"
                    variant="outlined"
                    color="green"
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    <ShareIcon className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Latest Berita */}
            <Card>
              <CardBody>
                <Typography variant="h6" className="mb-4">
                  Berita Terbaru
                </Typography>
                
                {latestLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : latestBerita.length > 0 ? (
                  <div className="space-y-4">
                    {latestBerita
                      .filter(item => item.id !== berita.id)
                      .slice(0, 5)
                      .map((item) => {
                        // ✅ Generate slug for sidebar items
                        const itemSlug = item.slug || generateSlug(item.judul, item.id);
                        
                        return (
                          <Link
                            key={item.id}
                            to={`/berita/${itemSlug}`}
                            className="block"
                          >
                            <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                              <img
                                src={
                                  item.has_gambar && item.gambar_url
                                    ? item.gambar_url
                                    : 'https://via.placeholder.com/100x100?text=No+Image'
                                }
                                alt={item.judul}
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <Typography
                                  variant="small"
                                  className="font-semibold line-clamp-2 hover:text-green-600 mb-1"
                                >
                                  {item.judul}
                                </Typography>
                                <Typography
                                  variant="small"
                                  className="text-gray-600 text-xs"
                                >
                                  {item.created_at_human || formatDateShort(item.created_at)}
                                </Typography>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                ) : (
                  <Typography variant="small" className="text-gray-500 text-center py-4">
                    Belum ada berita terbaru
                  </Typography>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeritaDetail;