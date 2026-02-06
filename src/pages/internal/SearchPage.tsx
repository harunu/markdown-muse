import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  ChevronRight,
  Send,
  Loader2,
  AlertCircle,
  Save,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSearch, useAiChat, useSaveSearch, useAddFavorite, useRemoveFavorite, useFavorites } from "@/hooks/useApi";
import { IlanOzet, AramaIstegi } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

// Format price with Turkish locale
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("tr-TR").format(price);
};

// Calculate unit price
const getUnitPrice = (price: number, area?: number | null) => {
  if (!area || area === 0) return null;
  return Math.round(price / area);
};

// Turkish property images placeholder
const getPropertyImage = (index: number) => {
  const images = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  ];
  return images[index % images.length];
};

interface Filters {
  sehir?: string;
  ilce?: string;
  min_fiyat?: number;
  max_fiyat?: number;
  min_metrekare?: number;
  max_metrekare?: number;
  oda_sayisi?: string[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState<Filters>({
    sehir: "istanbul",
  });
  const [sortBy, setSortBy] = useState("price-asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Results state
  const [results, setResults] = useState<IlanOzet[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Selection state
  const [selectedListings, setSelectedListings] = useState<number[]>([]);

  // AI Chat state
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Merhaba! Size emlak aramanızda nasıl yardımcı olabilirim?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();

  // API hooks
  const searchMutation = useSearch();
  const aiChatMutation = useAiChat();
  const saveSearchMutation = useSaveSearch();
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();
  const { data: favorites } = useFavorites();

  // Check if a listing is favorite
  const isFavorite = (ilanId: number) => {
    return favorites?.some(f => f.ilan.id === ilanId) ?? false;
  };

  // Toggle favorite
  const toggleFavorite = async (ilanId: number) => {
    try {
      if (isFavorite(ilanId)) {
        await removeFavoriteMutation.mutateAsync(ilanId);
        toast({ title: "Favorilerden kaldirildi" });
      } else {
        await addFavoriteMutation.mutateAsync(ilanId);
        toast({ title: "Favorilere eklendi" });
      }
    } catch {
      toast({ title: "Bir hata olustu", variant: "destructive" });
    }
  };

  // Perform search
  const handleSearch = async (newPage?: number) => {
    const request: AramaIstegi = {
      sorgu: searchQuery || undefined,
      filtreler: {
        sehir: filters.sehir,
        ilce: filters.ilce,
        min_fiyat: filters.min_fiyat,
        max_fiyat: filters.max_fiyat,
        min_metrekare: filters.min_metrekare,
        max_metrekare: filters.max_metrekare,
        oda_sayisi: filters.oda_sayisi?.[0],
      },
      siralama: sortBy,
      sayfa: newPage || currentPage,
      sayfa_boyutu: 20,
    };

    // Clean up undefined values
    if (request.filtreler) {
      Object.keys(request.filtreler).forEach(key => {
        const k = key as keyof typeof request.filtreler;
        if (request.filtreler![k] === undefined) {
          delete request.filtreler![k];
        }
      });
    }

    try {
      const response = await searchMutation.mutateAsync(request);
      setResults(response.sonuclar);
      setTotalResults(response.toplam);
      setTotalPages(response.toplam_sayfa);
      if (newPage) setCurrentPage(newPage);
    } catch {
      toast({
        title: "Arama hatasi",
        description: "Arama yapilirken bir hata olustu.",
        variant: "destructive",
      });
    }
  };

  // Save current search
  const handleSaveSearch = async () => {
    const searchName = searchQuery || `${filters.sehir || "Tüm"} araması`;
    try {
      await saveSearchMutation.mutateAsync({
        sorgu: searchQuery,
        filtreler: filters,
        sonuc_sayisi: totalResults,
        isim: searchName,
      });
      toast({ title: "Arama kaydedildi" });
    } catch {
      toast({ title: "Kaydetme hatasi", variant: "destructive" });
    }
  };

  // Toggle listing selection
  const toggleListingSelection = (id: number) => {
    setSelectedListings(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Handle compare
  const handleCompare = () => {
    if (selectedListings.length < 2) {
      toast({ title: "En az 2 ilan seçiniz", variant: "destructive" });
      return;
    }
    navigate(`/compare?ids=${selectedListings.join(",")}`);
  };

  // Send AI chat message
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await aiChatMutation.mutateAsync({
        mesaj: userMessage,
        session_id: sessionId,
        baglam_tipi: "search",
        baglam_verisi: {
          sorgu: searchQuery,
          filtreler: filters,
          sonuc_sayisi: totalResults,
        },
      });

      setSessionId(response.session_id);
      setChatMessages(prev => [...prev, { role: "assistant", content: response.yanit }]);
    } catch {
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: "Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin."
      }]);
    }
  };

  // Search on mount if query param exists
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
      handleSearch();
    }
  }, []);

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
            onKeyDown={(e) => e.key === "Enter" && handleSearch(1)}
            className="pl-14 pr-24 h-12 text-base"
          />
          <Button
            className="absolute right-2 gap-2"
            size="default"
            onClick={() => handleSearch(1)}
            disabled={searchMutation.isPending}
          >
            {searchMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Ara
                <Search className="w-4 h-4" />
              </>
            )}
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
                <Label>Sehir</Label>
                <Select
                  value={filters.sehir}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sehir: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Şehir seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="istanbul">Istanbul</SelectItem>
                    <SelectItem value="ankara">Ankara</SelectItem>
                    <SelectItem value="izmir">Izmir</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label>Ilce</Label>
                <Select
                  value={filters.ilce}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, ilce: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="İlçe seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kadikoy">Kadikoy</SelectItem>
                    <SelectItem value="besiktas">Besiktas</SelectItem>
                    <SelectItem value="uskudar">Uskudar</SelectItem>
                    <SelectItem value="atasehir">Atasehir</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Fiyat Araligi</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    className="text-sm"
                    value={filters.min_fiyat || ""}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      min_fiyat: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    className="text-sm"
                    value={filters.max_fiyat || ""}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      max_fiyat: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                  />
                </div>
              </div>

              {/* Rooms */}
              <div className="space-y-3">
                <Label>Oda Sayisi</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["1+1", "2+1", "3+1", "4+1"].map((room) => (
                    <div key={room} className="flex items-center space-x-2">
                      <Checkbox
                        id={`room-${room}`}
                        checked={filters.oda_sayisi?.includes(room)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters(prev => ({
                              ...prev,
                              oda_sayisi: [...(prev.oda_sayisi || []), room]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              oda_sayisi: prev.oda_sayisi?.filter(r => r !== room)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`room-${room}`} className="text-sm font-normal cursor-pointer">
                        {room}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Area Range */}
              <div className="space-y-2">
                <Label>m2 Araligi</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    className="text-sm"
                    value={filters.min_metrekare || ""}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      min_metrekare: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    className="text-sm"
                    value={filters.max_metrekare || ""}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      max_metrekare: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                  />
                </div>
              </div>

              {/* Building Age */}
              <div className="space-y-3">
                <Label>Bina Yasi: 0-20+</Label>
                <Slider defaultValue={[0, 20]} max={20} step={1} />
              </div>

              {/* Features */}
              <div className="space-y-3">
                <Label>Ozellikler</Label>
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

              <div className="space-y-2">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => handleSearch(1)}
                  disabled={searchMutation.isPending}
                >
                  Filtrele
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setFilters({ sehir: "istanbul" })}
                >
                  Filtreleri Temizle
                </Button>
              </div>
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
            {/* Mobile filters would go here - same content */}
          </SheetContent>
        </Sheet>

        {/* Results Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {totalResults > 0 ? `${totalResults} sonuç gösteriliyor` : "Arama yapın"}
              </p>
              {totalResults > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveSearch}
                  disabled={saveSearchMutation.isPending}
                  className="gap-1"
                >
                  <Save className="w-4 h-4" />
                  Kaydet
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Fiyat (Artan)</SelectItem>
                  <SelectItem value="price-desc">Fiyat (Azalan)</SelectItem>
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
              <Button size="sm" className="gap-2" onClick={handleCompare}>
                Karsilastir
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Results List */}
          <div className="flex-1 overflow-auto space-y-3 pr-1">
            {searchMutation.isPending ? (
              // Loading state
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : searchMutation.isError ? (
              // Error state
              <div className="flex flex-col items-center justify-center py-16 text-destructive">
                <AlertCircle className="w-10 h-10 mb-3" />
                <p>Arama yapılırken bir hata oluştu.</p>
                <Button variant="link" onClick={() => handleSearch(1)}>
                  Tekrar dene
                </Button>
              </div>
            ) : results.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Search className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-lg font-medium">Sonuç bulunamadı</p>
                <p className="text-sm">Farklı kriterlerle aramayı deneyin</p>
              </div>
            ) : (
              // Results
              results.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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
                        <div
                          className="w-32 h-24 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                          onClick={() => navigate(`/listings/${listing.id}`)}
                        >
                          <img
                            src={getPropertyImage(index)}
                            alt={listing.baslik}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div
                              className="cursor-pointer"
                              onClick={() => navigate(`/listings/${listing.id}`)}
                            >
                              <h3 className="font-semibold text-foreground truncate">{listing.baslik}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {listing.ilce}, {listing.sehir}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                              onClick={() => toggleFavorite(listing.id)}
                            >
                              <Star className={`w-5 h-5 ${isFavorite(listing.id) ? "fill-warning text-warning" : ""}`} />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                            {listing.metrekare && <span>{listing.metrekare} m2</span>}
                            {listing.oda_sayisi && (
                              <>
                                <span>-</span>
                                <span>{listing.oda_sayisi}</span>
                              </>
                            )}
                            {listing.bina_yasi !== null && listing.bina_yasi !== undefined && (
                              <>
                                <span>-</span>
                                <span>{listing.bina_yasi} yasinda</span>
                              </>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {listing.ilan_tipi === "satilik" ? "Satilik" : "Kiralik"}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <p className="font-semibold text-lg text-foreground">
                                {formatPrice(listing.fiyat)} TL
                              </p>
                              {listing.metrekare && (
                                <p className="text-xs text-muted-foreground">
                                  {formatPrice(getUnitPrice(listing.fiyat, listing.metrekare) || 0)} TL/m2
                                </p>
                              )}
                            </div>

                            {/* AI Score */}
                            {listing.ai_skoru && (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 text-sm">
                                  <Bot className="w-4 h-4 text-primary" />
                                  <span className="font-medium">{listing.ai_skoru}/100</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handleSearch(currentPage - 1)}
                >
                  Önceki
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handleSearch(currentPage + 1)}
                >
                  Sonraki
                </Button>
              </div>
            )}
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

            {aiChatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2.5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {["Yatırım önerileri", "Fiyat analizi", "Bölge karşılaştır"].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setChatInput(action);
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
              disabled={aiChatMutation.isPending}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={aiChatMutation.isPending || !chatInput.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchPage;
