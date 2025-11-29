import { useState, useEffect } from 'react';
import { beritaService } from '@/api/services/beritaService';

// ✅ Main hook untuk fetch berita list dengan filter
export function useBerita(options = {}) {
  const {
    searchQuery = '',
    kategoriId = null,
    page = 1,
    perPage = 9,
    autoFetch = true
  } = options;

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (autoFetch) {
      fetchBerita();
    }
  }, [searchQuery, kategoriId, page, perPage]);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching berita...', { searchQuery, kategoriId, page, perPage });

      const params = {
        page,
        per_page: perPage,
      };

      // Add search query if exists
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // Add kategori filter if exists
      if (kategoriId && kategoriId !== 'all') {
        params.kategori = kategoriId;
      }

      const response = await beritaService.getAll(params);

      console.log('✅ Berita Response:', response);

      if (response.success && response.data) {
        const beritaData = response.data.data || [];
        
        setData(beritaData);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to,
        });
      } else {
        throw new Error('Format response tidak sesuai');
      }
    } catch (err) {
      console.error('❌ Error fetching berita:', err);
      setError(err.message || 'Gagal memuat data berita');
      setData([]);
      setPagination(null);
    } finally {
      setLoading(false);
      console.log('✅ Berita fetch complete');
    }
  };

  const refetch = () => {
    fetchBerita();
  };

  return {
    data,
    pagination,
    loading,
    error,
    refetch
  };
}

// ✅ UPDATED: Hook untuk single berita detail - Auto detect slug vs ID
export function useBeritaDetail(slugOrId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slugOrId) {
      fetchBerita();
    }
  }, [slugOrId]);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Fetching berita detail:`, slugOrId);

      // ✅ Auto-detect: Jika pure number, gunakan ID. Jika ada huruf/dash, gunakan slug
      const isNumericId = /^\d+$/.test(slugOrId);
      
      let response;
      
      if (isNumericId) {
        console.log('📊 Detected as ID:', slugOrId);
        response = await beritaService.getById(slugOrId);
      } else {
        console.log('🔗 Detected as Slug:', slugOrId);
        response = await beritaService.getBySlug(slugOrId);
      }

      console.log('✅ Berita Detail Response:', response);

      if (response.success && response.data) {
        setData(response.data);
        
        // Increment view count
        if (response.data.id) {
          beritaService.incrementView(response.data.id);
        }
      } else {
        throw new Error('Berita tidak ditemukan');
      }
    } catch (err) {
      console.error('❌ Error fetching berita detail:', err);
      setError(err.message || 'Gagal memuat detail berita');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchBerita };
}

// ✅ Hook untuk berita terbaru (sidebar)
export function useLatestBerita(limit = 5) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLatest();
  }, [limit]);

  const fetchLatest = async () => {
    try {
      setLoading(true);
      const response = await beritaService.getLatest(limit);
      
      if (response.success && response.data.data) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching latest berita:', err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchLatest };
}

// ✅ Hook untuk categories
export function useBeritaCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await beritaService.getAvailableCategories();
      
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, refetch: fetchCategories };
}

// ✅ ALIAS: Export useBeritaKategori sebagai alias dari useBeritaCategories
export const useBeritaKategori = useBeritaCategories;

// ✅ Default export
export default {
  useBerita,
  useBeritaDetail,
  useLatestBerita,
  useBeritaCategories,
  useBeritaKategori
};