import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Chip,
  Button,
  Spinner,
  Alert,
} from '@material-tailwind/react';
import {
  MapPinIcon,
  PhoneIcon,
  TagIcon,
  ArrowLeftIcon,
  ShareIcon,
  CalendarIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { useUmkmDetail } from '@/hooks/useUmkm';
import { useState } from 'react';

export function UmkmDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: umkm, loading, error } = useUmkmDetail(slug);
  const [selectedImage, setSelectedImage] = useState(0);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner className="h-12 w-12" color="green" />
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert color="red" className="mb-4">
          {error}
        </Alert>
        <Button
          variant="outlined"
          onClick={() => navigate('/umkm')}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali ke Daftar UMKM
        </Button>
      </div>
    );
  }

  // ✅ Not found state
  if (!umkm) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert color="amber" className="mb-4">
          UMKM tidak ditemukan
        </Alert>
        <Button
          variant="outlined"
          onClick={() => navigate('/umkm')}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali ke Daftar UMKM
        </Button>
      </div>
    );
  }

  // ✅ Prepare images
  const prepareImages = () => {
    const imageList = [];
    
    // Main image (foto_utama)
    const mainImage = umkm.foto_utama || umkm.gambar_url;
    if (mainImage) {
      imageList.push(mainImage);
    }
    
    // Gallery images (skip jika sama dengan mainImage)
    if (Array.isArray(umkm.foto_galeri)) {
      umkm.foto_galeri.forEach(url => {
        if (url && url !== mainImage && !imageList.includes(url)) {
          imageList.push(url);
        }
      });
    }
    
    // Fallback jika tidak ada gambar sama sekali
    if (imageList.length === 0) {
      imageList.push('https://via.placeholder.com/800x600?text=No+Image');
    }
    
    return imageList;
  };

  const images = prepareImages();

  // ✅ Format kategori
  const kategoriLabel = umkm.kategori?.label || 
                       umkm.kategori?.nama || 
                       umkm.kategori?.key || 
                       'Umum';
  
  const kategoriKey = umkm.kategori?.key || 
                     umkm.kategori?.nama?.toLowerCase().replace(/\s+/g, '-') || 
                     'umum';

  const kategoriColors = {
    'kuliner': 'orange',
    'kerajinan': 'brown',
    'fashion': 'pink',
    'jasa': 'blue',
    'pertanian': 'green',
    'makanan': 'orange',
    'minuman': 'cyan',
    'default': 'gray'
  };

  const kategoriColor = kategoriColors[kategoriKey] || kategoriColors.default;

  // ✅ Share function
  const handleShare = async () => {
    const shareData = {
      title: umkm.nama,
      text: umkm.deskripsi || `Lihat UMKM ${umkm.nama}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // small feedback
        alert('Link berhasil disalin ke clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      alert('Gagal membagikan. Silakan coba salin link secara manual.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e3f8df] to-white py-8">
      {/* Header/Breadcrumb */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex items-center justify-between">
          <Button
            variant="text"
            onClick={() => navigate('/umkm')}
            className="flex items-center gap-2 text-green-800 hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Daftar UMKM
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <Card>
              <CardBody className="p-0">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={images[selectedImage]}
                    alt={umkm.nama}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                    }}
                  />
                  
                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 right-4">
                      <Chip
                        value={`${selectedImage + 1} / ${images.length}`}
                        color="white"
                        className="bg-green-600 backdrop-blur-sm"
                        icon={<PhotoIcon className="h-4 w-4" />}
                      />
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2 p-4">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`
                          relative aspect-square overflow-hidden rounded-lg 
                          border-2 transition-all
                          ${selectedImage === idx 
                            ? 'border-green-600 ring-2 ring-green-600' 
                            : 'border-gray-200 hover:border-green-400'
                          }
                        `}
                      >
                        <img
                          src={img}
                          alt={`${umkm.nama} - ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Deskripsi */}
            <Card>
              <CardBody>
                <Typography variant="h5" className="mb-4 flex items-center gap-2">
                  Deskripsi UMKM
                </Typography>
                <Typography className="text-gray-700 whitespace-pre-line">
                  {umkm.deskripsi || 'Tidak ada deskripsi tersedia.'}
                </Typography>
              </CardBody>
            </Card>

            {/* Produk/Layanan (jika ada) */}
            {umkm.produk && umkm.produk.length > 0 && (
              <Card>
                <CardBody>
                  <Typography variant="h5" className="mb-4">
                    Produk & Layanan
                  </Typography>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {umkm.produk.map((produk, idx) => (
                      <Chip
                        key={idx}
                        value={produk}
                        variant="outlined"
                        color="green"
                        className="justify-center"
                      />
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Right Column - Detail Info */}
          <div className="space-y-6">
            {/* Header Info */}
            <Card>
              <CardBody className="space-y-4">
                {/* Nama */}
                <div>
                  <Typography variant="h4" className="mb-2 capitalize">
                    {umkm.nama}
                  </Typography>
                  
                  {/* Kategori */}
                  <Chip
                    value={kategoriLabel}
                    color={kategoriColor}
                    icon={<TagIcon className="h-4 w-4" />}
                    className="capitalize"
                  />
                </div>

                <div className="border-t pt-4 space-y-3">
                  {/* Pemilik */}
                  {umkm.pemilik && (
                    <div>
                      <Typography variant="small" className="text-gray-600 mb-1">
                        Pemilik
                      </Typography>
                      <Typography className="font-semibold capitalize">
                        {umkm.pemilik}
                      </Typography>
                    </div>
                  )}

                  {/* Alamat */}
{umkm.alamat && (
  <div>
    <Typography variant="small" className="text-gray-600 mb-1 flex items-center gap-1">
      <MapPinIcon className="h-4 w-4" />
      Alamat
    </Typography>

    {/* Batas ukuran card: max height + scroll jika overflow */}
    <div className="max-h-24 overflow-auto pr-2">
      <Typography className="capitalize whitespace-pre-line text-sm">
        {umkm.alamat}
      </Typography>
    </div>
  </div>
)}


                  {/* Telepon */}
                  {umkm.telepon && (
                    <div>
                      <Typography variant="small" className="text-gray-600 mb-1 flex items-center gap-1">
                        <PhoneIcon className="h-4 w-4" />
                        Telepon
                      </Typography>
                      <a
                        href={`tel:${umkm.telepon}`}
                        className="font-semibold text-green-600 hover:text-green-700"
                      >
                        {umkm.telepon}
                      </a>
                    </div>
                  )}

                  {/* Email */}
                  {umkm.email && (
                    <div>
                      <Typography variant="small" className="text-gray-600 mb-1">
                        Email
                      </Typography>
                      <a
                        href={`mailto:${umkm.email}`}
                        className="font-semibold text-green-600 hover:text-green-700 break-all"
                      >
                        {umkm.email}
                      </a>
                    </div>
                  )}

                  {/* Website */}
                  {umkm.website && (
                    <div>
                      <Typography variant="small" className="text-gray-600 mb-1">
                        Website
                      </Typography>
                      <a
                        href={umkm.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-green-600 hover:text-green-700 break-all"
                      >
                        {umkm.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t">
                  {/* Grid: 1 col mobile, 2 col desktop */}
                  <div className="grid grid-cols-1  gap-3">
                    {umkm.telepon && (
                      <Button
                        color="green"
                        fullWidth
                        className="flex items-center justify-center gap-2"
                        onClick={() => window.open(`https://wa.me/${umkm.telepon.replace(/[^0-9]/g, '')}`, '_blank')}
                      >
                        <PhoneIcon className="h-5 w-5" />
                        Hubungi via WhatsApp
                      </Button>
                    )}

                  </div>
                  <div className="grid grid-cols-1 gap-3 pt-4">

                    {/* Tombol Bagikan (diperbaiki tampilannya) */}
                    <Button
                      variant="outlined"
                      size="sm"
                      color="green"
                      fullWidth
                      onClick={handleShare}
                      aria-label="Bagikan UMKM"
                      title="Bagikan link UMKM (salin jika browser tidak mendukung Web Share)"
                      className="flex items-center justify-center gap-2"
                    >
                      <ShareIcon className="h-4 w-4" />
                      Bagikan
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UmkmDetail;
