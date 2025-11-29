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
import { useBeritaCategories } from "@/hooks/useBerita";

export function BeritaContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kategoriId, setKategoriId] = useState("all");

  // ✅ Fetch categories from API
  const { categories, loading: categoriesLoading } = useBeritaCategories();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // ✅ Handle kategori change from Select dropdown
  const handleKategoriChange = (value) => {
    setKategoriId(value || "all"); // ✅ Fallback to "all" if value is undefined
  };

  // ✅ Prepare category options for dropdown
  const categoryOptions = [
    { key: "all", label: "Semua Kategori" },
    ...(categories && categories.length > 0 ? categories : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ✅ Sticky Header dengan Search dan Filter */}
      <div className="">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* ✅ Page Title */}
            <div className="flex-shrink-0">
              <Typography variant="h3" className="font-bold text-gray-800">
                Berita Desa Krebet
              </Typography>
            </div>

            {/* ✅ Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[450px]">
              
              {/* ✅ Kategori Dropdown Filter */}
              <div className="w-full sm:w-48">
                {categoriesLoading ? (
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                ) : (
                  <Select
                    value={kategoriId}
                    onChange={handleKategoriChange}
                    label="Kategori"
                    className="!border-gray-300 bg-white"
                    containerProps={{ className: "min-w-[120px]" }}
                  >
                    {categoryOptions.map((kategori) => (
                      <Option key={kategori.key} value={kategori.key}>
                        {kategori.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>

              {/* ✅ Search Input */}
              <div className="w-full sm:flex-1 lg:w-64">
                <Input
                  type="text"
                  label="Cari berita..."
                  value={searchQuery}
                  onChange={handleSearch}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  size="md"
                  className="!border-gray-300 bg-white"
                  containerProps={{ className: "min-w-[200px]" }}
                />
              </div>
            </div>
          </div>

          {/* ✅ Active Filters Chips */}
                    {(searchQuery || kategoriId !== "all") && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                        <Typography variant="small" className="text-gray-600 mr-2">
                          Filter aktif:
                        </Typography>
                        
                        {kategoriId !== "all" && (
                          <Chip
                            value={categoryOptions.find(cat => cat.key === kategoriId)?.label || kategoriId}
                            color="green"
                            className="capitalize"
                            onClose={() => handleKategoriChange("all")}
                          />
                        )}
                        
                        {searchQuery && (
                          <Chip
                            value={`"${searchQuery}"`}
                            color="blue"
                            onClose={() => setSearchQuery("")}
                          />
                        )}
                      </div>
                    )}
        </div>
      </div>
      
      {/* ✅ Main Content - Berita List */}
      <div className="container mx-auto px-4 py-8">
        <BeritaList searchQuery={searchQuery} kategoriId={kategoriId} />
      </div>
    </div>
  );
}

export function Berita() {
  return <BeritaContent />;
}

export default Berita;