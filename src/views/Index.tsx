"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrailerSection from "@/components/TrailerSection";
import PhilosophySection from "@/components/PhilosophySection";
import WorldMap from "@/components/WorldMap";
import ExpeditionsGrid from "@/components/ExpeditionsGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import CommunitySection from "@/components/CommunitySection";
import EthicalSection from "@/components/EthicalSection";
import FAQSection from "@/components/FAQSection";
import ContactBubbles from "@/components/ContactBubbles";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <TrailerSection />
      <WorldMap />
      <ExpeditionsGrid />
      <TestimonialsSection />
      <CommunitySection />
      <EthicalSection />
      <FAQSection />
      <ContactBubbles />
      <Footer />
    </div>
  );
};

export default Index;
