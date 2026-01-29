import { Heart, MapPin, Star, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  rooms: string;
  area: number;
  floor: string;
  price: number;
  pricePerM2: number;
  aiRating: number;
  aiComment: string;
  index?: number;
}

const PropertyCard = ({
  id,
  image,
  title,
  location,
  rooms,
  area,
  floor,
  price,
  pricePerM2,
  aiRating,
  aiComment,
  index = 0,
}: PropertyCardProps) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("tr-TR").format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-card rounded-2xl border border-border shadow-soft overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Favorite Button */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white hover:scale-110 group/heart">
          <Heart className="w-5 h-5 text-muted-foreground group-hover/heart:text-red-500 transition-colors" />
        </button>
        
      {/* AI Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-sm font-medium">
          <TrendingDown className="w-4 h-4" />
          <span>Uygun Fiyat</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Title & Specs */}
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-1">
          {title}
        </h3>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <span>{rooms}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{area} m²</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{floor}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-display font-bold text-foreground">
            ₺{formatPrice(price)}
          </span>
          <span className="text-sm text-muted-foreground">
            ₺{formatPrice(pricePerM2)}/m²
          </span>
        </div>

        {/* AI Rating */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < aiRating 
                    ? "fill-gold text-gold" 
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground line-clamp-1">
            "{aiComment}"
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/ilan/${id}`} className="flex-1">
            <Button variant="default" className="w-full">
              Detay
            </Button>
          </Link>
          <Button variant="outline">
            Karşılaştır
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
