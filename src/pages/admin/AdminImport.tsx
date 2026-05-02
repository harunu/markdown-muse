import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Upload, FileText, CheckCircle2, AlertCircle, Download, X, ChevronDown, Loader2, Check, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useImport } from "@/hooks/useImport";
import { ImportJobDetail, ImportError } from "@/types/import";

type UploadState = "idle" | "uploading" | "preview" | "importing" | "complete";

const AdminImport = () => {
  const [state, setState] = useState<UploadState>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [errorsOpen, setErrorsOpen] = useState(false);

  // API integration state
  const [importId, setImportId] = useState<string | null>(null);
  const [jobDetail, setJobDetail] = useState<ImportJobDetail | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [skipErrors, setSkipErrors] = useState(true);
  const [pollInterval, setPollInterval] = useState<ReturnType<typeof setInterval> | null>(null);

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

  const processFile = async (file: File) => {
    setApiError(null);
    setState("uploading");

    try {
      const uploadResponse = await uploadCSV(file);
      setImportId(uploadResponse.import_id);

      const statusResponse = await getImportStatus(uploadResponse.import_id);
      setJobDetail(statusResponse);
      setState("preview");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Dosya yüklenirken bir hata oluştu.");
      setState("idle");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".csv")) {
        setFileName(file.name);
        processFile(file);
      } else {
        setApiError("Sadece CSV dosyaları kabul edilir.");
      }
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
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">CSV Import</h2>
          <p className="text-muted-foreground">Emlak verilerini CSV dosyasından içe aktarın</p>
        </div>

        {/* Error Display */}
        {apiError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-4">
            {apiError}
          </div>
        )}

        {/* Idle State - Upload Area */}
        {(state === "idle" || state === "uploading") && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Dosya Yükle</CardTitle>
                <CardDescription>CSV dosyanızı sürükleyip bırakın veya seçin</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging
                      ? "border-admin-blue bg-admin-blue/5"
                      : "border-border hover:border-admin-blue/50"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  {state === "uploading" ? (
                    <>
                      <Loader2 className="w-12 h-12 mx-auto mb-4 text-admin-blue animate-spin" />
                      <p className="text-lg font-medium text-foreground mb-2">
                        Dosya Yükleniyor...
                      </p>
                      <p className="text-sm text-muted-foreground">{fileName}</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium text-foreground mb-2">
                        CSV dosyanızı buraya sürükleyin
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">veya</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button onClick={() => fileInputRef.current?.click()}>
                        Dosya Seç
                      </Button>
                    </>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Şablon İndir
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Format Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  CSV Format Bilgisi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    CSV dosyanız aşağıdaki sütunları içermelidir:
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Zorunlu alanlar:</p>
                    <div className="flex flex-wrap gap-2">
                      {["title", "listing_type", "property_type", "city", "district", "price"].map(
                        (field) => (
                          <div
                            key={field}
                            className="px-3 py-1 bg-admin-blue/10 text-admin-blue rounded text-sm font-mono"
                          >
                            {field}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Opsiyonel alanlar:</p>
                    <div className="flex flex-wrap gap-2">
                      {["neighborhood", "area", "room_count", "building_age", "floor", "total_floors", "heating", "description", "features", "latitude", "longitude"].map(
                        (field) => (
                          <div
                            key={field}
                            className="px-3 py-1 bg-muted rounded text-sm font-mono text-foreground"
                          >
                            {field}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm text-admin-success">
                      <CheckCircle2 className="w-4 h-4" />
                      UTF-8 encoding desteklenir
                    </div>
                    <div className="flex items-center gap-2 text-sm text-admin-warning">
                      <AlertCircle className="w-4 h-4" />
                      Maksimum 10.000 satır
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Preview State */}
        {state === "preview" && jobDetail && (
          <>
            {/* File Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-admin-blue/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-admin-blue" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{fileName || jobDetail.file_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {jobDetail.total_rows} satır
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
              <CardHeader>
                <CardTitle>Doğrulama Sonucu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-admin-success">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{jobDetail.valid_rows} satır geçerli</span>
                </div>
                {jobDetail.error_rows > 0 && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span>{jobDetail.error_rows} satır hatalı</span>
                  </div>
                )}

                {jobDetail.errors && jobDetail.errors.length > 0 && (
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
            {jobDetail.preview && jobDetail.preview.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ön İzleme (ilk {jobDetail.preview.length} satır)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(jobDetail.preview[0]).slice(0, 6).map((key) => (
                            <TableHead key={key}>{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobDetail.preview.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {Object.values(row).slice(0, 6).map((value, cellIndex) => (
                              <TableCell key={cellIndex}>
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Import Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Import Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
              <Button onClick={handleImport} disabled={!importId}>
                Import Başlat
              </Button>
            </div>
          </>
        )}

        {/* Importing State */}
        {state === "importing" && (
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
                  <span className="text-admin-success">Eklenen: {jobDetail?.created_count || 0}</span>
                  <span className="text-admin-warning">Güncellenen: {jobDetail?.updated_count || 0}</span>
                  <span className="text-destructive">Hatalı: {jobDetail?.error_rows || 0}</span>
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" onClick={handleReset}>İptal Et</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete State */}
        {state === "complete" && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                jobDetail?.status === "failed" ? "bg-destructive/10" : "bg-admin-success/10"
              }`}>
                {jobDetail?.status === "failed" ? (
                  <AlertCircle className="w-8 h-8 text-destructive" />
                ) : (
                  <Check className="w-8 h-8 text-admin-success" />
                )}
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {jobDetail?.status === "failed" ? "Import Başarısız" : "Import Tamamlandı!"}
              </h3>
              <div className="text-muted-foreground space-y-1 mb-6">
                <p>Toplam: {jobDetail?.total_rows || 0} satır</p>
                <p className="text-admin-success">Eklenen: {jobDetail?.created_count || 0} ilan</p>
                <p className="text-admin-warning">Güncellenen: {jobDetail?.updated_count || 0} ilan</p>
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
                <Link to="/admin/ilanlar">
                  <Button className="gap-2">
                    İlanları Görüntüle
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminImport;
