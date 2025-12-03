import { Navbar } from "../landing/Navbar";
import { Footer } from "../landing/Footer";
import { UmkmDetail } from "./components/umkmDetail";

export function UmkmDetailPage() {
  return (
    <>
      <Navbar />
      <UmkmDetail />
      <Footer />
    </>
  );
}

export default UmkmDetailPage;