import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Plus,
  X,
  Download,
  Check,
  Bot,
  Loader2,
  AlertCircle,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { useProperty, useAiComparison, useProperties } from "@/hooks/useApi";
import { Ilan, IlanOzet, AiKarsilastirma } from "@/types/api";

// Placeholder images
const getPropertyImage = (index: number) => {
  const images = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  ];
  return images[index % images.length];
};

const formatPrice = (price: number) => {
  return `${(price / 1000000).toFixed(1)}M TL`;
};

const formatPriceK = (price: number) => {
  return `${Math.round(price / 1000)}K TL`;
};

const CompareRow = ({
  label,
  values,
  bestIndex,
  suffix = ""
}: {
  label: string;
  values: (string | number | null | undefined)[];
  bestIndex?: number;
  suffix?: string;
}) => (
  <tr className="border-b last:border-0">
    <td className="py-3 px-4 text-muted-foreground font-medium">{label}</td>
    {values.map((value, index) => (
      <td key={index} className="py-3 px-4 text-center">
        <span className={index === bestIndex ? "text-success font-medium" : ""}>
          {value ?? "-"}{value !== null && value !== undefined ? suffix : ""}
          {index === bestIndex && value !== null && value !== undefined && <Check className="w-4 h-4 inline ml-1" />}
        </span>
      </td>
    ))}
  </tr>
);

const FeatureRow = ({
  label,
  values
}: {
  label: string;
  values: boolean[];
}) => (
  <tr className="border-b last:border-0">
    <td className="py-3 px-4 text-muted-foreground">{label}</td>
    {values.map((value, index) => (
      <td key={index} className="py-3 px-4 text-center">
        {value ? (
          <Check className="w-4 h-4 text-success mx-auto" />
        ) : (
          <X className="w-4 h-4 text-muted-foreground mx-auto" />
        )}
      </td>
    ))}
  </tr>
);

// Component to fetch a single property
const useMultipleProperties = (ids: number[]) => {
  const results = ids.map(id => useProperty(id));
  const isLoading = results.some(r => r.isLoading);
  const properties = results.map(r => r.data).filter((p): p is Ilan => p !== undefined);
  return { properties, isLoading };
};

const ComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse IDs from URL
  const idsParam = searchParams.get("ids") || "";
  const [propertyIds, setPropertyIds] = useState<number[]>(
    idsParam ? idsParam.split(",").map(id => parseInt(id)).filter(id => !isNaN(id)) : []
  );

  // Add property dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch properties for comparison
  const { properties, isLoading: propertiesLoading } = useMultipleProperties(propertyIds);

  // Search for adding properties
  const { data: searchResults } = useProperties(searchQuery ? { arama: searchQuery, sayfa_boyutu: 10 } : undefined);

  // AI Comparison
  const aiComparisonMutation = useAiComparison();
  const [aiComparison, setAiComparison] = useState<AiKarsilastirma | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch AI comparison when properties change
  useEffect(() => {
    if (propertyIds.length >= 2) {
      setAiLoading(true);
      aiComparisonMutation.mutateAsync(propertyIds)
        .then(result => {
          setAiComparison(result.karsilastirma);
        })
        .catch(() => {
          setAiComparison(null);
        })
        .finally(() => {
          setAiLoading(false);
        });
    } else {
      setAiComparison(null);
    }
  }, [propertyIds.join(",")]);

  // Update URL when IDs change
  useEffect(() => {
    if (propertyIds.length > 0) {
      setSearchParams({ ids: propertyIds.join(",") });
    } else {
      setSearchParams({});
    }
  }, [propertyIds]);

  // Add property to comparison
  const addProperty = (id: number) => {
    if (!propertyIds.includes(id) && propertyIds.length < 4) {
      setPropertyIds([...propertyIds, id]);
    }
    setAddDialogOpen(false);
    setSearchQuery("");
  };

  // Remove property from comparison
  const removeProperty = (id: number) => {
    setPropertyIds(propertyIds.filter(pid => pid !== id));
  };

  // Find best values
  const lowestPrice = properties.length > 0 ? Math.min(...properties.map(c => c.fiyat)) : 0;
  const lowestPriceM2 = properties.length > 0 ? Math.min(...properties.map(c => c.metrekare ? c.fiyat / c.metrekare : Infinity)) : 0;
  const largestArea = properties.length > 0 ? Math.max(...properties.map(c => c.metrekare || 0)) : 0;
  const newestAge = properties.length > 0 ? Math.min(...properties.filter(c => c.bina_yasi !== null).map(c => c.bina_yasi!)) : 0;

  // Calculate unit prices
  const getUnitPrice = (p: Ilan) => p.metrekare ? Math.round(p.fiyat / p.metrekare) : null;

  // Check feature
  const hasFeature = (p: Ilan, feature: string) => p.ozellikler?.some(f => f.toLowerCase().includes(feature.toLowerCase())) ?? false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Karsilastirma</h1>
          <p className="text-muted-foreground">{properties.length} ilan</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2" disabled={propertyIds.length >= 4}>
                <Plus className="w-4 h-4" />
                Ilan Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Ilan Ekle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Ilan ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="max-h-64 overflow-auto space-y-2">
                  {searchResults?.sonuclar?.map((item: IlanOzet) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="w-full justify-start h-auto py-2"
                      onClick={() => addProperty(item.id)}
                      disabled={propertyIds.includes(item.id)}
                    >
                      <div className="text-left">
                        <p className="font-medium">{item.baslik}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.ilce}, {item.sehir} - {formatPrice(item.fiyat)}
                        </p>
                      </div>
                    </Button>
                  ))}
                  {searchQuery && (!searchResults?.sonuclar || searchResults.sonuclar.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">Sonuc bulunamadi</p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="gap-2" disabled>
            <Download className="w-4 h-4" />
            PDF
          </Button>
        </div>
      </motion.div>

      {/* Loading state */}
      {propertiesLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty state */}
      {!propertiesLoading && properties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">Karsilastirmaya ilan eklenmemis</p>
            <p className="text-sm mb-4">Karsilastirmak icin ilan ekleyin</p>
            <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Ilan Ekle
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      {properties.length > 0 && (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="w-40 p-4 text-left"></th>
                  {properties.map((item, index) => (
                    <th key={item.id} className="p-4 text-center min-w-[180px]">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2"
                          onClick={() => removeProperty(item.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Images Row */}
                <tr className="border-b">
                  <td className="py-4 px-4 text-muted-foreground font-medium">Gorsel</td>
                  {properties.map((item, index) => (
                    <td key={item.id} className="p-4 text-center">
                      <img
                        src={item.gorseller?.[0] || getPropertyImage(index)}
                        alt={item.baslik}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer"
                        onClick={() => navigate(`/listings/${item.id}`)}
                      />
                      <p className="font-medium mt-2">{item.ilce}</p>
                      <p className="text-sm text-muted-foreground">{item.oda_sayisi} {item.emlak_tipi}</p>
                    </td>
                  ))}
                </tr>

                {/* Data Rows */}
                <CompareRow
                  label="Fiyat"
                  values={properties.map(c => formatPrice(c.fiyat))}
                  bestIndex={properties.findIndex(c => c.fiyat === lowestPrice)}
                />
                <CompareRow
                  label="m2 Fiyati"
                  values={properties.map(c => {
                    const unitPrice = getUnitPrice(c);
                    return unitPrice ? formatPriceK(unitPrice) : null;
                  })}
                  bestIndex={properties.findIndex(c => {
                    const unitPrice = getUnitPrice(c);
                    return unitPrice === lowestPriceM2;
                  })}
                />
                <CompareRow
                  label="Alan"
                  values={properties.map(c => c.metrekare)}
                  bestIndex={properties.findIndex(c => c.metrekare === largestArea)}
                  suffix=" m2"
                />
                <CompareRow
                  label="Oda"
                  values={properties.map(c => c.oda_sayisi)}
                />
                <CompareRow
                  label="Bina Yasi"
                  values={properties.map(c => c.bina_yasi)}
                  bestIndex={properties.findIndex(c => c.bina_yasi === newestAge)}
                  suffix=" yil"
                />
                <CompareRow
                  label="Kat"
                  values={properties.map(c => c.kat && c.toplam_kat ? `${c.kat}/${c.toplam_kat}` : c.kat)}
                />

                {/* Features Header */}
                <tr className="border-b bg-muted/50">
                  <td colSpan={properties.length + 1} className="py-2 px-4 font-medium text-foreground">Ozellikler</td>
                </tr>

                <FeatureRow
                  label="Balkon"
                  values={properties.map(c => hasFeature(c, "balkon"))}
                />
                <FeatureRow
                  label="Asansor"
                  values={properties.map(c => hasFeature(c, "asansor"))}
                />
                <FeatureRow
                  label="Havuz"
                  values={properties.map(c => hasFeature(c, "havuz"))}
                />
                <FeatureRow
                  label="Otopark"
                  values={properties.map(c => hasFeature(c, "otopark") || hasFeature(c, "garaj"))}
                />
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* AI Summary */}
      {properties.length >= 2 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="w-5 h-5 text-primary" />
              AI Karsilastirma Ozeti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : aiComparison ? (
              <>
                {/* Summary */}
                <div>
                  <h4 className="font-medium text-foreground mb-1">Genel Degerlendirme:</h4>
                  <p className="text-muted-foreground">{aiComparison.ozet}</p>
                </div>

                {/* Best Options */}
                {aiComparison.en_uygun_fiyat && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1">En Uygun Fiyat:</h4>
                    <p className="text-muted-foreground">
                      <span className="font-medium">{aiComparison.en_uygun_fiyat.baslik}</span> - {aiComparison.en_uygun_fiyat.sebep}
                    </p>
                  </div>
                )}

                {aiComparison.en_iyi_konum && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1">En Iyi Konum:</h4>
                    <p className="text-muted-foreground">
                      <span className="font-medium">{aiComparison.en_iyi_konum.baslik}</span> - {aiComparison.en_iyi_konum.sebep}
                    </p>
                  </div>
                )}

                {aiComparison.en_iyi_deger && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1">En Iyi Deger:</h4>
                    <p className="text-muted-foreground">
                      <span className="font-medium">{aiComparison.en_iyi_deger.baslik}</span> - {aiComparison.en_iyi_deger.sebep}
                    </p>
                  </div>
                )}

                {/* Recommendation */}
                {aiComparison.tavsiye && (
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-1">Tavsiye:</h4>
                    <p className="text-muted-foreground">{aiComparison.tavsiye}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>AI karsilastirma analizi yapilamadi.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComparePage;
