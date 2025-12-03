// File: umkm/components/UmkmCard.jsx
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Chip,
} from "@material-tailwind/react";
import {
  MapPinIcon,
  PhoneIcon,
  TagIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";

export function UmkmCard({ umkm }) {
  // ✅ Handle image URL -gunakan foto_utama dari API
  const imageUrl = umkm.foto_utama || 
                   umkm.gambar_url || 
                   'https://via.placeholder.com/400x300?text=No+Image';

  // ✅ Format kategori dari response baru
  const kategoriLabel = umkm.kategori?.label || 
                       umkm.kategori?.nama || 
                       umkm.kategori?.key || 
                       'Umum';
  
  const kategoriKey = umkm.kategori?.key || 
                     umkm.kategori?.nama?.toLowerCase().replace(/\s+/g, '-') || 
                     'umum';

  // ✅ Kategori color mapping
  const kategoriColors = {
    'kuliner': 'orange',
    'kerajinan': 'brown',
    'fashion': 'pink',
    'jasa': 'blue',
    'pertanian': 'green',
    'makanan': 'orange',
    'minuman': 'cyan',
    'n': 'gray', // ✅ Handle kategori "n" dari data
    'default': 'gray'
  };

  const kategoriColor = kategoriColors[kategoriKey] || kategoriColors.default;

  // ✅ Helper to generate slug
  const generateSlug = (nama, id) => {
    if (!nama) return id;
    return nama
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100) + '-' + id;
  };

  // ✅ Use slug, fallback to generated slug
  const linkSlug = umkm.slug || generateSlug(umkm.nama, umkm.id);

  return (
    <Link to={`/umkm/${linkSlug}`}>
      <Card className="hover:shadow-xl transition-all duration-300 h-full cursor-pointer group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-100">
          <img
            src={imageUrl}
            alt={umkm.nama}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          
          {/* Kategori Badge */}
          <div className="absolute top-3 right-3">
            <Chip
              value={kategoriLabel}
              color={kategoriColor}
              className="text-xs font-semibold capitalize"
              icon={<TagIcon className="h-3 w-3" />}
            />
          </div>

          {/* Photo Count Badge */}
          {umkm.jumlah_foto > 0 && (
            <div className="absolute top-3 left-3">
              <Chip
                value={`${umkm.jumlah_foto} Foto`}
                color="white"
                size="sm"
                className="text-xs bg-white/90 backdrop-blur-sm text-green-700"
                icon={<PhotoIcon className="h-3 w-3" />}
              />
            </div>
          )}
        </div>

        <CardBody className="flex flex-col flex-grow">
          {/* Nama UMKM */}
          <Typography
            variant="h6"
            className="mb-2 line-clamp-2 group-hover:text-green-600 transition-colors capitalize"
          >
            {umkm.nama}
          </Typography>

          {/* Deskripsi */}
          <Typography
            variant="small"
            className="text-gray-600 mb-3 line-clamp-2 flex-grow"
          >
            {umkm.deskripsi || 'Tidak ada deskripsi tersedia.'}
          </Typography>

          {/* Footer Info */}
          <div className="space-y-2 mt-auto pt-3 border-t">
           

            {/* Alamat */}
            {umkm.alamat && (
              <div className="flex items-start gap-2 text-green-600">
                <MapPinIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <Typography variant="small" className="line-clamp-1 capitalize">
                  {umkm.alamat}
                </Typography>
              </div>
            )}

            {/* Telepon */}
            {umkm.telepon && (
              <div className="flex items-center gap-2 text-green-600">
                <PhoneIcon className="h-4 w-4" />
                <Typography variant="small">
                  {umkm.telepon}
                </Typography>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export default UmkmCard;