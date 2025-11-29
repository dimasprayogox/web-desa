import { Navbar } from "../landing/Navbar";
import { Footer } from "../landing/Footer";
import { BeritaContent } from "./page";

export function Berita() {
  return (
    <>
      <Navbar />
      <BeritaContent />
      <Footer />
    </>
  );
}

export default Berita;