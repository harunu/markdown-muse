import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  MapPin,
  StickyNote,
  Download,
  GitCompare,
  Bot,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const favorites = [
  {
    id: "1",
    image: property1,
    title: "Kadıköy 2+1 Daire",
    location: "Kadıköy, İstanbul",
    price: 12500000,
    area: 95,
    aiScore: 72,
    addedAt: "28 Oca 2025",
    note: "Görülecek - hafta sonu randevu al",
  },
  {
    id: "2",
    image: property2,
    title: "Beşiktaş 3+1 Residence",
    location: "Beşiktaş, İstanbul",
    price: 18700000,
    area: 145,
    aiScore: 85,
    addedAt: "25 Oca 2025",
    note: "",
  },
  {
    id: "3",
    image: property3,
    title: "Üsküdar 4+2 Villa",
    location: "Üsküdar, İstanbul",
    price: 45000000,
    area: 280,
    aiScore: 78,
    addedAt: "20 Oca 2025",
    note: "Fiyat pazarlığı yapılabilir",
  },
];

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `₺${(price / 1000000).toFixed(1)}M`;
  }
  return `₺${new Intl.NumberFormat("tr-TR").format(price)}`;
};

const FavoritesPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(favorites.map(f => [f.id, f.note]))
  );

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const removeFavorite = (id: string) => {
    // In production, this would call an API
    console.log("Remove favorite:", id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Favorilerim</h1>
          <p className="text-muted-foreground">{favorites.length} ilan</p>
        </div>
        <div className="flex gap-2">
          <Link to="/compare">
            <Button variant="outline" className="gap-2" disabled={selectedIds.length < 2}>
              <GitCompare className="w-4 h-4" />
              Karşılaştır ({selectedIds.length})
            </Button>
          </Link>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            PDF İndir
          </Button>
        </div>
      </motion.div>

      {/* Sort & Filter */}
      <div className="flex flex-wrap gap-3">
        <Select defaultValue="date-desc">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sırala" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Eklenme Tarihi ↓</SelectItem>
            <SelectItem value="date-asc">Eklenme Tarihi ↑</SelectItem>
            <SelectItem value="price-asc">Fiyat ↑</SelectItem>
            <SelectItem value="price-desc">Fiyat ↓</SelectItem>
            <SelectItem value="ai-score">AI Skoru</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filtre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="with-notes">Notlu</SelectItem>
            <SelectItem value="no-notes">Notsuz</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Favorites Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`group hover:shadow-card transition-all ${
              selectedIds.includes(item.id) ? "ring-2 ring-primary" : ""
            }`}>
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={() => toggleSelection(item.id)}
                      className="bg-white/90"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-warning"
                    onClick={() => removeFavorite(item.id)}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </Button>
                  <Badge className="absolute bottom-2 right-2 bg-primary/90">
                    <Bot className="w-3 h-3 mr-1" />
                    {item.aiScore}/100
                  </Badge>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.location}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">{formatPrice(item.price)}</p>
                      <p className="text-xs text-muted-foreground">{item.area} m²</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Eklendi: {item.addedAt}
                    </p>
                  </div>

                  {/* Note */}
                  <div className="pt-2 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start gap-2 ${
                            notes[item.id] ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          <StickyNote className="w-4 h-4" />
                          {notes[item.id] || "Not ekle..."}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Not Ekle</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.location}</p>
                          </div>
                          <Textarea
                            placeholder="Notunuzu yazın..."
                            value={notes[item.id]}
                            onChange={(e) => setNotes(prev => ({
                              ...prev,
                              [item.id]: e.target.value
                            }))}
                            rows={4}
                          />
                          <Button className="w-full">Kaydet</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
