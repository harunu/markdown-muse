import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-istanbul.jpg";

const HeroSection = () => {
  const quickFilters = [
    { label: "Satılık", active: true },
    { label: "Kiralık", active: false },
    { label: "Yatırımlık", active: false },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Animated geometric patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full border border-white/5 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full border border-white/5 rounded-full"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-gold animate-sparkle" />
            <span className="text-sm text-white/90 font-medium">Yapay Zeka Destekli</span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Yapay Zeka Destekli
            <span className="block text-gold mt-2">Emlak Danışmanınız</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-body">
            Doğal dilde sorun, akıllı öneriler alın. Türkiye'nin en kapsamlı 
            AI destekli emlak arama platformu.
          </p>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative max-w-2xl mx-auto mb-6"
          >
            <div className="relative flex items-center">
              <div className="absolute left-4 z-10 flex items-center gap-2 pointer-events-none">
                <Sparkles className="w-5 h-5 text-gold" />
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <Input
                variant="hero"
                inputSize="xl"
                placeholder="Kadıköy'de 15 milyon altı 2+1 daire arıyorum..."
                className="pl-16 pr-32"
              />
              <Button
                variant="hero"
                size="lg"
                className="absolute right-2 gap-2"
              >
                Ara
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Quick Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {quickFilters.map((filter) => (
              <button
                key={filter.label}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                  filter.active
                    ? "bg-gold text-primary shadow-gold"
                    : "bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white border border-white/20"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 text-white/60"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-gold">10,000+</span>
            <span className="text-sm">Aktif İlan</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-white/20" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="text-sm">AI Tarafından Analiz Edildi</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-gold">%95</span>
            <span className="text-sm">Memnuniyet</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-white/60 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
