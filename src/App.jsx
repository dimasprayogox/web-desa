import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { LandingPage } from "./pages/landing";
import { Infografis } from "./pages/infografis/Infografis";
import { Berita } from "./pages/berita/berita";
import { BeritaDetailPage } from "./pages/berita/beritaDetail";
import { Umkm } from "./pages/umkm/umkm";

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
      
      {/* Admin routes - PROTECTED di level layout */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Auth routes - publik */}
      <Route path="/auth/*" element={<Auth />} />
      
      {/* 404 Catch-All Route - HARUS DI PALING BAWAH */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
