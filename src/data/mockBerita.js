export const mockKategori = [
  { id: 1, nama: "Pembangunan", berita_count: 5 },
  { id: 2, nama: "Kegiatan Desa", berita_count: 8 },
  { id: 3, nama: "Pengumuman", berita_count: 3 },
  { id: 4, nama: "Kesehatan", berita_count: 4 },
  { id: 5, nama: "Pendidikan", berita_count: 2 },
];

export const mockBerita = [
  {
    id: 1,
    judul: "Pembangunan Jalan Desa Krebet Tahap 2 Dimulai",
    slug: "pembangunan-jalan-desa-krebet-tahap-2",
    isi: "<p>Pemerintah Desa Krebet memulai pembangunan jalan tahap 2 sepanjang 2 km yang menghubungkan RT 5 dan RT 6. Pembangunan ini diharapkan selesai dalam 3 bulan dan akan memudahkan akses warga ke area persawahan.</p>",
    gambar: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
    kategori_id: 1,
    kategori: { id: 1, nama: "Pembangunan" },
    penulis: "Admin Desa",
    tanggal_publikasi: "2024-11-20T10:00:00",
    views: 245,
  },
  {
    id: 2,
    judul: "Posyandu Balita Bulan November 2024",
    slug: "posyandu-balita-november-2024",
    isi: "<p>Kegiatan Posyandu Balita akan dilaksanakan pada tanggal 25 November 2024 di Balai Desa. Seluruh ibu dengan balita diharapkan hadir untuk penimbangan dan imunisasi.</p>",
    gambar: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    kategori_id: 4,
    kategori: { id: 4, nama: "Kesehatan" },
    penulis: "Bidan Desa",
    tanggal_publikasi: "2024-11-18T14:30:00",
    views: 189,
  },
  {
    id: 3,
    judul: "Gotong Royong Pembersihan Sungai Desa",
    slug: "gotong-royong-pembersihan-sungai",
    isi: "<p>Warga Desa Krebet bergotong royong membersihkan sungai yang melintasi desa. Kegiatan ini diikuti lebih dari 100 warga dan berhasil mengangkat sampah sebanyak 500 kg.</p>",
    gambar: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
    kategori_id: 2,
    kategori: { id: 2, nama: "Kegiatan Desa" },
    penulis: "Karang Taruna",
    tanggal_publikasi: "2024-11-15T08:00:00",
    views: 312,
  },
  {
    id: 4,
    judul: "Pendaftaran Beasiswa Siswa Berprestasi Tahun 2024",
    slug: "pendaftaran-beasiswa-siswa-berprestasi-2024",
    isi: "<p>Pemerintah Desa membuka pendaftaran beasiswa untuk siswa berprestasi. Kuota sebanyak 20 siswa dengan bantuan Rp 1.000.000 per siswa. Pendaftaran dibuka hingga 30 November 2024.</p>",
    gambar: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
    kategori_id: 5,
    kategori: { id: 5, nama: "Pendidikan" },
    penulis: "Sekretaris Desa",
    tanggal_publikasi: "2024-11-12T09:00:00",
    views: 428,
  },
  {
    id: 5,
    judul: "Festival UMKM Desa Krebet 2024",
    slug: "festival-umkm-desa-krebet-2024",
    isi: "<p>Festival UMKM akan digelar pada 1-3 Desember 2024 di lapangan desa. Akan ada bazar produk lokal, lomba kuliner, dan pertunjukan seni budaya. Gratis untuk umum!</p>",
    gambar: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    kategori_id: 2,
    kategori: { id: 2, nama: "Kegiatan Desa" },
    penulis: "Pokdarwis Krebet",
    tanggal_publikasi: "2024-11-10T11:00:00",
    views: 567,
  },
  {
    id: 6,
    judul: "Pemberitahuan Jadwal Pemadaman Listrik",
    slug: "pemberitahuan-jadwal-pemadaman-listrik",
    isi: "<p>PLN akan melakukan pemadaman listrik terjadwal pada 28 November 2024 pukul 08.00-16.00 WIB untuk pemeliharaan jaringan. Mohon maklum atas ketidaknyamanan ini.</p>",
    gambar: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
    kategori_id: 3,
    kategori: { id: 3, nama: "Pengumuman" },
    penulis: "Admin Desa",
    tanggal_publikasi: "2024-11-08T13:00:00",
    views: 201,
  },
  {
    id: 7,
    judul: "Pelatihan Pembuatan Kerajinan Batik untuk Ibu-Ibu PKK",
    slug: "pelatihan-pembuatan-kerajinan-batik-pkk",
    isi: "<p>Tim PKK mengadakan pelatihan pembuatan kerajinan batik untuk meningkatkan keterampilan dan ekonomi kreatif. Kegiatan berlangsung selama 3 hari di Balai Desa.</p>",
    gambar: "https://images.unsplash.com/photo-1605289355680-75fb41239154?w=800",
    kategori_id: 2,
    kategori: { id: 2, nama: "Kegiatan Desa" },
    penulis: "Ketua PKK",
    tanggal_publikasi: "2024-11-05T10:30:00",
    views: 334,
  },
  {
    id: 8,
    judul: "Renovasi Gedung SD Negeri 1 Krebet Selesai",
    slug: "renovasi-gedung-sd-negeri-1-krebet-selesai",
    isi: "<p>Renovasi gedung SD Negeri 1 Krebet yang dimulai sejak Agustus 2024 kini telah selesai. Renovasi meliputi pengecatan ulang, perbaikan atap, dan penambahan fasilitas toilet.</p>",
    gambar: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
    kategori_id: 1,
    kategori: { id: 1, nama: "Pembangunan" },
    penulis: "Admin Desa",
    tanggal_publikasi: "2024-11-02T15:00:00",
    views: 412,
  },
  {
    id: 9,
    judul: "Vaksinasi COVID-19 Booster Gratis",
    slug: "vaksinasi-covid-19-booster-gratis",
    isi: "<p>Puskesmas bekerja sama dengan Desa Krebet mengadakan vaksinasi booster COVID-19 gratis. Dibuka untuk warga usia 18 tahun ke atas pada 30 November 2024.</p>",
    gambar: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=800",
    kategori_id: 4,
    kategori: { id: 4, nama: "Kesehatan" },
    penulis: "Puskesmas Krebet",
    tanggal_publikasi: "2024-10-30T09:00:00",
    views: 278,
  },
  {
    id: 10,
    judul: "Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) 2025",
    slug: "musrenbangdes-2025",
    isi: "<p>Musrenbangdes tahun 2025 akan dilaksanakan pada 5 Desember 2024 di Balai Desa. Seluruh kepala RT/RW dan tokoh masyarakat diharapkan hadir untuk membahas program kerja tahun depan.</p>",
    gambar: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
    kategori_id: 3,
    kategori: { id: 3, nama: "Pengumuman" },
    penulis: "Kepala Desa",
    tanggal_publikasi: "2024-10-28T11:00:00",
    views: 523,
  },
  {
    id: 11,
    judul: "Pembagian Bantuan Langsung Tunai (BLT) Tahap 3",
    slug: "pembagian-blt-tahap-3",
    isi: "<p>Pembagian BLT tahap 3 akan dilaksanakan mulai 2 Desember 2024. Penerima bantuan dapat mengambil di Balai Desa dengan membawa KTP dan KK.</p>",
    gambar: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800",
    kategori_id: 3,
    kategori: { id: 3, nama: "Pengumuman" },
    penulis: "Bendahara Desa",
    tanggal_publikasi: "2024-10-25T14:00:00",
    views: 689,
  },
  {
    id: 12,
    judul: "Lomba Kebersihan Antar RT Se-Desa Krebet",
    slug: "lomba-kebersihan-antar-rt",
    isi: "<p>Dalam rangka memperingati HUT RI, Desa Krebet mengadakan lomba kebersihan antar RT. Penilaian akan dilakukan pada 10-15 Desember 2024. Hadiah total Rp 5 juta untuk 3 pemenang.</p>",
    gambar: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
    kategori_id: 2,
    kategori: { id: 2, nama: "Kegiatan Desa" },
    penulis: "Karang Taruna",
    tanggal_publikasi: "2024-10-22T10:00:00",
    views: 445,
  },
];

// Helper function untuk filter berita
export const filterBerita = (beritaArray, { searchQuery = "", kategoriId = "", page = 1, perPage = 9 }) => {
  let filtered = [...beritaArray];

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.judul.toLowerCase().includes(query) ||
        item.isi.toLowerCase().includes(query)
    );
  }

  // Filter by kategori
  if (kategoriId) {
    filtered = filtered.filter((item) => item.kategori_id === parseInt(kategoriId));
  }

  // Pagination
  const total = filtered.length;
  const lastPage = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      current_page: page,
      last_page: lastPage,
      per_page: perPage,
      total: total,
    },
  };
};