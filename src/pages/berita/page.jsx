// File: berita/page.jsx
import { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Chip,
  Select,
  Option,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BeritaList } from "./components/BeritaList";

export function BeritaContent() {
  const [searchQuery, setSearchQuery] = useState("");


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e3f8df] to-white">
      {/* Sticky Header dengan Search dan Filter */}
      <div className="">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Page Title */}
            <div className="flex-shrink-0">
              <Typography variant="h3" className="font-bold text-[#104911]">
                Berita Desa Krebet
              </Typography>
            </div>

            {/* Search + Kategori kecil di kanan */}
            <div className="w-full lg:w-auto flex items-center gap-3 justify-end">
              {/* Kategori Select (kecil) */}
              <div className="w-[160px]">
             
              </div>

              {/* Search Input Kecil */}
              <div className="w-[180px]">
                <Input
                  type="text"
                  label="Cari..."
                  value={searchQuery}
                  onChange={handleSearch}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  size="sm"
                  className="!border-gray-300 bg-[#eff7ee]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Berita List */}
      <div className="container mx-auto px-4 py-8">
        <BeritaList searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export function Berita() {
  return <BeritaContent />;
}

export default Berita;
