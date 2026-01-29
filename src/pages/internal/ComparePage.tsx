import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  X,
  Download,
  Check,
  Bot,
} from "lucide-react";
import { motion } from "framer-motion";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const comparisons = [
  {
    id: "1",
    image: property1,
    location: "Kadıköy",
    title: "2+1 Daire",
    price: 12500000,
    pricePerM2: 131578,
    area: 95,
    rooms: "2+1",
    age: 3,
    floor: "5/8",
    aiScore: 72,
    features: {
      balcony: true,
      elevator: true,
      pool: false,
      parking: true,
    },
  },
  {
    id: "2",
    image: property2,
    location: "Beşiktaş",
    title: "3+1 Rezidans",
    price: 15200000,
    pricePerM2: 145000,
    area: 105,
    rooms: "3+1",
    age: 8,
    floor: "12/20",
    aiScore: 65,
    features: {
      balcony: true,
      elevator: true,
      pool: true,
      parking: true,
    },
  },
  {
    id: "3",
    image: property3,
    location: "Üsküdar",
    title: "2+1 Daire",
    price: 10800000,
    pricePerM2: 120000,
    area: 90,
    rooms: "2+1",
    age: 5,
    floor: "3/6",
    aiScore: 81,
    features: {
      balcony: true,
      elevator: false,
      pool: false,
      parking: true,
    },
  },
];

const formatPrice = (price: number) => {
  return `₺${(price / 1000000).toFixed(1)}M`;
};

const formatPriceK = (price: number) => {
  return `₺${Math.round(price / 1000)}K`;
};

const CompareRow = ({ 
  label, 
  values, 
  bestIndex,
  suffix = "" 
}: { 
  label: string; 
  values: (string | number)[]; 
  bestIndex?: number;
  suffix?: string;
}) => (
  <tr className="border-b last:border-0">
    <td className="py-3 px-4 text-muted-foreground font-medium">{label}</td>
    {values.map((value, index) => (
      <td key={index} className="py-3 px-4 text-center">
        <span className={index === bestIndex ? "text-success font-medium" : ""}>
          {value}{suffix}
          {index === bestIndex && <Check className="w-4 h-4 inline ml-1" />}
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

const ComparePage = () => {
  // Find best values
  const lowestPrice = Math.min(...comparisons.map(c => c.price));
  const lowestPriceM2 = Math.min(...comparisons.map(c => c.pricePerM2));
  const largestArea = Math.max(...comparisons.map(c => c.area));
  const newestAge = Math.min(...comparisons.map(c => c.age));
  const highestAI = Math.max(...comparisons.map(c => c.aiScore));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Karşılaştırma</h1>
          <p className="text-muted-foreground">{comparisons.length} ilan</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            İlan Ekle
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            PDF
          </Button>
        </div>
      </motion.div>

      {/* Comparison Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="w-40 p-4 text-left"></th>
                {comparisons.map((item) => (
                  <th key={item.id} className="p-4 text-center min-w-[180px]">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2"
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
                <td className="py-4 px-4 text-muted-foreground font-medium">Görsel</td>
                {comparisons.map((item) => (
                  <td key={item.id} className="p-4 text-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <p className="font-medium mt-2">{item.location}</p>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                  </td>
                ))}
              </tr>

              {/* Data Rows */}
              <CompareRow
                label="Fiyat"
                values={comparisons.map(c => formatPrice(c.price))}
                bestIndex={comparisons.findIndex(c => c.price === lowestPrice)}
              />
              <CompareRow
                label="m² Fiyatı"
                values={comparisons.map(c => formatPriceK(c.pricePerM2))}
                bestIndex={comparisons.findIndex(c => c.pricePerM2 === lowestPriceM2)}
              />
              <CompareRow
                label="Alan"
                values={comparisons.map(c => c.area)}
                bestIndex={comparisons.findIndex(c => c.area === largestArea)}
                suffix=" m²"
              />
              <CompareRow
                label="Oda"
                values={comparisons.map(c => c.rooms)}
              />
              <CompareRow
                label="Bina Yaşı"
                values={comparisons.map(c => c.age)}
                bestIndex={comparisons.findIndex(c => c.age === newestAge)}
                suffix=" yıl"
              />
              <CompareRow
                label="Kat"
                values={comparisons.map(c => c.floor)}
              />
              <CompareRow
                label="AI Skoru"
                values={comparisons.map(c => c.aiScore)}
                bestIndex={comparisons.findIndex(c => c.aiScore === highestAI)}
                suffix="/100"
              />

              {/* Features Header */}
              <tr className="border-b bg-muted/50">
                <td colSpan={4} className="py-2 px-4 font-medium text-foreground">Özellikler</td>
              </tr>
              
              <FeatureRow
                label="Balkon"
                values={comparisons.map(c => c.features.balcony)}
              />
              <FeatureRow
                label="Asansör"
                values={comparisons.map(c => c.features.elevator)}
              />
              <FeatureRow
                label="Havuz"
                values={comparisons.map(c => c.features.pool)}
              />
              <FeatureRow
                label="Otopark"
                values={comparisons.map(c => c.features.parking)}
              />
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="w-5 h-5 text-primary" />
            AI Karşılaştırma Özeti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-1">Yatırım İçin:</h4>
            <p className="text-muted-foreground">
              Üsküdar ilanı (₺120K/m²) en düşük birim fiyata sahip. 
              Gelişmekte olan bölge, değer artış potansiyeli yüksek.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Oturum İçin:</h4>
            <p className="text-muted-foreground">
              Kadıköy ilanı sosyal yaşam ve ulaşım açısından ideal. 
              Yeni bina avantajı ve merkezi konum öne çıkıyor.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Genel Öneri:</h4>
            <p className="text-muted-foreground">
              Bütçe kısıtlıysa Üsküdar, yaşam kalitesi öncelikliyse 
              Kadıköy tercih edilebilir.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparePage;
