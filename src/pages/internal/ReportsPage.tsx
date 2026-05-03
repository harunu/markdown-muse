import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Download,
  MapPin,
  Home,
  DollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useReportsSummary } from "@/hooks/useApi";

const printReport = (data: NonNullable<ReturnType<typeof useReportsSummary>["data"]>) => {
  const date = new Date().toLocaleDateString("tr-TR");

  const districtRows = data.city_breakdown.map(
    (c) =>
      `<tr><td>${c.city}</td><td>${c.count.toLocaleString("tr-TR")}</td><td>₺${c.avg_price.toLocaleString("tr-TR")}</td></tr>`
  ).join("");

  const trendRows = data.monthly_trend.map(
    (m) => `<tr><td>${m.month}</td><td>${m.count.toLocaleString("tr-TR")}</td></tr>`
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8"/>
  <title>Emlak AI — Piyasa Raporu ${date}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111; padding: 32px; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { color: #666; font-size: 13px; margin-bottom: 24px; }
    .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 28px; }
    .stat-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; min-width: 140px; }
    .stat-label { font-size: 12px; color: #666; }
    .stat-value { font-size: 22px; font-weight: 700; margin-top: 4px; }
    h2 { font-size: 15px; margin: 24px 0 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; background: #f9fafb; padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #e5e7eb; }
    td { padding: 7px 12px; border-bottom: 1px solid #f3f4f6; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <h1>Emlak AI — Piyasa Raporu</h1>
  <div class="subtitle">Oluşturulma tarihi: ${date}</div>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Ortalama m² Fiyatı</div>
      <div class="stat-value">₺${data.stats.avg_price_per_sqm.toLocaleString("tr-TR")}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Toplam İlan</div>
      <div class="stat-value">${data.stats.total_listings.toLocaleString("tr-TR")}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Aktif İlçe</div>
      <div class="stat-value">${data.stats.city_count}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Aylık Yeni İlan</div>
      <div class="stat-value">${(data.monthly_trend[data.monthly_trend.length - 1]?.count ?? 0).toLocaleString("tr-TR")}</div>
    </div>
  </div>

  <h2>İlçelere Göre İlanlar</h2>
  <table>
    <thead><tr><th>İlçe</th><th>İlan Sayısı</th><th>Ort. Fiyat</th></tr></thead>
    <tbody>${districtRows}</tbody>
  </table>

  <h2>Aylık Yeni İlan Sayısı</h2>
  <table>
    <thead><tr><th>Ay</th><th>Yeni İlan</th></tr></thead>
    <tbody>${trendRows}</tbody>
  </table>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }
};

const ReportsPage = () => {
  const { data, isLoading, error } = useReportsSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-destructive">
        <AlertCircle className="w-10 h-10 mb-3" />
        <p>Rapor verileri yüklenirken bir hata oluştu.</p>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Ortalama m² Fiyatı",
      value: `₺${data.stats.avg_price_per_sqm.toLocaleString("tr-TR")}`,
      icon: DollarSign,
    },
    {
      title: "Toplam İlan",
      value: data.stats.total_listings.toLocaleString("tr-TR"),
      icon: Home,
    },
    {
      title: "Aktif İlçe",
      value: data.stats.city_count.toString(),
      icon: MapPin,
    },
    {
      title: "Aylık Yeni İlan",
      value: (data.monthly_trend[data.monthly_trend.length - 1]?.count ?? 0).toLocaleString("tr-TR"),
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Raporlar</h1>
          <p className="text-muted-foreground">Piyasa analizi ve istatistikler</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => data && printReport(data)}>
          <Download className="w-4 h-4" />
          Rapor İndir
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 text-sm mt-1 text-success">
                      <TrendingUp className="w-4 h-4" />
                      gerçek veri
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly trend bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Aylık Yeni İlan Sayısı</CardTitle>
            </CardHeader>
            <CardContent>
              {data.monthly_trend.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Henüz veri yok.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.monthly_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" name="Yeni İlan" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* City breakdown pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">İlçelere Göre İlanlar</CardTitle>
            </CardHeader>
            <CardContent>
              {data.city_breakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Henüz ilan yok.</p>
              ) : (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="50%" height={250}>
                    <PieChart>
                      <Pie
                        data={data.city_breakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={2}
                        dataKey="count"
                      >
                        {data.city_breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 flex-1">
                    {data.city_breakdown.map((item) => (
                      <div key={item.city} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm truncate">{item.city}</span>
                        <span className="text-sm text-muted-foreground ml-auto">
                          {item.count.toLocaleString("tr-TR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* City avg price bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">İlçelere Göre Ortalama Fiyat (₺)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.city_breakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Henüz veri yok.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.city_breakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="city"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(v: number) => `₺${(v / 1000000).toFixed(1)}M`}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v: number) => [`₺${v.toLocaleString("tr-TR")}`, "Ort. Fiyat"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="avg_price" name="Ort. Fiyat" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
