import { useState } from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import PropertyCard from "@/components/user/PropertyCard";
import AIChatButton from "@/components/user/AIChatButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const listings = [
  { id: "1", image: property1, title: "Manzaralı Modern Daire", location: "Kadıköy, Caferağa", rooms: "2+1", area: 95, floor: "3. Kat", price: 12500000, pricePerM2: 131578, aiRating: 4, aiComment: "Bölge ortalamasının %5 altında" },
  { id: "2", image: property2, title: "Deniz Manzaralı Lüks Rezidans", location: "Beşiktaş, Bebek", rooms: "3+1", area: 145, floor: "12. Kat", price: 25800000, pricePerM2: 177931, aiRating: 5, aiComment: "Yatırım için ideal lokasyon" },
  { id: "3", image: property3, title: "Bahçeli Müstakil Villa", location: "Üsküdar, Kuzguncuk", rooms: "4+2", area: 280, floor: "3 Katlı", price: 45000000, pricePerM2: 160714, aiRating: 4, aiComment: "Değer artış potansiyeli yüksek" },
  { id: "4", image: property1, title: "Boğaz Manzaralı Penthouse", location: "Beşiktaş, Ortaköy", rooms: "4+1", area: 220, floor: "15. Kat", price: 38000000, pricePerM2: 172727, aiRating: 5, aiComment: "Nadir bulunan lokasyon" },
  { id: "5", image: property2, title: "Yeni Yapı Residence", location: "Kadıköy, Moda", rooms: "1+1", area: 65, floor: "8. Kat", price: 8500000, pricePerM2: 130769, aiRating: 4, aiComment: "İlk evini alacaklar için ideal" },
  { id: "6", image: property3, title: "Tarihi Konak", location: "Üsküdar, Çengelköy", rooms: "5+2", area: 350, floor: "2 Katlı", price: 65000000, pricePerM2: 185714, aiRating: 5, aiComment: "Eşsiz tarihi değer" },
];

const activeFilters = ["İstanbul", "2+1 ve üzeri", "₺10M - ₺50M"];

const SearchResults = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Search Header */}
      <div className="pt-20 bg-card border-b border-border sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                variant="search"
                placeholder="Kadıköy'de deniz manzaralı 2+1 daire..."
                className="pl-16"
              />
            </div>
            
            {/* Filter Toggle */}
            <div className="flex gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Filtrele
              </Button>
              <Button variant="outline" className="gap-2">
                <MapPin className="w-4 h-4" />
                Haritada Gör
              </Button>
            </div>
          </div>
          
          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
              >
                {filter}
                <button className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">{listings.length}</span> ilan bulundu
          </p>
          <select className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Önerilen</option>
            <option>Fiyat (Düşük-Yüksek)</option>
            <option>Fiyat (Yüksek-Düşük)</option>
            <option>En Yeni</option>
          </select>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {listings.map((listing, index) => (
            <PropertyCard key={listing.id} {...listing} index={index} />
          ))}
        </motion.div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-12">
          <Button variant="outline" size="sm" disabled>Önceki</Button>
          <Button variant="default" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Sonraki</Button>
        </div>
      </div>

      <Footer />
      <AIChatButton />
    </div>
  );
};

export default SearchResults;
