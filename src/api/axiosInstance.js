import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Request interceptor (mis. tambah token)
axiosInstance.interceptors.request.use(
  (config) => {
    // ambil token dari localStorage atau context
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (global error handling / refresh token)
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    // contoh sederhana: jika 401 -> logout / refresh token
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
