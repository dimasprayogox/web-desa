import { useState, useEffect, useCallback } from "react";
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
import { UmkmList } from "./components/UmkmList";
import { useUmkmCategories } from "@/hooks/useUmkm";

export function UmkmContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [kategoriId, setKategoriId] = useState("all");

  // ✅ Fetch categories from API
  const { categories, loading: categoriesLoading } = useUmkmCategories();

  // ✅ Debounce search query (tunggu 500ms setelah user stop typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKategoriChange = (value) => {
    console.log('🏷️ Kategori changed to:', value);
    setKategoriId(value || "all");
  };

  // ✅ Prepare category options
  const categoryOptions = [
    { key: "all", label: "Semua Kategori" },
    ...(categories && categories.length > 0 ? categories : []),
  ];

  const getCurrentKategoriName = () => {
    if (kategoriId === "all") return "Semua Kategori";
    const current = categories?.find(cat => String(cat.key) === String(kategoriId));
    return current?.label || `Kategori ${kategoriId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e3f8df] to-white">
      {/* Header */}
      <div className="">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Title */}
            <div className="flex-shrink-0">
              <Typography variant="h3" className="font-bold text-[#104911]">
                UMKM Desa Krebet
              </Typography>
            </div>

            {/* Search + Kategori */}

              <div className="w-full lg:w-auto flex items-center gap-4 lg:gap-12 justify-end">

              {/* Kategori Dropdown */}
              <div className="w-[160px]">
                {categoriesLoading ? (
                  <div className="h-10 bg-green-200 rounded-lg animate-pulse"></div>
                ) : (
                  <Select
                    value={kategoriId}
                    onChange={handleKategoriChange}
                    label="Kategori"
                    size="sm"
                    className="!border-gray-300 bg-[#eff7ee]"
                  >
                    {categoryOptions.map((kategori) => (
                      <Option key={kategori.key} value={kategori.key}>
                        {kategori.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>

              {/* Search Input */}
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

      {/* UMKM List */}
      <div className="container mx-auto px-4 py-8">
        <UmkmList 
          searchQuery={debouncedSearchQuery} 
          kategoriId={kategoriId} 
        />
      </div>
    </div>
  );
}

export function Umkm() {
  return <UmkmContent />;
}

export default Umkm;