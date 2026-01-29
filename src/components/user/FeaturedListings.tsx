import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const listings = [
  {
    id: "1",
    image: property1,
    title: "Manzaralı Modern Daire",
    location: "Kadıköy, Caferağa",
    rooms: "2+1",
    area: 95,
    floor: "3. Kat",
    price: 12500000,
    pricePerM2: 131578,
    aiRating: 4,
    aiComment: "Bölge ortalamasının %5 altında",
  },
  {
    id: "2",
    image: property2,
    title: "Deniz Manzaralı Lüks Rezidans",
    location: "Beşiktaş, Bebek",
    rooms: "3+1",
    area: 145,
    floor: "12. Kat",
    price: 25800000,
    pricePerM2: 177931,
    aiRating: 5,
    aiComment: "Yatırım için ideal lokasyon",
  },
  {
    id: "3",
    image: property3,
    title: "Bahçeli Müstakil Villa",
    location: "Üsküdar, Kuzguncuk",
    rooms: "4+2",
    area: 280,
    floor: "3 Katlı",
    price: 45000000,
    pricePerM2: 160714,
    aiRating: 4,
    aiComment: "Değer artış potansiyeli yüksek",
  },
];

const FeaturedListings = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Öne Çıkan İlanlar
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              AI tarafından seçilmiş, en uygun fiyatlı ve yüksek potansiyelli ilanlar.
            </p>
          </div>
          
          <Link to="/arama">
            <Button variant="outline" size="lg" className="gap-2 group">
              Tüm İlanlar
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {listings.map((listing, index) => (
            <PropertyCard key={listing.id} {...listing} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
