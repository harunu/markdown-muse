import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAdminStats } from "@/hooks/useApi";

const AdminAnalytics = () => {
  const { data, isLoading, error } = useAdminStats();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analitik</h2>
          <p className="text-muted-foreground">İlan ve kullanım istatistikleri</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error || !data ? (
          <div className="flex items-center gap-3 p-4 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Analitik verileri yüklenemedi.</span>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam İlan</p>
                    <p className="text-2xl font-bold text-foreground">
                      {data.stats.total_listings.toLocaleString("tr-TR")}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aktif İlan</p>
                    <p className="text-2xl font-bold text-foreground">
                      {data.stats.active_listings.toLocaleString("tr-TR")}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bugün Güncellenen</p>
                    <p className="text-2xl font-bold text-foreground">
                      {data.stats.today_updated.toLocaleString("tr-TR")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* City Breakdown Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Şehirlere Göre İlan Sayısı</CardTitle>
              </CardHeader>
              <CardContent>
                {data.city_breakdown.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Henüz ilan yok.
                  </p>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.city_breakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="city"
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          axisLine={{ stroke: "hsl(var(--border))" }}
                        />
                        <YAxis
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          axisLine={{ stroke: "hsl(var(--border))" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time Series */}
            <Card>
              <CardHeader>
                <CardTitle>İlan Büyümesi (Son 30 Gün)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.time_series}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
