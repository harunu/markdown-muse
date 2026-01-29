import Navbar from "@/components/user/Navbar";
import HeroSection from "@/components/user/HeroSection";
import FeaturesSection from "@/components/user/FeaturesSection";
import FeaturedListings from "@/components/user/FeaturedListings";
import Footer from "@/components/user/Footer";
import AIChatButton from "@/components/user/AIChatButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <FeaturedListings />
      <Footer />
      <AIChatButton />
    </div>
  );
};

export default Index;
