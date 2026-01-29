import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Upload,
  FileText,
  Download,
  BookOpen,
  X,
  Check,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

type UploadState = "idle" | "preview" | "importing" | "complete";

const ImportPage = () => {
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorsOpen, setErrorsOpen] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".csv")) {
        setFileName(file.name);
        setState("preview");
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setState("preview");
    }
  };

  const handleImport = () => {
    setState("importing");
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setState("complete");
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const handleReset = () => {
    setState("idle");
    setFileName("");
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold text-foreground">CSV Import</h1>
        <p className="text-muted-foreground mt-1">Yeni ilan verisi yükleyin</p>
      </motion.div>

      {/* Upload Area */}
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-6">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${
                    dragActive ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <p className="text-lg font-medium text-foreground mb-2">
                    CSV Dosyası Sürükle & Bırak
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    veya dosya seç butonuna tıkla
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" asChild>
                      <span>Dosya Seç</span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-4">
                    Desteklenen: .csv (max 50MB)
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Şablon İndir
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    Format Rehberi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Field Info */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Gerekli Alanlar</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <code className="text-sm bg-muted px-3 py-2 rounded block">
                  title, listing_type, property_type, city, district, price
                </code>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Opsiyonel Alanlar</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <code className="text-sm bg-muted px-3 py-2 rounded block">
                  rooms, gross_sqm, net_sqm, floor_number, building_age, features...
                </code>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {state === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* File Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{fileName}</p>
                      <p className="text-sm text-muted-foreground">2.4 MB | 1,234 satır | 22 kolon</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleReset}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Validation Results */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Doğrulama Sonucu</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center gap-2 text-success">
                  <Check className="w-4 h-4" />
                  <span>1,189 satır geçerli</span>
                </div>
                <div className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-4 h-4" />
                  <span>42 satır uyarı (eksik opsiyonel alan)</span>
                </div>
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>3 satır hatalı</span>
                </div>

                <Collapsible open={errorsOpen} onOpenChange={setErrorsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 -ml-2">
                      Hataları Görüntüle
                      <ChevronDown className={`w-4 h-4 transition-transform ${errorsOpen ? "rotate-180" : ""}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="bg-muted rounded-lg p-3 mt-2 text-sm space-y-1">
                      <p className="text-destructive">Satır 45: "price" alanı boş</p>
                      <p className="text-destructive">Satır 123: "listing_type" geçersiz değer: "satilik" (beklenen: sale)</p>
                      <p className="text-destructive">Satır 789: "city" alanı boş</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            {/* Preview Table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Ön İzleme (ilk 5 satır)</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>title</TableHead>
                      <TableHead>city</TableHead>
                      <TableHead>district</TableHead>
                      <TableHead>price</TableHead>
                      <TableHead>rooms</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2+1 Daire</TableCell>
                      <TableCell>İstanbul</TableCell>
                      <TableCell>Kadıköy</TableCell>
                      <TableCell>12500000</TableCell>
                      <TableCell>2+1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3+1 Villa</TableCell>
                      <TableCell>Ankara</TableCell>
                      <TableCell>Çankaya</TableCell>
                      <TableCell>8500000</TableCell>
                      <TableCell>3+1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>1+1 Stüdyo</TableCell>
                      <TableCell>İzmir</TableCell>
                      <TableCell>Karşıyaka</TableCell>
                      <TableCell>4200000</TableCell>
                      <TableCell>1+1</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Import Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Import Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="skip-errors" defaultChecked />
                  <Label htmlFor="skip-errors" className="font-normal cursor-pointer">
                    Hatalı satırları atla ve devam et
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="update-existing" />
                  <Label htmlFor="update-existing" className="font-normal cursor-pointer">
                    Mevcut ilanları güncelle (external_id eşleşirse)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="ai-analysis" defaultChecked />
                  <Label htmlFor="ai-analysis" className="font-normal cursor-pointer">
                    AI analizi otomatik çalıştır (sonra)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleReset}>İptal</Button>
              <Button onClick={handleImport} className="gap-2">
                🚀 Import Başlat
              </Button>
            </div>
          </motion.div>
        )}

        {state === "importing" && (
          <motion.div
            key="importing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Import Durumu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} className="h-3" />
                <div className="text-center space-y-2">
                  <p className="text-2xl font-semibold">{progress}%</p>
                  <p className="text-muted-foreground">
                    İşlenen: {Math.round(progress * 12.34)} / 1,234 satır
                  </p>
                  <div className="flex justify-center gap-6 text-sm">
                    <span className="text-success">✅ Başarılı: {Math.round(progress * 12.1)}</span>
                    <span className="text-destructive">❌ Hatalı: {Math.round(progress * 0.08)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tahmini kalan süre: ~{Math.round((100 - progress) / 2)} saniye
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" onClick={handleReset}>İptal Et</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {state === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Import Tamamlandı!</h2>
                <div className="text-muted-foreground space-y-1 mb-6">
                  <p>Toplam: 1,234 satır</p>
                  <p className="text-success">✅ Başarılı: 1,226 ilan eklendi</p>
                  <p className="text-destructive">❌ Hatalı: 8 satır atlandı</p>
                </div>
                <Button variant="outline" className="mb-6">
                  Hata Raporunu İndir
                </Button>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={handleReset}>Yeni Import</Button>
                  <Link to="/listings">
                    <Button className="gap-2">
                      İlanları Görüntüle
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImportPage;
