import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // ✅ Token handling (untuk route /user jika diperlukan nanti)
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🔄 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url);
    
    // Handle 401 Unauthorized (jika ada route protected di masa depan)
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized - Hapus auth token');
      localStorage.removeItem('auth_token');
      // window.location.href = '/login'; // Uncomment jika ada halaman login
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
