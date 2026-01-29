import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Sparkles,
  MapPin,
  Star,
  Bot,
  Filter,
  X,
  MessageCircle,
  ChevronRight,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const listings = [
  {
    id: "1",
    image: property1,
    title: "Kadıköy, Caferağa - 2+1 Daire",
    location: "Kadıköy, İstanbul",
    rooms: "2+1",
    area: 95,
    floor: "5. Kat",
    age: 3,
    price: 12500000,
    pricePerM2: 131578,
    aiScore: 72,
    aiComment: "Bölge ortalamasının %5 altında",
    features: ["Asansör", "Otopark", "Doğalgaz"],
  },
  {
    id: "2",
    image: property2,
    title: "Beşiktaş, Bebek - 3+1 Rezidans",
    location: "Beşiktaş, İstanbul",
    rooms: "3+1",
    area: 145,
    floor: "12. Kat",
    age: 5,
    price: 25800000,
    pricePerM2: 177931,
    aiScore: 85,
    aiComment: "Yatırım için ideal lokasyon",
    features: ["Havuz", "Güvenlik", "Fitness"],
  },
  {
    id: "3",
    image: property3,
    title: "Üsküdar, Kuzguncuk - 4+2 Villa",
    location: "Üsküdar, İstanbul",
    rooms: "4+2",
    area: 280,
    floor: "3 Katlı",
    age: 8,
    price: 45000000,
    pricePerM2: 160714,
    aiScore: 78,
    aiComment: "Değer artış potansiyeli yüksek",
    features: ["Bahçe", "Otopark", "Güvenlik"],
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("tr-TR").format(price);
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", content: "Bu aramada 45 ilan buldum. Yatırım mı oturum mu düşünüyorsun?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const toggleListingSelection = (id: string) => {
    setSelectedListings(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: "user", content: chatInput }]);
    setChatInput("");
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: "ai",
        content: "Yatırım için Üsküdar ve Ataşehir öne çıkıyor. m² fiyatları hala artış potansiyeli taşıyor."
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* AI Search Bar */}
      <div className="mb-4">
        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center gap-2 pointer-events-none">
            <Sparkles className="w-5 h-5 text-primary" />
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <Input
            placeholder="Kadıköy'de 15 milyon altı 2+1 daire arıyorum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 pr-24 h-12 text-base"
          />
          <Button className="absolute right-2 gap-2" size="default">
            Ara
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Filters Panel - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Card className="h-full overflow-auto">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtreler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* City */}
              <div className="space-y-2">
                <Label>Şehir</Label>
                <Select defaultValue="istanbul">
                  <SelectTrigger>
                    <SelectValue placeholder="Şehir seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="istanbul">İstanbul</SelectItem>
                    <SelectItem value="ankara">Ankara</SelectItem>
                    <SelectItem value="izmir">İzmir</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label>İlçe</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="İlçe seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kadikoy">Kadıköy</SelectItem>
                    <SelectItem value="besiktas">Beşiktaş</SelectItem>
                    <SelectItem value="uskudar">Üsküdar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Fiyat Aralığı</Label>
                <div className="flex gap-2">
                  <Input placeholder="Min" className="text-sm" />
                  <Input placeholder="Max" className="text-sm" />
                </div>
              </div>

              {/* Rooms */}
              <div className="space-y-3">
                <Label>Oda Sayısı</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["1+1", "2+1", "3+1", "4+1+"].map((room) => (
                    <div key={room} className="flex items-center space-x-2">
                      <Checkbox id={`room-${room}`} />
                      <Label htmlFor={`room-${room}`} className="text-sm font-normal cursor-pointer">
                        {room}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Area Range */}
              <div className="space-y-2">
                <Label>m² Aralığı</Label>
                <div className="flex gap-2">
                  <Input placeholder="Min" className="text-sm" />
                  <Input placeholder="Max" className="text-sm" />
                </div>
              </div>

              {/* Building Age */}
              <div className="space-y-3">
                <Label>Bina Yaşı: 0-20+</Label>
                <Slider defaultValue={[0, 20]} max={20} step={1} />
              </div>

              {/* Features */}
              <div className="space-y-3">
                <Label>Özellikler</Label>
                <div className="space-y-2">
                  {["Asansör", "Otopark", "Havuz", "Güvenlik"].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox id={`feature-${feature}`} />
                      <Label htmlFor={`feature-${feature}`} className="text-sm font-normal cursor-pointer">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Filtreleri Temizle
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden fixed bottom-4 left-4 z-30 gap-2 shadow-elevated">
              <Filter className="w-4 h-4" />
              Filtreler
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filtreler</SheetTitle>
            </SheetHeader>
            {/* Same filter content for mobile */}
          </SheetContent>
        </Sheet>

        {/* Results Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">45 sonuç gösteriliyor</p>
            <div className="flex items-center gap-2">
              <Select defaultValue="price-asc">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Fiyat ↑</SelectItem>
                  <SelectItem value="price-desc">Fiyat ↓</SelectItem>
                  <SelectItem value="ai-score">AI Skoru</SelectItem>
                  <SelectItem value="newest">En Yeni</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Count */}
          {selectedListings.length > 0 && (
            <div className="bg-primary/10 rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedListings.length} ilan seçildi
              </span>
              <Button size="sm" className="gap-2">
                Karşılaştır
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Results List */}
          <div className="flex-1 overflow-auto space-y-3 pr-1">
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-card transition-all cursor-pointer ${
                  selectedListings.includes(listing.id) ? "ring-2 ring-primary" : ""
                }`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <div className="flex items-start pt-1">
                        <Checkbox
                          checked={selectedListings.includes(listing.id)}
                          onCheckedChange={() => toggleListingSelection(listing.id)}
                        />
                      </div>

                      {/* Image */}
                      <div className="w-32 h-24 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground truncate">{listing.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {listing.location}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <Star className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{listing.area} m²</span>
                          <span>•</span>
                          <span>{listing.rooms}</span>
                          <span>•</span>
                          <span>{listing.floor}</span>
                          <span>•</span>
                          <span>{listing.age} yaşında</span>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <p className="font-semibold text-lg text-foreground">₺{formatPrice(listing.price)}</p>
                            <p className="text-xs text-muted-foreground">₺{formatPrice(listing.pricePerM2)}/m²</p>
                          </div>

                          {/* AI Score */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Bot className="w-4 h-4 text-primary" />
                              <span className="font-medium">{listing.aiScore}/100</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {listing.aiComment}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Map Panel - Desktop */}
        <aside className="hidden xl:block w-80 shrink-0">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">Harita Görünümü</p>
                  <p className="text-xs">Yakında eklenecek</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* AI Chat Button */}
      <Button
        onClick={() => setAiChatOpen(true)}
        className="fixed bottom-4 right-4 z-30 gap-2 shadow-elevated"
        size="lg"
      >
        <Bot className="w-5 h-5" />
        AI Asistan
      </Button>

      {/* AI Chat Panel */}
      <Sheet open={aiChatOpen} onOpenChange={setAiChatOpen}>
        <SheetContent className="w-full sm:w-96 flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Asistan
            </SheetTitle>
          </SheetHeader>

          {/* Chat Messages */}
          <div className="flex-1 overflow-auto py-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {["Yatırım", "Oturum", "Kira"].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setChatMessages(prev => [...prev, { role: "user", content: `${action} amaçlı bakıyorum` }]);
                  }}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <Input
              placeholder="Mesajınızı yazın..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchPage;
