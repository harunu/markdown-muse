import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database, CheckCircle2, AlertTriangle, XCircle, TrendingUp } from "lucide-react";

const qualityMetrics = [
  { label: "Tamamlanmış Alanlar", value: 94, status: "good" },
  { label: "Fotoğraf Kalitesi", value: 87, status: "good" },
  { label: "Fiyat Tutarlılığı", value: 78, status: "warning" },
  { label: "Konum Doğruluğu", value: 92, status: "good" },
  { label: "Açıklama Uzunluğu", value: 65, status: "warning" },
];

const issues = [
  { type: "error", count: 12, label: "Eksik fiyat bilgisi" },
  { type: "warning", count: 45, label: "Düşük çözünürlüklü fotoğraf" },
  { type: "warning", count: 23, label: "Kısa açıklama metni" },
  { type: "error", count: 8, label: "Geçersiz konum verisi" },
];

const AdminQuality = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-admin-success";
      case "warning":
        return "text-admin-warning";
      case "error":
        return "text-admin-error";
      default:
        return "text-muted-foreground";
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-admin-success";
    if (value >= 60) return "bg-admin-warning";
    return "bg-admin-error";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Veri Kalitesi</h2>
          <p className="text-muted-foreground">İlan verilerinin kalite analizi ve raporları</p>
        </div>

        {/* Overall Score */}
        <Card className="bg-gradient-to-br from-admin-blue/10 to-admin-purple/10 border-admin-blue/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Genel Veri Kalitesi Skoru</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground">83</span>
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-admin-success">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Geçen haftaya göre +5 puan</span>
                </div>
              </div>
              <div className="w-32 h-32 rounded-full border-8 border-admin-blue/20 flex items-center justify-center">
                <Database className="w-12 h-12 text-admin-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Kalite Metrikleri</CardTitle>
              <CardDescription>Her kategori için detaylı skor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {qualityMetrics.map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{metric.label}</span>
                    <span className={`text-sm font-bold ${getStatusColor(metric.status)}`}>
                      %{metric.value}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getProgressColor(metric.value)}`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Tespit Edilen Sorunlar</CardTitle>
              <CardDescription>Düzeltilmesi gereken veri sorunları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {issue.type === "error" ? (
                      <XCircle className="w-5 h-5 text-admin-error" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-admin-warning" />
                    )}
                    <span className="text-sm text-foreground">{issue.label}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      issue.type === "error"
                        ? "bg-admin-error/10 text-admin-error"
                        : "bg-admin-warning/10 text-admin-warning"
                    }
                  >
                    {issue.count} ilan
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminQuality;
