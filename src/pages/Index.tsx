import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import WorldMap from "@/components/WorldMap";
import ExpeditionsGrid from "@/components/ExpeditionsGrid";
import EthicalSection from "@/components/EthicalSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <WorldMap />
      <ExpeditionsGrid />
      <EthicalSection />
      <Footer />
    </div>
  );
};

export default Index;
