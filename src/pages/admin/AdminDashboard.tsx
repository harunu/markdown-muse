import {
  BarChart3, FileText, RefreshCw, AlertTriangle,
  TrendingUp, TrendingDown, Loader2, AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { useAdminStats, useImportHistory } from "@/hooks/useApi";

const CITY_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"];

const formatRelativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat önce`;
  return `${Math.floor(hours / 24)} gün önce`;
};

const AdminDashboard = () => {
  const { data, isLoading, error } = useAdminStats();
  const { data: imports } = useImportHistory();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-admin-blue" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-3 p-6 text-admin-error">
        <AlertCircle className="w-5 h-5" />
        <span>İstatistikler yüklenemedi.</span>
      </div>
    );
  }

  const statCards = [
    {
      icon: BarChart3,
      label: "Toplam İlan",
      value: data.stats.total_listings.toLocaleString("tr-TR"),
      change: `${data.stats.active_listings.toLocaleString("tr-TR")} aktif`,
      trend: "up",
      color: "bg-admin-blue/10 text-admin-blue",
    },
    {
      icon: FileText,
      label: "Aktif İlan",
      value: data.stats.active_listings.toLocaleString("tr-TR"),
      change: data.stats.total_listings > 0
        ? `%${((data.stats.active_listings / data.stats.total_listings) * 100).toFixed(1)}`
        : "%0",
      trend: "up",
      color: "bg-admin-success/10 text-admin-success",
    },
    {
      icon: RefreshCw,
      label: "Bugün Güncelleme",
      value: data.stats.today_updated.toLocaleString("tr-TR"),
      change: "ilan",
      trend: "up",
      color: "bg-admin-warning/10 text-admin-warning",
    },
    {
      icon: AlertTriangle,
      label: "Sorunlu Veri",
      value: data.stats.quality_issues.toLocaleString("tr-TR"),
      change: "eksik alan",
      trend: data.stats.quality_issues > 0 ? "down" : "up",
      color: "bg-admin-error/10 text-admin-error",
    },
  ];

  const pieChartData = data.city_breakdown.map((item, i) => ({
    name: item.city,
    value: item.count,
    color: CITY_COLORS[i % CITY_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-admin-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-admin-error" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            İlan Sayısı (Son 30 Gün)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.time_series}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
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
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            İlanlara Göre Şehirler
          </h3>
          {pieChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
              Henüz ilan yok.
            </div>
          ) : (
            <div className="h-64 flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-2">
                {pieChartData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground flex-1">{item.name}</span>
                    <span className="text-sm font-medium text-foreground">
                      {item.value.toLocaleString("tr-TR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Imports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-xl border border-border"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Son Import İşlemleri</h3>
        </div>
        <div className="divide-y divide-border">
          {!imports || imports.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Henüz import yapılmadı.</p>
          ) : (
            imports.slice(0, 5).map((job) => (
              <div key={job.import_id} className="flex items-center gap-4 p-4">
                <div className={`w-2 h-2 rounded-full ${
                  job.status === "completed" ? "bg-admin-success" :
                  job.status === "failed" ? "bg-admin-error" : "bg-admin-warning"
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{job.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.successful_rows} başarılı
                    {job.failed_rows > 0 && `, ${job.failed_rows} hatalı`}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(job.created_at)}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
