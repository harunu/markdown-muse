import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  MapPin,
  Home,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
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

const priceData = [
  { month: "Oca", kadikoy: 135000, besiktas: 180000, uskudar: 115000 },
  { month: "Şub", kadikoy: 138000, besiktas: 185000, uskudar: 118000 },
  { month: "Mar", kadikoy: 142000, besiktas: 190000, uskudar: 120000 },
  { month: "Nis", kadikoy: 140000, besiktas: 188000, uskudar: 122000 },
  { month: "May", kadikoy: 145000, besiktas: 195000, uskudar: 125000 },
  { month: "Haz", kadikoy: 148000, besiktas: 200000, uskudar: 128000 },
];

const listingsByDistrict = [
  { name: "Kadıköy", value: 2450, color: "hsl(217, 91%, 60%)" },
  { name: "Beşiktaş", value: 1890, color: "hsl(160, 84%, 39%)" },
  { name: "Üsküdar", value: 1650, color: "hsl(38, 92%, 50%)" },
  { name: "Ataşehir", value: 1420, color: "hsl(280, 65%, 60%)" },
  { name: "Diğer", value: 5046, color: "hsl(220, 14%, 65%)" },
];

const monthlyListings = [
  { month: "Oca", new: 1234, sold: 890 },
  { month: "Şub", new: 1456, sold: 1020 },
  { month: "Mar", new: 1678, sold: 1150 },
  { month: "Nis", new: 1890, sold: 1280 },
  { month: "May", new: 2100, sold: 1420 },
  { month: "Haz", new: 2340, sold: 1580 },
];

const statsCards = [
  {
    title: "Ortalama m² Fiyatı",
    value: "₺142,500",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Toplam İlan",
    value: "12,456",
    change: "+234",
    trend: "up",
    icon: Home,
  },
  {
    title: "Aktif Bölge",
    value: "15",
    change: "+2",
    trend: "up",
    icon: MapPin,
  },
  {
    title: "Aylık Satış",
    value: "1,580",
    change: "-3.1%",
    trend: "down",
    icon: BarChart3,
  },
];

const ReportsPage = () => {
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
        <div className="flex gap-2">
          <Select defaultValue="last-6">
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-30">Son 30 gün</SelectItem>
              <SelectItem value="last-3">Son 3 ay</SelectItem>
              <SelectItem value="last-6">Son 6 ay</SelectItem>
              <SelectItem value="last-12">Son 12 ay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Rapor İndir
          </Button>
        </div>
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
                    <div className={`flex items-center gap-1 text-sm mt-1 ${
                      stat.trend === "up" ? "text-success" : "text-destructive"
                    }`}>
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stat.change}
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
        {/* Price Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">m² Fiyat Trendi (₺)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="kadikoy" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={2}
                    name="Kadıköy"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="besiktas" 
                    stroke="hsl(160, 84%, 39%)" 
                    strokeWidth={2}
                    name="Beşiktaş"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="uskudar" 
                    stroke="hsl(38, 92%, 50%)" 
                    strokeWidth={2}
                    name="Üsküdar"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Listings by District */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">İlçeye Göre İlanlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={250}>
                  <PieChart>
                    <Pie
                      data={listingsByDistrict}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {listingsByDistrict.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {listingsByDistrict.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Listings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Aylık İlan Hareketleri</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyListings}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="new" fill="hsl(217, 91%, 60%)" name="Yeni İlan" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sold" fill="hsl(160, 84%, 39%)" name="Satılan" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
