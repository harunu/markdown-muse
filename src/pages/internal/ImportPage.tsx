import { useState, useCallback, useEffect, useRef } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Download,
  BookOpen,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useImport } from "@/hooks/useImport";
import { ImportJobDetail, ImportError } from "@/types/import";
import { CITIES } from "@/lib/cityDistricts";

type UploadState = "idle" | "preview" | "importing" | "complete";

const FormatGuideModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>CSV Format Rehberi</DialogTitle>
      </DialogHeader>

      <div className="space-y-5 text-sm">
        <div>
          <p className="font-semibold mb-2">Zorunlu Alanlar</p>
          <div className="bg-muted rounded-lg p-3 font-mono text-xs">
            title, listing_type, property_type, city, district, price
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Opsiyonel Alanlar</p>
          <div className="bg-muted rounded-lg p-3 font-mono text-xs">
            neighborhood, area, room_count, building_age, floor, total_floors,
            heating, description, features, latitude, longitude
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Geçerli <code>listing_type</code> Değerleri</p>
          <div className="flex flex-wrap gap-2">
            {["sale", "rent"].map((v) => <Badge key={v} variant="secondary">{v}</Badge>)}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Geçerli <code>property_type</code> Değerleri</p>
          <div className="flex flex-wrap gap-2">
            {["apartment", "villa", "land", "commercial", "office", "other"].map((v) => (
              <Badge key={v} variant="secondary">{v}</Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Geçerli <code>heating</code> Değerleri</p>
          <div className="flex flex-wrap gap-2">
            {["central", "individual", "underfloor", "stove", "ac", "none"].map((v) => (
              <Badge key={v} variant="secondary">{v}</Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Şehir / İlçe Kuralları</p>
          <p className="text-muted-foreground mb-2">
            İlçe, seçilen şehre ait olmalıdır. Geçersiz kombinasyonlar reddedilir.
          </p>
          <div className="space-y-1 max-h-40 overflow-y-auto border rounded-lg p-3">
            {CITIES.map((c) => (
              <div key={c.value} className="flex gap-2 text-xs">
                <span className="font-medium w-20 shrink-0">{c.label}:</span>
                <span className="text-muted-foreground">{c.districts.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Örnek Satır</p>
          <div className="bg-muted rounded-lg p-3 font-mono text-xs break-all">
            title,listing_type,property_type,city,district,price,area,room_count,building_age,heating<br/>
            "Bodrum Gümüşlük Deniz Manzaralı Villa",sale,villa,Muğla,Bodrum,8500000,220,4+1,5,central
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Özellikler (<code>features</code>) Formatı</p>
          <p className="text-muted-foreground text-xs">
            Birden fazla özellik için <code>|</code> ayracını kullanın.<br/>
            Örnek: <code>"Asansör|Otopark|Havuz"</code>
          </p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const ImportPage = () => {
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorsOpen, setErrorsOpen] = useState(false);

  // New state variables for API integration
  const [importId, setImportId] = useState<string | null>(null);
  const [jobDetail, setJobDetail] = useState<ImportJobDetail | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [skipErrors, setSkipErrors] = useState(true);
  const [pollInterval, setPollInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formatGuideOpen, setFormatGuideOpen] = useState(false);

  const { uploadCSV, getImportStatus, confirmImport, downloadTemplate } = useImport();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = async (file: File) => {
    setApiError(null);
    setIsUploading(true);

    try {
      const uploadResponse = await uploadCSV(file);
      setImportId(uploadResponse.import_id);

      const statusResponse = await getImportStatus(uploadResponse.import_id);
      setJobDetail(statusResponse);
      setState("preview");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Dosya yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".csv")) {
        setFileName(file.name);
        processFile(file);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      processFile(file);
    }
  };

  const handleImport = async () => {
    if (!importId) return;

    setState("importing");
    setProgress(0);
    setApiError(null);

    try {
      await confirmImport(importId, {
        update_existing: updateExisting,
        skip_errors: skipErrors,
      });

      // Start polling for status updates
      const interval = setInterval(async () => {
        try {
          const status = await getImportStatus(importId);
          setJobDetail(status);
          setProgress(status.progress);

          if (status.status === "completed" || status.status === "failed") {
            clearInterval(interval);
            setPollInterval(null);
            setState("complete");
          }
        } catch (error) {
          clearInterval(interval);
          setPollInterval(null);
          setApiError(error instanceof Error ? error.message : "Durum sorgulanırken hata oluştu.");
          setState("preview");
        }
      }, 2000);

      setPollInterval(interval);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Import başlatılırken hata oluştu.");
      setState("preview");
    }
  };

  const handleReset = () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
    setState("idle");
    setFileName("");
    setProgress(0);
    setImportId(null);
    setJobDetail(null);
    setApiError(null);
    setUpdateExisting(false);
    setSkipErrors(true);
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Şablon indirilirken hata oluştu.");
    }
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
                {/* API Error Display */}
                {apiError && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 mb-4">
                    {apiError}
                  </div>
                )}

                <div
                  data-testid="import-dropzone"
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
                  {isUploading ? (
                    <>
                      <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                      <p className="text-lg font-medium text-foreground mb-2">
                        Dosya Yükleniyor...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Lütfen bekleyin
                      </p>
                    </>
                  ) : (
                    <>
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
                        ref={fileInputRef}
                        data-testid="import-file-input"
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Dosya Seç
                      </Button>
                      <p className="text-xs text-muted-foreground mt-4">
                        Desteklenen: .csv (max 50MB)
                      </p>
                    </>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button data-testid="download-template" variant="outline" className="gap-2" onClick={handleDownloadTemplate}>
                    <Download className="w-4 h-4" />
                    Şablon İndir
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => setFormatGuideOpen(true)}>
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
                  neighborhood, area, room_count, building_age, floor, total_floors, heating, description, features, latitude, longitude
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
            {/* API Error Display */}
            {apiError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">
                {apiError}
              </div>
            )}

            {/* File Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{fileName || jobDetail?.file_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {jobDetail?.total_rows || 0} satır
                      </p>
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
                  <span>{jobDetail?.valid_rows || 0} satır geçerli</span>
                </div>
                {(jobDetail?.error_rows || 0) > 0 && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span>{jobDetail?.error_rows || 0} satır hatalı</span>
                  </div>
                )}

                {jobDetail?.errors && jobDetail.errors.length > 0 && (
                  <Collapsible open={errorsOpen} onOpenChange={setErrorsOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1 -ml-2">
                        Hataları Görüntüle
                        <ChevronDown className={`w-4 h-4 transition-transform ${errorsOpen ? "rotate-180" : ""}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="bg-muted rounded-lg p-3 mt-2 text-sm space-y-1">
                        {jobDetail.errors.map((error: ImportError, index: number) => (
                          <p key={index} className="text-destructive">
                            Satır {error.row}: "{error.field}" - {error.message}
                          </p>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </CardContent>
            </Card>

            {/* Preview Table */}
            <Card data-testid="import-preview">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Ön İzleme (ilk {jobDetail?.preview?.length || 0} satır)</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {jobDetail?.preview && jobDetail.preview.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(jobDetail.preview[0]).map((key) => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobDetail.preview.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {Object.values(row).map((value, cellIndex) => (
                            <TableCell key={cellIndex}>{value}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-sm">Önizleme verisi yok</p>
                )}
              </CardContent>
            </Card>

            {/* Import Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Import Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="skip-errors"
                    checked={skipErrors}
                    onCheckedChange={(checked) => setSkipErrors(checked as boolean)}
                  />
                  <Label htmlFor="skip-errors" className="font-normal cursor-pointer">
                    Hatalı satırları atla ve devam et
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="update-existing"
                    checked={updateExisting}
                    onCheckedChange={(checked) => setUpdateExisting(checked as boolean)}
                  />
                  <Label htmlFor="update-existing" className="font-normal cursor-pointer">
                    Mevcut ilanları güncelle (başlık, şehir, ilçe eşleşirse)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleReset}>İptal</Button>
              <Button data-testid="import-confirm" onClick={handleImport} className="gap-2" disabled={!importId}>
                Import Başlat
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
                    İşlenen: {jobDetail?.total_rows ? Math.round((progress / 100) * jobDetail.total_rows) : 0} / {jobDetail?.total_rows || 0} satır
                  </p>
                  <div className="flex justify-center gap-6 text-sm">
                    <span className="text-success">Eklenen: {jobDetail?.created_count || 0}</span>
                    <span className="text-warning">Güncellenen: {jobDetail?.updated_count || 0}</span>
                    <span className="text-destructive">Hatalı: {jobDetail?.error_rows || 0}</span>
                  </div>
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
            <Card data-testid="import-history">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  jobDetail?.status === "failed" ? "bg-destructive/10" : "bg-success/10"
                }`}>
                  {jobDetail?.status === "failed" ? (
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  ) : (
                    <Check className="w-8 h-8 text-success" />
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {jobDetail?.status === "failed" ? "Import Başarısız" : "Import Tamamlandı!"}
                </h2>
                <div className="text-muted-foreground space-y-1 mb-6">
                  <p>Toplam: {jobDetail?.total_rows || 0} satır</p>
                  <p className="text-success">Eklenen: {jobDetail?.created_count || 0} ilan</p>
                  <p className="text-warning">Güncellenen: {jobDetail?.updated_count || 0} ilan</p>
                  {(jobDetail?.error_rows || 0) > 0 && (
                    <p className="text-destructive">Hatalı: {jobDetail?.error_rows || 0} satır</p>
                  )}
                </div>

                {/* Show errors if import failed */}
                {jobDetail?.status === "failed" && jobDetail?.errors && jobDetail.errors.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 text-left">
                    <p className="font-medium text-destructive mb-2">Hatalar:</p>
                    <div className="text-sm space-y-1">
                      {jobDetail.errors.slice(0, 5).map((error: ImportError, index: number) => (
                        <p key={index} className="text-destructive">
                          Satır {error.row}: "{error.field}" - {error.message}
                        </p>
                      ))}
                      {jobDetail.errors.length > 5 && (
                        <p className="text-muted-foreground">
                          ... ve {jobDetail.errors.length - 5} hata daha
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={handleReset}>Yeni Import</Button>
                  <Link to="/admin/listings">
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

      <FormatGuideModal open={formatGuideOpen} onClose={() => setFormatGuideOpen(false)} />
    </div>
  );
};

export default ImportPage;
