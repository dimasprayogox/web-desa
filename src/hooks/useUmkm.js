import { useState, useEffect } from 'react';
import { umkmService } from '@/api/services/umkmService';

// ✅ Main hook untuk fetch UMKM list dengan filter
export function useUmkm(options = {}) {
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
      fetchUmkm();
    }
  }, [searchQuery, kategoriId, page, perPage]);

  const fetchUmkm = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching UMKM...', { searchQuery, kategoriId, page, perPage });

      const params = {
        page,
        per_page: perPage,
      };

      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (kategoriId && kategoriId !== 'all') {
        params.kategori = kategoriId;
      }

      const response = await umkmService.getAll(params);

      console.log('✅ UMKM Response:', response);

      if (response.success && response.data) {
        const umkmData = response.data.data || [];
        
        setData(umkmData);
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
      console.error('❌ Error fetching UMKM:', err);
      setError(err.message || 'Gagal memuat data UMKM');
      setData([]);
      setPagination(null);
    } finally {
      setLoading(false);
      console.log('✅ UMKM fetch complete');
    }
  };

  const refetch = () => {
    fetchUmkm();
  };

  return {
    data,
    pagination,
    loading,
    error,
    refetch
  };
}

// ✅ Hook untuk single UMKM detail
export function useUmkmDetail(idOrSlug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idOrSlug) {
      fetchUmkm();
    }
  }, [idOrSlug]);

  const fetchUmkm = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Fetching UMKM detail:`, idOrSlug);

      // ✅ Auto-detect: Jika pure number, gunakan ID. Jika ada huruf/dash, gunakan slug
      const isNumericId = /^\d+$/.test(idOrSlug);
      
      let response;
      
      if (isNumericId) {
        console.log('📊 Detected as ID:', idOrSlug);
        response = await umkmService.getById(idOrSlug);
      } else {
        console.log('🔗 Detected as Slug:', idOrSlug);
        response = await umkmService.getBySlug(idOrSlug);
      }

      console.log('✅ UMKM Detail Response:', response);

      if (response.success && response.data) {
        setData(response.data);
      } else {
        throw new Error('UMKM tidak ditemukan');
      }
    } catch (err) {
      console.error('❌ Error fetching UMKM detail:', err);
      setError(err.message || 'Gagal memuat detail UMKM');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchUmkm };
}

// ✅ Hook untuk UMKM terbaru
export function useLatestUmkm(limit = 5) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLatest();
  }, [limit]);

  const fetchLatest = async () => {
    try {
      setLoading(true);
      const response = await umkmService.getLatest(limit);
      
      if (response.success && response.data.data) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching latest UMKM:', err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchLatest };
}

// ✅ Hook untuk categories
export function useUmkmCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await umkmService.getAvailableCategories();
      
      if (response.success && response.data.length > 0) {
        setCategories(response.data);
      } else {
        // ✅ Fallback to default categories
        setCategories([
          { key: 'kuliner', label: 'Kuliner' },
          { key: 'kerajinan', label: 'Kerajinan' },
          { key: 'fashion', label: 'Fashion' },
          { key: 'jasa', label: 'Jasa' },
          { key: 'pertanian', label: 'Pertanian' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // ✅ Use default categories on error
      setCategories([
        { key: 'kuliner', label: 'Kuliner' },
        { key: 'kerajinan', label: 'Kerajinan' },
        { key: 'fashion', label: 'Fashion' },
        { key: 'jasa', label: 'Jasa' },
        { key: 'pertanian', label: 'Pertanian' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, refetch: fetchCategories };
}

export default {
  useUmkm,
  useUmkmDetail,
  useLatestUmkm,
  useUmkmCategories
};