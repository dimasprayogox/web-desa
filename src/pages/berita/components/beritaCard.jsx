import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { CalendarIcon, TagIcon } from "@heroicons/react/24/outline";

export function BeritaCard({ berita }) {
  const imageUrl = berita.has_gambar && berita.gambar_url
    ? berita.gambar_url
    : 'https://via.placeholder.com/400x300?text=No+Image';

  const kategoriLabel = berita.kategori?.label || berita.kategori?.key || 'Umum';
  const kategoriKey = berita.kategori?.key || 'umum';

  const kategoriColors = {
    'pengumuman': 'green',
    'berita': 'yellow',
    'kegiatan': 'blue',
    'artikel': 'purple',
    'default': 'gray'
  };

  const kategoriColor = kategoriColors[kategoriKey] || kategoriColors.default;

  // ✅ Helper to generate slug if not present
  const generateSlug = (title, id) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100) + '-' + id;
  };

  // ✅ Use slug, fallback to generated slug, ultimate fallback to ID
  const linkSlug = berita.slug || generateSlug(berita.judul, berita.id);

  return (
    <Link to={`/berita/${linkSlug}`}>
      <Card className="hover:shadow-xl transition-all duration-300 h-full cursor-pointer group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={berita.judul}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
          />
          {/* Kategori Badge */}
          <div className="absolute top-3 right-3">
            <Chip
              value={kategoriLabel}
              color={kategoriColor}
              className="text-xs font-semibold"
              icon={<TagIcon className="h-3 w-3" />}
            />
          </div>
        </div>

        <CardBody className="flex flex-col flex-grow">
          {/* Judul */}
          <Typography
            variant="h6"
            className="mb-2 line-clamp-2 group-hover:text-green-600 transition-colors"
          >
            {berita.judul}
          </Typography>

          {/* Excerpt */}
          <Typography
            variant="small"
            className="text-gray-600 mb-3 line-clamp-3 flex-grow"
          >
            {berita.excerpt || 'Tidak ada deskripsi tersedia.'}
          </Typography>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-green-600 text-xs mt-auto pt-3 border-t">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{berita.created_at_human || 'Baru saja'}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export default BeritaCard;