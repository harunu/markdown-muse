import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  Loader2,
  AlertCircle,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useProperty,
  useAiAnalysis,
  useAddFavorite,
  useRemoveFavorite,
  useFavorites,
  useUpdateFavoriteNote,
  useAiChat,
} from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

// Placeholder images
const getPropertyImage = (index: number) => {
  const images = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  ];
  return images[index % images.length];
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("tr-TR").format(price);
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const propertyId = parseInt(id || "0");

  // UI State
  const [selectedImage, setSelectedImage] = useState(0);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Bu ilan hakkında soru sorabilirsiniz." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();

  // API Hooks
  const { data: listing, isLoading, error } = useProperty(propertyId);
  const { data: aiData, isLoading: aiLoading } = useAiAnalysis(propertyId);
  const { data: favorites } = useFavorites();
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();
  const updateNoteMutation = useUpdateFavoriteNote();
  const aiChatMutation = useAiChat();

  // Check if favorite
  const isFavorite = favorites?.some(f => f.property.id === propertyId) ?? false;
  const favoriteNote = favorites?.find(f => f.property.id === propertyId)?.note || "";

  // Toggle favorite
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavoriteMutation.mutateAsync(propertyId);
        toast({ title: "Favorilerden kaldırıldı" });
      } else {
        await addFavoriteMutation.mutateAsync(propertyId);
        toast({ title: "Favorilere eklendi" });
      }
    } catch {
      toast({ title: "Bir hata oluştu", variant: "destructive" });
    }
  };

  // Save note
  const handleSaveNote = async () => {
    if (!isFavorite) {
      // First add to favorites, then add note
      try {
        await addFavoriteMutation.mutateAsync(propertyId);
        await updateNoteMutation.mutateAsync({ propertyId: propertyId, note: noteText });
        toast({ title: "Not kaydedildi" });
        setNoteDialogOpen(false);
      } catch {
        toast({ title: "Bir hata oluştu", variant: "destructive" });
      }
    } else {
      try {
        await updateNoteMutation.mutateAsync({ propertyId: propertyId, note: noteText });
        toast({ title: "Not güncellendi" });
        setNoteDialogOpen(false);
      } catch {
        toast({ title: "Bir hata oluştu", variant: "destructive" });
      }
    }
  };

  // Send chat message
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await aiChatMutation.mutateAsync({
        message: userMessage,
        session_id: sessionId,
        context_type: "property",
        context_data: {
          property_id: propertyId,
          title: listing?.title,
          price: listing?.price,
          location: `${listing?.district}, ${listing?.city}`,
        },
      });

      setSessionId(response.session_id);
      setChatMessages(prev => [...prev, { role: "assistant", content: response.response }]);
    } catch {
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: "Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin."
      }]);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error || !listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-destructive">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">İlan bulunamadı</p>
        <Button variant="link" onClick={() => navigate("/listings")}>
          İlanlara dön
        </Button>
      </div>
    );
  }

  const aiAnalysis = aiData?.analysis;
  const birimFiyat = listing.area ? Math.round(listing.price / listing.area) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Link to="/listings">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button
            variant={isFavorite ? "default" : "outline"}
            className="gap-2"
            onClick={toggleFavorite}
            disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
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
                <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                  <img
                    src={listing.images?.[selectedImage] || getPropertyImage(selectedImage)}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {(listing.images?.length ? listing.images : [0, 1, 2]).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors shrink-0 ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img
                        src={typeof img === 'string' ? img : getPropertyImage(index)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
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
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground mb-2">{listing.title}</h1>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {listing.neighborhood && `${listing.neighborhood}, `}{listing.district}, {listing.city}
                    </p>
                  </div>
                  <Badge variant={listing.listing_type === "sale" ? "default" : "secondary"}>
                    {listing.listing_type === "sale" ? "Satılık" : "Kiralık"}
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <p className="text-3xl font-bold text-primary">₺{formatPrice(listing.price)}</p>
                  {listing.area && (
                    <p className="text-muted-foreground">{formatPrice(birimFiyat)} ₺/m²</p>
                  )}
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
                    { icon: Bed, label: listing.room_count || "-" },
                    { icon: Maximize, label: listing.area ? `${listing.area}m²` : "-" },
                    { icon: Building, label: listing.floor ? `${listing.floor}/${listing.total_floors || "?"}` : "-" },
                    { icon: Calendar, label: listing.building_age != null ? `${listing.building_age} yıl` : "-" },
                    { icon: Flame, label: listing.heating || "-" },
                    { icon: DollarSign, label: listing.listing_type === "sale" ? "Satılık" : "Kiralık" },
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
          {listing.description && (
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
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Additional Features */}
          {listing.features && listing.features.length > 0 && listing.features.some(f => f.trim()) && (
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
                    {listing.features.flatMap(f => f.split('|')).filter(f => f.trim()).map((feature) => (
                      <Badge key={feature} variant="secondary" className="gap-1">
                        <Check className="w-3 h-3" />
                        {feature.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

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
                <p className="text-sm text-muted-foreground">
                  {listing.neighborhood && `${listing.neighborhood}, `}{listing.district}, {listing.city}
                </p>
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
            <Card data-testid="ai-analysis-panel">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  AI Değerlendirmesi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {aiLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : aiAnalysis ? (
                  <>
                    {/* Price Score */}
                    <div data-testid="price-score">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Fiyat Skoru</span>
                        <span className="font-semibold">{aiAnalysis.price_score}/100</span>
                      </div>
                      <Progress value={aiAnalysis.price_score} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">{aiAnalysis.price_evaluation}</p>
                    </div>

                    {/* Market Comparison */}
                    {aiAnalysis.area_average_price_per_sqm && (
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <h4 className="font-medium text-sm">Piyasa Karşılaştırması</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Bu ilan:</span>
                            <span>{formatPrice(aiAnalysis.price_per_sqm || birimFiyat)} ₺/m²</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Bölge ort:</span>
                            <span>{formatPrice(aiAnalysis.area_average_price_per_sqm)} ₺/m²</span>
                          </div>
                          {aiAnalysis.price_difference_percent !== undefined && (
                            <div className={`flex justify-between font-medium ${aiAnalysis.price_difference_percent < 0 ? "text-success" : "text-warning"}`}>
                              <span>Fark:</span>
                              <span>{aiAnalysis.price_difference_percent.toFixed(1)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pros */}
                    {aiAnalysis.advantages && aiAnalysis.advantages.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                          <Check className="w-4 h-4 text-success" />
                          Artilar
                        </h4>
                        <ul className="space-y-1">
                          {aiAnalysis.advantages.map((pro, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-success mt-1">-</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Cons */}
                    {aiAnalysis.disadvantages && aiAnalysis.disadvantages.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          Dikkat Edilecekler
                        </h4>
                        <ul className="space-y-1">
                          {aiAnalysis.disadvantages.map((con, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-warning mt-1">-</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* AI Recommendation */}
                    {aiAnalysis.recommendation && (
                      <div className="bg-primary/5 rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4 text-primary" />
                          AI Tavsiyesi
                        </h4>
                        <p className="text-sm text-muted-foreground">{aiAnalysis.recommendation}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>AI analizi henüz yapılmamış.</p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <Button data-testid="advisor-ask-button" className="w-full gap-2" onClick={() => setChatOpen(true)}>
                    <MessageCircle className="w-4 h-4" />
                    AI'ya Soru Sor
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => navigate(`/compare?ids=${propertyId}`)}
                  >
                    <GitCompare className="w-4 h-4" />
                    Karşılaştırmaya Ekle
                  </Button>
                  <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => setNoteText(favoriteNote)}
                      >
                        <StickyNote className="w-4 h-4" />
                        Not Ekle
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Not Ekle</DialogTitle>
                      </DialogHeader>
                      <Textarea
                        placeholder="Notunuzu yazin..."
                        rows={4}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                      />
                      <Button
                        className="w-full"
                        onClick={handleSaveNote}
                        disabled={updateNoteMutation.isPending || addFavoriteMutation.isPending}
                      >
                        {updateNoteMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Kaydet"
                        )}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* AI Chat Sheet */}
      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
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
                  data-testid={msg.role === "assistant" ? "advisor-answer" : undefined}
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
              {["Fiyat uygun mu?", "Yatırım için nasıl?", "Pazarlık payı var mı?"].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => setChatInput(action)}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <Input
              data-testid="advisor-input"
              placeholder="Mesajinizi yazin..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={aiChatMutation.isPending}
            />
            <Button
              data-testid="advisor-submit"
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

export default ListingDetailPage;
