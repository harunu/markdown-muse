import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
  Loader2,
  AlertCircle,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites, useRemoveFavorite, useUpdateFavoriteNote } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Favorite } from "@/types/api";

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `₺${(price / 1000000).toFixed(1)}M`;
  }
  return `₺${new Intl.NumberFormat("tr-TR").format(price)}`;
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
};

const FavoritesPage = () => {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingNotes, setEditingNotes] = useState<Record<number, string>>({});

  const { data: favorites, isLoading, error } = useFavorites();
  const removeMutation = useRemoveFavorite();
  const updateNoteMutation = useUpdateFavoriteNote();

  const toggleSelection = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleRemove = async (propertyId: number) => {
    try {
      await removeMutation.mutateAsync(propertyId);
      setSelectedIds(prev => prev.filter(i => i !== propertyId));
      toast({ title: "Favorilerden kaldırıldı." });
    } catch {
      toast({ title: "İşlem başarısız.", variant: "destructive" });
    }
  };

  const handleSaveNote = async (propertyId: number) => {
    const note = editingNotes[propertyId] ?? "";
    try {
      await updateNoteMutation.mutateAsync({ propertyId, note });
      toast({ title: "Not kaydedildi." });
    } catch {
      toast({ title: "Not kaydedilemedi.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <p className="font-medium text-foreground">Favoriler yüklenemedi</p>
        <p className="text-sm text-muted-foreground">Bir hata oluştu, lütfen tekrar deneyin.</p>
      </div>
    );
  }

  const items = favorites ?? [];

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
          <p className="text-muted-foreground">{items.length > 0 ? `${items.length} kayıtlı ilan` : 'Henüz favori yok'}</p>
        </div>
        <div className="flex gap-2">
          <Link to={selectedIds.length >= 2 ? `/compare?ids=${selectedIds.join(',')}` : '#'}>
            <Button variant={selectedIds.length >= 2 ? "default" : "outline"} className="gap-2" disabled={selectedIds.length < 2}>
              <GitCompare className="w-4 h-4" />
              Karşılaştır {selectedIds.length >= 2 ? `(${selectedIds.length})` : ''}
            </Button>
          </Link>
          <Button variant="outline" className="gap-2" disabled>
            <Download className="w-4 h-4" />
            PDF İndir
          </Button>
        </div>
      </motion.div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-10 h-10 text-warning" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Henüz favori eklemediniz</h3>
          <p className="text-muted-foreground text-sm mb-4">İlanlara göz atın ve beğendiklerinizi kaydedin</p>
          <Link to="/search">
            <Button variant="default" className="gap-2">
              <Search className="w-4 h-4" />
              İlanlara Göz At
            </Button>
          </Link>
        </div>
      )}

      {/* Favorites Grid */}
      {items.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: Favorite, index: number) => {
            const noteValue = editingNotes[item.property.id] ?? item.note;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`group hover:shadow-card transition-all ${
                  selectedIds.includes(item.property.id) ? "ring-2 ring-primary" : ""
                }`}>
                  <CardContent className="p-0">
                    {/* Image placeholder */}
                    <div className="relative">
                      <div className="w-full h-40 bg-muted rounded-t-lg flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-muted-foreground/40" />
                      </div>
                      <div className="absolute top-2 left-2">
                        <Checkbox
                          checked={selectedIds.includes(item.property.id)}
                          onCheckedChange={() => toggleSelection(item.property.id)}
                          className="bg-white/90"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white text-warning"
                        onClick={() => handleRemove(item.property.id)}
                        disabled={removeMutation.isPending}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </Button>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.property.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.property.district}, {item.property.city}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xl text-foreground">{formatPrice(item.property.price)}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            {item.property.room_count && <span>{item.property.room_count}</span>}
                            {item.property.area && <><span>•</span><span>{item.property.area} m²</span></>}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(item.added_at)}
                        </p>
                      </div>

                      {/* Note */}
                      <div className="pt-2 border-t">
                        <Dialog onOpenChange={(open) => {
                          if (open) {
                            setEditingNotes(prev => ({ ...prev, [item.property.id]: item.note }));
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`w-full justify-start gap-2 ${
                                item.note ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              <StickyNote className="w-4 h-4" />
                              {item.note || "Not ekle..."}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Not Ekle</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="font-medium">{item.property.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.property.district}, {item.property.city}
                                </p>
                              </div>
                              <Textarea
                                placeholder="Notunuzu yazın..."
                                value={noteValue}
                                onChange={(e) => setEditingNotes(prev => ({
                                  ...prev,
                                  [item.property.id]: e.target.value
                                }))}
                                rows={4}
                              />
                              <Button
                                className="w-full"
                                onClick={() => handleSaveNote(item.property.id)}
                                disabled={updateNoteMutation.isPending}
                              >
                                {updateNoteMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : "Kaydet"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
