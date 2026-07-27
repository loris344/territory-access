"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrailerSection from "@/components/TrailerSection";
import PhilosophySection from "@/components/PhilosophySection";
import TeamCarousel from "@/components/TeamCarousel";
import WorldMap from "@/components/WorldMap";
import TourPhotosSection from "@/components/TourPhotosSection";
import ExpeditionsGrid from "@/components/ExpeditionsGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import CommunitySection from "@/components/CommunitySection";
import EthicalSection from "@/components/EthicalSection";
import FAQSection from "@/components/FAQSection";
import ContactBubbles from "@/components/ContactBubbles";
import Footer from "@/components/Footer";
import HomeScrollMemory from "@/components/HomeScrollMemory";

interface IndexProps {
  initialHeroImages?: string[];
}

const Index = ({ initialHeroImages }: IndexProps) => {
  return (
    <div className="min-h-screen bg-background">
      <HomeScrollMemory />
      <Navbar />
      <HeroSection initialHeroImages={initialHeroImages} />
      <PhilosophySection />
      <TrailerSection />
      <TeamCarousel />
      <WorldMap />
      <TourPhotosSection />
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
