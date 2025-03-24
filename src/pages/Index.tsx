
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { HowItWorks } from "@/components/HowItWorks";
import { Benefits } from "@/components/Benefits";
import { PartnerStores } from "@/components/PartnerStores";
import { Footer } from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedDeals />
        <HowItWorks />
        <Benefits />
        <PartnerStores />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
