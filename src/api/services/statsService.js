import axiosInstance from "../axiosInstance";

/**
 * Get total UMKM dari endpoint /umkm
 */
export const getUmkmCount = async () => {
  try {
    const response = await axiosInstance.get("/umkm");
    // Ambil length dari array data
    return response.data.data.data ? response.data.data.data.length : 0;
  } catch (error) {
    console.error("Error fetching UMKM:", error);
    return 0;
  }
};

/**
 * Get total Penduduk dari endpoint demografi
 */
export const getPendudukCount = async () => {
  try {
    const response = await axiosInstance.get("/demografi-penduduk");
    // Sesuaikan dengan struktur response API Anda
    if (response.data.data && response.data.data.length > 0) {
      const latest = response.data.data[0];
      return latest.total_penduduk || 0;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching Penduduk:", error);
    return 0;
  }
};

/**
 * Get total KK dari endpoint demografi
 */
export const getKKCount = async () => {
  try {
    const response = await axiosInstance.get("/demografi-penduduk");
    if (response.data.data && response.data.data.length > 0) {
      const latest = response.data.data[0];
      return latest.total_kk || 0;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching KK:", error);
    return 0;
  }
};

/**
 * Get total RT/RW dari endpoint dusun statistik
 */
export const getRtRwCount = async () => {
  try {
    const response = await axiosInstance.get("/dusun-statistik");
    if (response.data.data && Array.isArray(response.data.data)) {
      // Jumlahkan semua RT dan RW dari semua dusun
      const total = response.data.data.reduce((sum, dusun) => {
        return sum + (dusun.jumlah_rt || 0) + (dusun.jumlah_rw || 0);
      }, 0);
      return total;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching RT/RW:", error);
    return 0;
  }
};

/**
 * Get all stats sekaligus (parallel fetch)
 */
export const getAllStats = async () => {
  try {
    const [umkm, penduduk, kk, rtRw] = await Promise.all([
      getUmkmCount(),
      getPendudukCount(),
      getKKCount(),
      getRtRwCount(),
    ]);

    return {
      umkm,
      penduduk,
      kk,
      rt_rw: rtRw,
    };
  } catch (error) {
    console.error("Error fetching all stats:", error);
    return {
      umkm: 0,
      penduduk: 0,
      kk: 0,
      rt_rw: 0,
    };
  }
};