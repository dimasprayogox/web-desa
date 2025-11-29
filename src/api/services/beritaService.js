import apiClient from '@/api/axiosInstance';

// ✅ Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/-+/g, '-')       // Replace multiple - with single -
    .substring(0, 100);        // Limit to 100 characters
};

export const beritaService = {
  // Get all berita with pagination and filters
  getAll: async (params = {}) => {
    const response = await apiClient.get('/berita', { params });
    
    // ✅ Add slug to each berita if not present
    if (response.data.success && response.data.data.data) {
      response.data.data.data = response.data.data.data.map(item => ({
        ...item,
        slug: item.slug || generateSlug(item.judul) + '-' + item.id
      }));
    }
    
    return response.data;
  },

  // Get berita by ID
  getById: async (id) => {
    const response = await apiClient.get(`/berita/${id}`);
    
    // ✅ Add slug if not present
    if (response.data.success && response.data.data) {
      response.data.data.slug = response.data.data.slug || 
        generateSlug(response.data.data.judul) + '-' + response.data.data.id;
    }
    
    return response.data;
  },

  // ✅ Get berita by slug (extract ID from slug)
  getBySlug: async (slug) => {
    try {
      // Try to get by slug endpoint first
      const response = await apiClient.get(`/berita/slug/${slug}`);
      return response.data;
    } catch (error) {
      // ✅ Fallback: Extract ID from slug (format: "judul-berita-123")
      if (error.response?.status === 404) {
        const idMatch = slug.match(/-(\d+)$/);
        
        if (idMatch && idMatch[1]) {
          const id = idMatch[1];
          console.log('🔄 Fallback: Fetching by ID from slug:', id);
          return await beritaService.getById(id);
        }
        
        // Try searching by title
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

  // Increment view count
  incrementView: async (id) => {
    try {
      const response = await apiClient.post(`/berita/${id}/view`);
      return response.data;
    } catch (error) {
      console.warn('View increment not supported:', error);
      return { success: false };
    }
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

  // Get latest berita
  getLatest: async (limit = 5) => {
    const response = await apiClient.get('/berita', {
      params: { per_page: limit, sort_by: 'created_at', order: 'desc' }
    });
    
    // ✅ Add slug to each item
    if (response.data.success && response.data.data.data) {
      response.data.data.data = response.data.data.data.map(item => ({
        ...item,
        slug: item.slug || generateSlug(item.judul) + '-' + item.id
      }));
    }
    
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
          if (item.kategori && item.kategori.key) {
            categoriesSet.add(JSON.stringify({
              key: item.kategori.key,
              label: item.kategori.label
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
