import apiClient from '@/api/axiosInstance';

// ✅ Helper function to generate slug from nama
const generateSlug = (nama, id) => {
  if (!nama) return id.toString();
  return nama
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100) + '-' + id;
};

export const umkmService = {
  // Get all UMKM with pagination and filters
  getAll: async (params = {}) => {
    try {
      // ✅ Clean params - hapus nilai null/undefined/empty/'all'
      const cleanParams = {};
      
      // ✅ Only add valid params
      if (params.page) cleanParams.page = params.page;
      if (params.per_page) cleanParams.per_page = params.per_page;
      
      // ✅ Search - pastikan tidak kosong
      if (params.search && typeof params.search === 'string' && params.search.trim() !== '') {
        cleanParams.search = params.search.trim();
      }
      
      // ✅ Kategori - pastikan tidak 'all'
      if (params.kategori && params.kategori !== 'all') {
        cleanParams.kategori = params.kategori;
      }
      
      // ✅ Sort params
      if (params.sort_by) cleanParams.sort_by = params.sort_by;
      if (params.order) cleanParams.order = params.order;

      console.log('📤 umkmService.getAll - Clean params:', cleanParams);

      const response = await apiClient.get('/umkm', { params: cleanParams });
      
      console.log('✅ umkmService.getAll - Response:', response.data);
      
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
    } catch (error) {
      console.error('❌ umkmService.getAll - Error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error message:', error.response?.data?.message);
      throw error;
    }
  },

  // Get UMKM by ID
  getById: async (id) => {
    try {
      console.log('📤 umkmService.getById:', id);
      
      const response = await apiClient.get(`/umkm/${id}`);
      
      console.log('✅ umkmService.getById - Response:', response.data);
      
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
    } catch (error) {
      console.error('❌ umkmService.getById - Error:', error);
      throw error;
    }
  },

  // ✅ Get UMKM by slug (extract ID from slug format: "nama-umkm-123")
  getBySlug: async (slug) => {
    try {
      console.log('📤 umkmService.getBySlug:', slug);
      
      // ✅ Extract ID from slug (format: "testestes-4" → ID = 4)
      const idMatch = slug.match(/-(\d+)$/);
      
      if (idMatch && idMatch[1]) {
        const id = idMatch[1];
        console.log('✅ Extracted ID from slug:', id);
        
        // ✅ Gunakan getById langsung
        return await umkmService.getById(id);
      } else {
        // ✅ Jika tidak ada ID di slug, coba search by nama
        console.log('⚠️ No ID found in slug, searching by name...');
        
        const searchName = slug.replace(/-/g, ' ');
        const response = await apiClient.get('/umkm', {
          params: { 
            search: searchName,
            per_page: 1 
          }
        });
        
        if (response.data.success && response.data.data.data.length > 0) {
          const umkm = response.data.data.data[0];
          
          return {
            success: true,
            data: {
              ...umkm,
              slug: umkm.slug || generateSlug(umkm.nama, umkm.id),
              gambar_url: umkm.foto_utama,
              has_gambar: !!umkm.foto_utama,
              kategori: {
                key: umkm.kategori?.nama?.toLowerCase().replace(/\s+/g, '-') || 'umum',
                label: umkm.kategori?.nama || 'Umum',
                id: umkm.kategori?.id
              }
            }
          };
        }
        
        throw new Error('UMKM tidak ditemukan');
      }
    } catch (error) {
      console.error('❌ umkmService.getBySlug - Error:', error);
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

// ✅ Export kategoriUmkmService separately
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