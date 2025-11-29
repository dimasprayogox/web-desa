// File: umkm.jsx
import { Navbar } from "../landing/Navbar";
import { Footer } from "../landing/Footer";
import { UmkmContent } from "./page";

export function Umkm() {
  return (
    <>
      <Navbar />
      <UmkmContent />
      <Footer />
    </>
  );
}

export default Umkm;