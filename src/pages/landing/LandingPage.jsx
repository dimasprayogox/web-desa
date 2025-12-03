import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { VisiMisiSection } from "./VisiMisiSection";
import { ServicesSection } from "./ServicesSection";
import { NewsSection } from "./NewsSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <VisiMisiSection />
      <ServicesSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default LandingPage;