import { Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { LandingPage } from "./pages/landing";
import { Infografis } from "./pages/infografis/Infografis";
import { Berita } from "./pages/berita/berita";
import { BeritaDetailPage } from "./pages/berita/beritaDetail";
import { Umkm } from "./pages/umkm/umkm";
import { UmkmDetailPage } from "./pages/umkm/umkmDetail";

function App() {
  return (
    <Routes>
      {/* Landing page publik */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Infografis page publik */}
      <Route path="/infografis" element={<Infografis />} />

      <Route path="/berita" element={<Berita />} />
      <Route path="/berita/:slug" element={<BeritaDetailPage />} />
      
      <Route path="/umkm" element={<Umkm />} />
      <Route path="/umkm/:slug" element={<UmkmDetailPage />} />
      
      {/* 404 Catch-All Route - HARUS DI PALING BAWAH */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
