import apiClient from '@/api/axiosInstance';

// ✅ Helper function to generate slug from nama
const generateSlug = (nama, id) => {
  if (!nama) return id.toString();
  return nama
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/-+/g, '-')       // Replace multiple - with single -
    .substring(0, 100) + '-' + id; // Add ID at end
};

export const umkmService = {
  // Get all UMKM with pagination and filters
  getAll: async (params = {}) => {
    const response = await apiClient.get('/umkm', { params });
    
    // ✅ Add slug to each UMKM if not present
    if (response.data.success && response.data.data.data) {
      response.data.data.data = response.data.data.data.map(item => ({
        ...item,
        slug: item.slug || generateSlug(item.nama, item.id),
        // ✅ Map foto_utama to standard field names
        gambar_url: item.foto_utama,
        has_gambar: !!item.foto_utama,
        // ✅ Map kategori fields
        kategori: {
          key: item.kategori?.nama?.toLowerCase().replace(/\s+/g, '-') || 'umum',
          label: item.kategori?.nama || 'Umum',
          id: item.kategori?.id
        }
      }));
    }
    
    return response.data;
  },

  // Get UMKM by ID
  getById: async (id) => {
    const response = await apiClient.get(`/umkm/${id}`);
    
    // ✅ Add slug and map fields if not present
    if (response.data.success && response.data.data) {
      response.data.data = {
        ...response.data.data,
        slug: response.data.data.slug || generateSlug(response.data.data.nama, response.data.data.id),
        gambar_url: response.data.data.foto_utama,
        has_gambar: !!response.data.data.foto_utama,
        kategori: {
          key: response.data.data.kategori?.nama?.toLowerCase().replace(/\s+/g, '-') || 'umum',
          label: response.data.data.kategori?.nama || 'Umum',
          id: response.data.data.kategori?.id
        }
      };
    }
    
    return response.data;
  },

  // Get UMKM by slug
  getBySlug: async (slug) => {
    try {
      // Try to get by slug endpoint first
      const response = await apiClient.get(`/umkm/slug/${slug}`);
      return response.data;
    } catch (error) {
      // ✅ Fallback: Extract ID from slug (format: "nama-umkm-123")
      if (error.response?.status === 404) {
        const idMatch = slug.match(/-(\d+)$/);
        
        if (idMatch && idMatch[1]) {
          const id = idMatch[1];
          console.log('🔄 Fallback: Fetching UMKM by ID from slug:', id);
          return await umkmService.getById(id);
        }
        
        // Try searching by name
        const searchResponse = await apiClient.get('/umkm', {
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

  // Search UMKM
  search: async (query, params = {}) => {
    const response = await apiClient.get('/umkm', {
      params: { search: query, ...params }
    });
    return response.data;
  },

  // Filter by kategori
  getByKategori: async (kategori, params = {}) => {
    const response = await apiClient.get('/umkm', {
      params: { kategori, ...params }
    });
    return response.data;
  },

  // Get latest UMKM
  getLatest: async (limit = 5) => {
    const response = await apiClient.get('/umkm', {
      params: { per_page: limit, sort_by: 'created_at', order: 'desc' }
    });
    
    // ✅ Add slug to each item
    if (response.data.success && response.data.data.data) {
      response.data.data.data = response.data.data.data.map(item => ({
        ...item,
        slug: item.slug || generateSlug(item.nama, item.id),
        gambar_url: item.foto_utama,
        has_gambar: !!item.foto_utama,
        kategori: {
          key: item.kategori?.nama?.toLowerCase().replace(/\s+/g, '-') || 'umum',
          label: item.kategori?.nama || 'Umum',
          id: item.kategori?.id
        }
      }));
    }
    
    return response.data;
  },

  // Get available categories
  getAvailableCategories: async () => {
    try {
      const response = await apiClient.get('/umkm', {
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

export const kategoriUmkmService = {
  // Get all categories
  getAll: async () => {
    const response = await apiClient.get('/kategori-umkm');
    return response.data;
  },

  // Get single category
  getById: async (id) => {
    const response = await apiClient.get(`/kategori-umkm/${id}`);
    return response.data;
  },
};