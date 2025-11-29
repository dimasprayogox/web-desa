import { Navbar } from "../landing/Navbar";
import { Footer } from "../landing/Footer";
import { BeritaDetail } from "./components/BeritaDetail";

export function BeritaDetailPage() {
  return (
    <>
      <Navbar />
      <BeritaDetail />
      <Footer />
    </>
  );
}

export default BeritaDetailPage;