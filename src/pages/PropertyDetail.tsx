import { useState } from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import AIChatButton from "@/components/user/AIChatButton";
import { Button } from "@/components/ui/button";
import { 
  Heart, Share2, ChevronLeft, ChevronRight, MapPin, 
  Sparkles, Check, AlertTriangle, Lightbulb, MessageSquare,
  Home, Maximize2, Layers, Calendar, Flame, Building
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const images = [property1, property2, property3, property1, property2];

const specs = [
  { icon: Home, label: "Oda Sayısı", value: "2+1" },
  { icon: Maximize2, label: "Alan", value: "95 m²" },
  { icon: Layers, label: "Kat", value: "3 / 8" },
  { icon: Calendar, label: "Bina Yaşı", value: "3 Yıl" },
  { icon: Flame, label: "Isıtma", value: "Doğalgaz" },
  { icon: Building, label: "Yapı Tipi", value: "Apartman" },
];

const features = [
  "Balkon", "Asansör", "Otopark", "Güvenlik", "Spor Salonu", 
  "Yüzme Havuzu", "Çocuk Parkı", "Merkezi Konum"
];

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);

  const formatPrice = (value: number) => new Intl.NumberFormat("tr-TR").format(value);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link to="/arama" className="hover:text-foreground transition-colors">İlan Ara</Link>
            <span>/</span>
            <span className="text-foreground">Manzaralı Modern Daire</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="container mx-auto px-4 mb-8">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
            <img
              src={images[currentImage]}
              alt="Property"
              className="w-full h-full object-cover"
            />
            
            {/* Navigation */}
            <button
              onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-soft"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-soft"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm text-sm font-medium">
              {currentImage + 1} / {images.length}
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImage ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Price */}
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Kadıköy, Caferağa, İstanbul</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Manzaralı Modern Daire
                </h1>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-display font-bold text-foreground">
                    ₺{formatPrice(12500000)}
                  </span>
                  <span className="text-lg text-muted-foreground">
                    ₺{formatPrice(131578)}/m²
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <spec.icon className="w-4 h-4" />
                      <span className="text-sm">{spec.label}</span>
                    </div>
                    <span className="font-semibold text-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                  Özellikler
                </h2>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <span
                      key={feature}
                      className="px-4 py-2 rounded-full bg-muted text-foreground text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                  Açıklama
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kadıköy'ün en gözde bölgesi Caferağa'da, deniz manzaralı, yeni yapı 2+1 daire. 
                  Daire geniş salon, açık mutfak, 2 yatak odası ve 1 banyodan oluşmaktadır. 
                  Site içerisinde 24 saat güvenlik, kapalı otopark, spor salonu ve yüzme havuzu bulunmaktadır.
                  Metro ve vapur iskelesine yürüme mesafesinde, okullara ve hastaneye yakın konumda.
                </p>
              </div>
            </div>

            {/* Right Column - AI Analysis */}
            <div className="space-y-6">
              {/* AI Analysis Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft sticky top-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-navy-light flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-foreground">
                    AI Danışman Yorumu
                  </h3>
                </div>

                {/* Price Evaluation */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Fiyat Değerlendirmesi</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[70%] bg-gradient-to-r from-admin-success to-gold rounded-full" />
                    </div>
                    <span className="text-sm font-medium text-admin-success">Makul</span>
                  </div>
                </div>

                {/* Pros */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-admin-success" />
                    Artılar
                  </p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground pl-6">
                    <li>• Merkezi konum</li>
                    <li>• Yeni bina (3 yaşında)</li>
                    <li>• Deniz manzarası</li>
                  </ul>
                </div>

                {/* Risks */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-admin-warning" />
                    Riskler
                  </p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground pl-6">
                    <li>• Trafik yoğun bölge</li>
                    <li>• Otopark problemi olabilir</li>
                  </ul>
                </div>

                {/* Recommendation */}
                <div className="p-4 rounded-xl bg-gold/10 border border-gold/20 mb-6">
                  <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-gold" />
                    Tavsiye
                  </p>
                  <p className="text-sm text-muted-foreground">
                    "Pazarlık ile ₺11.8M hedeflenebilir"
                  </p>
                </div>

                <Button variant="ai" className="w-full gap-2">
                  <MessageSquare className="w-4 h-4" />
                  AI'ya Soru Sor
                </Button>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Heart className="w-4 h-4" />
                    Kaydet
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Share2 className="w-4 h-4" />
                    Paylaş
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIChatButton />
    </div>
  );
};

export default PropertyDetail;
