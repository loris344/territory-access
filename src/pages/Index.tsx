import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import WorldMap from "@/components/WorldMap";
import ExpeditionsGrid from "@/components/ExpeditionsGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import EthicalSection from "@/components/EthicalSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <WorldMap />
      <ExpeditionsGrid />
      <TestimonialsSection />
      <EthicalSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
