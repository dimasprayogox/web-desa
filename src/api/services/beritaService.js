import apiClient from '@/api/axiosInstance';

// ✅ Helper function to generate slug from judul
const generateSlug = (judul, id) => {
  if (!judul) return id.toString();
  return judul
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100) + '-' + id;
};

export const beritaService = {
  // Get all berita with pagination and filters
  getAll: async (params = {}) => {
    const response = await apiClient.get('/berita', { params });
    
    if (response.data.success && response.data.data.data) {
      response.data.data.data = response.data.data.data.map(item => ({
        ...item,
        slug: item.slug || generateSlug(item.judul, item.id),
        gambar_url: item.gambar_url || item.gambar,
        has_gambar: !!item.gambar_url || !!item.gambar,
        kategori: {
          key: item.kategori?.key || item.kategori?.nama?.toLowerCase().replace(/\s+/g, '-') || 'berita',
          label: item.kategori?.label || item.kategori?.nama || 'Berita',
          id: item.kategori?.id
        }
      }));
    }
    
    return response.data;
  },

  // Get berita by ID
  getById: async (id) => {
    const response = await apiClient.get(`/berita/${id}`);
    
    if (response.data.success && response.data.data) {
      response.data.data = {
        ...response.data.data,
        slug: response.data.data.slug || generateSlug(response.data.data.judul, response.data.data.id),
        gambar_url: response.data.data.gambar_url || response.data.data.gambar,
        has_gambar: !!response.data.data.gambar_url || !!response.data.data.gambar,
        kategori: {
          key: response.data.data.kategori?.key || response.data.data.kategori?.nama?.toLowerCase().replace(/\s+/g, '-') || 'berita',
          label: response.data.data.kategori?.label || response.data.data.kategori?.nama || 'Berita',
          id: response.data.data.kategori?.id
        }
      };
    }
    
    return response.data;
  },

  // Get berita by slug
  getBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/berita/slug/${slug}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        const idMatch = slug.match(/-(\d+)$/);
        
        if (idMatch && idMatch[1]) {
          const id = idMatch[1];
          console.log('🔄 Fallback: Fetching Berita by ID from slug:', id);
          return await beritaService.getById(id);
        }
        
        const searchResponse = await apiClient.get('/berita', {
          params: { search: slug.replace(/-/g, ' '), per_page: 1 }
        });
        
        if (searchResponse.data.success && searchResponse.data.data.data.length > 0) {
          return {
            success: true,
            data: searchResponse.data.data.data[0]
          };
        }
      }
      throw error;
    }
  },

  // ✅ TAMBAHKAN - Increment view count
  incrementView: async (id) => {
    try {
      const response = await apiClient.post(`/berita/${id}/view`);
      console.log('📊 View count incremented for berita:', id);
      return response.data;
    } catch (error) {
      // ⚠️ Jangan throw error jika gagal increment view
      // Agar tidak mengganggu loading halaman detail
      console.warn('⚠️ Failed to increment view count:', error.message);
      return { success: false };
    }
  },

  // Get latest berita
  getLatest: async (limit = 5) => {
    const response = await apiClient.get('/berita', { 
      params: { 
        per_page: limit,
        sort_by: 'created_at',
        order: 'desc'
      } 
    });
    
    if (response.data.success && response.data.data.data) {
      response.data.data.data = response.data.data.data.map(item => ({
        ...item,
        slug: item.slug || generateSlug(item.judul, item.id),
        gambar_url: item.gambar_url || item.gambar,
        has_gambar: !!item.gambar_url || !!item.gambar,
        kategori: {
          key: item.kategori?.key || item.kategori?.nama?.toLowerCase().replace(/\s+/g, '-') || 'berita',
          label: item.kategori?.label || item.kategori?.nama || 'Berita',
          id: item.kategori?.id
        }
      }));
    }
    
    return response.data;
  },

  // Search berita
  search: async (query, params = {}) => {
    const response = await apiClient.get('/berita', {
      params: { search: query, ...params }
    });
    return response.data;
  },

  // Filter by kategori
  getByKategori: async (kategori, params = {}) => {
    const response = await apiClient.get('/berita', {
      params: { kategori, ...params }
    });
    return response.data;
  },

  // Get popular berita
  getPopular: async (limit = 5) => {
    const response = await apiClient.get('/berita', {
      params: { 
        per_page: limit,
        sort_by: 'views',
        order: 'desc'
      }
    });
    return response.data;
  },

  // Get available categories
  getAvailableCategories: async () => {
    try {
      const response = await apiClient.get('/berita', {
        params: { per_page: 100 }
      });

      if (response.data.success && response.data.data.data) {
        const categoriesSet = new Set();
        response.data.data.data.forEach(item => {
          if (item.kategori && item.kategori.nama) {
            categoriesSet.add(JSON.stringify({
              key: item.kategori.nama.toLowerCase().replace(/\s+/g, '-'),
              label: item.kategori.nama,
              id: item.kategori.id
            }));
          }
        });

        const categories = Array.from(categoriesSet).map(str => JSON.parse(str));

        return {
          success: true,
          data: categories
        };
      }

      return {
        success: true,
        data: []
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        data: []
      };
    }
  }
};

export default beritaService;
