import { useState, useEffect } from "react";
import { Typography, IconButton } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { UmkmCard } from "./UmkmCard";
import { useUmkm } from "@/hooks/useUmkm";

export function UmkmList({ searchQuery, kategoriId }) {
  const [page, setPage] = useState(1);

  // ✅ Use custom hook to fetch UMKM from API
  const { data: umkm, pagination, loading, error } = useUmkm({
    searchQuery,
    kategoriId,
    page,
    perPage: 9,
    autoFetch: true,
  });

  // ✅ Reset page when search/kategori changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, kategoriId]);

  // ✅ Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination) return [];

    const { current_page, last_page } = pagination;
    const pages = [];
    const maxVisible = 5;

    if (last_page <= maxVisible) {
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      if (current_page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(last_page);
      } else if (current_page >= last_page - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = last_page - 3; i <= last_page; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(current_page - 1);
        pages.push(current_page);
        pages.push(current_page + 1);
        pages.push("...");
        pages.push(last_page);
      }
    }

    return pages;
  };

  // Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4 bg-white rounded-b-lg">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
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
        <Typography color="red" variant="h6" className="mb-2">
          Gagal Memuat Data UMKM
        </Typography>
        <Typography variant="small" className="text-red-600">
          {error}
        </Typography>
      </div>
    );
  }

  // Empty State
  if (!umkm || umkm.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-100 rounded-lg">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <Typography color="gray" variant="h6" className="mb-2">
          Tidak ada UMKM ditemukan
        </Typography>
        <Typography variant="small" className="text-gray-600">
          {searchQuery && `Pencarian untuk "${searchQuery}" tidak ditemukan. `}
          {kategoriId && kategoriId !== "all" && `Kategori "${kategoriId}" tidak memiliki UMKM. `}
          Coba kata kunci atau kategori lain.
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Total */}
      {pagination && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-4 border-b border-gray-200">
          <Typography variant="small" className="text-gray-600 font-medium">
            Menampilkan {pagination.from || 0} - {pagination.to || 0} dari{" "}
            <span className="font-bold text-green-600">{pagination.total || 0}</span> UMKM
          </Typography>
          {searchQuery && (
            <Typography variant="small" className="text-gray-600 italic">
              Hasil pencarian: "<span className="font-semibold">{searchQuery}</span>"
            </Typography>
          )}
        </div>
      )}

      {/* UMKM Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {umkm.map((item) => (
          <UmkmCard key={item.id} umkm={item} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex flex-col items-center gap-4 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <IconButton
              variant="text"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="text-green-600 hover:bg-green-50 disabled:opacity-30"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </IconButton>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, index) => {
                if (pageNum === "...") {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }

                return (
                  <IconButton
                    key={pageNum}
                    variant={page === pageNum ? "filled" : "text"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={
                      page === pageNum
                        ? "bg-green-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  >
                    {pageNum}
                  </IconButton>
                );
              })}
            </div>

            <IconButton
              variant="text"
              size="sm"
              disabled={page === pagination.last_page}
              onClick={() => setPage(page + 1)}
              className="text-green-600 hover:bg-green-50 disabled:opacity-30"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </IconButton>
          </div>

          <Typography variant="small" className="text-gray-600">
            Halaman{" "}
            <span className="font-semibold text-green-600">{pagination.current_page}</span> dari{" "}
            <span className="font-semibold">{pagination.last_page}</span>
          </Typography>
        </div>
      )}
    </div>
  );
}

export default UmkmList;