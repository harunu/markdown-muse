import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { useAdminStats, useProperties } from "@/hooks/useApi";

const AdminQuality = () => {
  const { data: adminStats, isLoading, error } = useAdminStats();
  const { data: propsData } = useProperties({ page: 1, page_size: 1 });

  const total = propsData?.total ?? 0;
  const qualityIssues = adminStats?.stats.quality_issues ?? 0;
  const activeListings = adminStats?.stats.active_listings ?? 0;

  const completionPct = total > 0 ? Math.round(((total - qualityIssues) / total) * 100) : 0;
  const activePct = total > 0 ? Math.round((activeListings / total) * 100) : 0;
  const overallScore = completionPct;

  const metrics = [
    { label: "Tamamlanmış Alanlar", pct: completionPct, detail: `${total - qualityIssues} / ${total} ilan` },
    { label: "Aktif İlan Oranı", pct: activePct, detail: `${activeListings} aktif` },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Veri Kalitesi</h2>
          <p className="text-muted-foreground">İlan verisi kalite metrikleri</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Kalite metrikleri yüklenemedi.</span>
          </div>
        ) : (
          <>
            <Card>
              <CardContent className="p-6 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Genel Kalite Skoru</p>
                  <p className="text-4xl font-bold text-foreground">{overallScore}/100</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {total} ilanın {total - qualityIssues} tanesi eksiksiz
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Metrikler</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {metrics.map((m) => (
                  <div key={m.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{m.label}</span>
                      <span className="text-muted-foreground">{m.pct}% — {m.detail}</span>
                    </div>
                    <Progress value={m.pct} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Sorunlar</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-foreground">Eksik Açıklama / Alan</span>
                  <span className={`text-sm font-medium ${qualityIssues > 0 ? "text-yellow-600" : "text-green-600"}`}>
                    {qualityIssues > 0 ? `${qualityIssues} ilan` : "Sorun yok"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQuality;
