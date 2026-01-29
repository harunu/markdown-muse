import { 
  BarChart3, FileText, RefreshCw, AlertTriangle,
  TrendingUp, TrendingDown, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const stats = [
  { 
    icon: BarChart3, 
    label: "Toplam İlan", 
    value: "12,456", 
    change: "+245 hafta",
    trend: "up",
    color: "bg-admin-blue/10 text-admin-blue"
  },
  { 
    icon: FileText, 
    label: "Aktif İlan", 
    value: "11,234", 
    change: "%90.2",
    trend: "up",
    color: "bg-admin-success/10 text-admin-success"
  },
  { 
    icon: RefreshCw, 
    label: "Bugün Güncelleme", 
    value: "156", 
    change: "↑ %12",
    trend: "up",
    color: "bg-admin-warning/10 text-admin-warning"
  },
  { 
    icon: AlertTriangle, 
    label: "Sorunlu Veri", 
    value: "23", 
    change: "↓ 5",
    trend: "down",
    color: "bg-admin-error/10 text-admin-error"
  },
];

const lineChartData = [
  { name: "1 Mar", value: 12000 },
  { name: "5 Mar", value: 12100 },
  { name: "10 Mar", value: 12250 },
  { name: "15 Mar", value: 12180 },
  { name: "20 Mar", value: 12350 },
  { name: "25 Mar", value: 12400 },
  { name: "30 Mar", value: 12456 },
];

const pieChartData = [
  { name: "İstanbul", value: 6500, color: "#3b82f6" },
  { name: "Ankara", value: 2500, color: "#10b981" },
  { name: "İzmir", value: 1800, color: "#f59e0b" },
  { name: "Antalya", value: 1200, color: "#ef4444" },
  { name: "Diğer", value: 456, color: "#6b7280" },
];

const recentActivity = [
  { status: "success", title: "CSV Import tamamlandı", detail: "1,234 ilan", time: "2 dk önce" },
  { status: "warning", title: "Fiyat güncelleme", detail: "45 ilan", time: "15 dk önce" },
  { status: "error", title: "Import hatası", detail: "listings_march.csv", time: "1 saat önce" },
  { status: "success", title: "AI analiz tamamlandı", detail: "Batch #456", time: "2 saat önce" },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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
              <LineChart data={lineChartData}>
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
                    borderRadius: "8px"
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
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground flex-1">{item.name}</span>
                  <span className="text-sm font-medium text-foreground">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-xl border border-border"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Son İşlemler</h3>
          <Button variant="ghost" size="sm" className="gap-1 text-admin-blue">
            Tümü <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === "success" ? "bg-admin-success" :
                activity.status === "warning" ? "bg-admin-warning" : "bg-admin-error"
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
