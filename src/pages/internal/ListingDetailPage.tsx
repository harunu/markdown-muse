import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Star,
  Share2,
  Bed,
  Maximize,
  Building,
  Calendar,
  Flame,
  DollarSign,
  Check,
  AlertTriangle,
  Lightbulb,
  Bot,
  MessageCircle,
  StickyNote,
  GitCompare,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const listing = {
  id: "1",
  images: [property1, property2, property3],
  title: "Kadıköy, Caferağa - Deniz Manzaralı 2+1 Daire",
  location: "Moda Caddesi No:45, Caferağa, Kadıköy, İstanbul",
  price: 12500000,
  pricePerM2: 131578,
  rooms: "2+1",
  area: 95,
  floor: "5/8",
  age: 3,
  heating: "Doğalgaz",
  type: "Satılık",
  description: "Moda'nın en gözde lokasyonunda, deniz manzaralı, yeni bina içerisinde satılık 2+1 daire. Açık mutfak, geniş salon, 2 banyo. Bina güvenlikli ve asansörlüdür.",
  features: ["Balkon", "Asansör", "Otopark", "Güvenlik", "Amerikan Mutfak", "Ebeveyn Banyosu"],
  aiScore: 72,
  aiPros: [
    "Merkezi konum, metroya yakın",
    "Yeni bina (3 yaşında)",
    "Deniz manzarası",
    "Bölge ortalamasının altında fiyat",
  ],
  aiCons: [
    "Trafik yoğun bölge",
    "Otopark sıkıntısı olabilir",
    "Kira getirisi ortalamanın altında",
  ],
  aiRecommendation: "Oturum için ideal. Yatırım için kira getirisi düşük kalabilir. ₺11.8M-12M arası pazarlık hedeflenebilir.",
  marketAvg: 138500,
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("tr-TR").format(price);
};

const ListingDetailPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const priceDiff = ((listing.pricePerM2 - listing.marketAvg) / listing.marketAvg) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Link to="/search">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button
            variant={isFavorite ? "default" : "outline"}
            className="gap-2"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Star className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            Favori
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Paylaş
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="aspect-video rounded-lg overflow-hidden mb-3">
                  <img
                    src={listing.images[selectedImage]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  {listing.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Title & Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-semibold text-foreground mb-2">{listing.title}</h1>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-primary">₺{formatPrice(listing.price)}</p>
                  <p className="text-muted-foreground">₺{formatPrice(listing.pricePerM2)}/m²</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Specs Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Özellikler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {[
                    { icon: Bed, label: listing.rooms },
                    { icon: Maximize, label: `${listing.area}m²` },
                    { icon: Building, label: listing.floor },
                    { icon: Calendar, label: `${listing.age}yıl` },
                    { icon: Flame, label: listing.heating },
                    { icon: DollarSign, label: listing.type },
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mx-auto mb-1">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Açıklama</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Ek Özellikler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {listing.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="gap-1">
                      <Check className="w-3 h-3" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Konum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                  <MapPin className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">{listing.location}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - AI Analysis */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24 space-y-4"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  AI Değerlendirmesi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Price Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Fiyat Skoru</span>
                    <span className="font-semibold">{listing.aiScore}/100</span>
                  </div>
                  <Progress value={listing.aiScore} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">Makul - Pazarlık Payı Var</p>
                </div>

                {/* Market Comparison */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">Piyasa Karşılaştırması</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bu ilan:</span>
                      <span>₺{formatPrice(listing.pricePerM2)}/m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bölge ort:</span>
                      <span>₺{formatPrice(listing.marketAvg)}/m²</span>
                    </div>
                    <div className="flex justify-between font-medium text-success">
                      <span>Fark:</span>
                      <span>{priceDiff.toFixed(1)}% ✓</span>
                    </div>
                  </div>
                </div>

                {/* Pros */}
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Check className="w-4 h-4 text-success" />
                    Artılar
                  </h4>
                  <ul className="space-y-1">
                    {listing.aiPros.map((pro, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-success mt-1">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    Dikkat Edilecekler
                  </h4>
                  <ul className="space-y-1">
                    {listing.aiCons.map((con, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-warning mt-1">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Recommendation */}
                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    AI Tavsiyesi
                  </h4>
                  <p className="text-sm text-muted-foreground">{listing.aiRecommendation}</p>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full gap-2">
                        <MessageCircle className="w-4 h-4" />
                        AI'ya Soru Sor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>AI'ya Soru Sor</DialogTitle>
                      </DialogHeader>
                      <Textarea placeholder="Sorunuzu yazın..." rows={4} />
                      <Button className="w-full">Gönder</Button>
                    </DialogContent>
                  </Dialog>
                  <Link to="/compare" className="block">
                    <Button variant="outline" className="w-full gap-2">
                      <GitCompare className="w-4 h-4" />
                      Karşılaştırmaya Ekle
                    </Button>
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full gap-2">
                        <StickyNote className="w-4 h-4" />
                        Not Ekle
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Not Ekle</DialogTitle>
                      </DialogHeader>
                      <Textarea placeholder="Notunuzu yazın..." rows={4} />
                      <Button className="w-full">Kaydet</Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
