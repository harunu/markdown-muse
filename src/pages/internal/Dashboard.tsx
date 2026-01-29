import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Search,
  Star,
  Upload,
  BarChart3,
  ArrowRight,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const statsCards = [
  {
    title: "Toplam İlan",
    value: "12,456",
    icon: FileText,
    change: "+234 bu hafta",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Bugün Arama",
    value: "23",
    icon: Search,
    change: "aramanız",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Favori Listesi",
    value: "8",
    icon: Star,
    change: "ilan",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Son Import",
    value: "1,234",
    icon: Upload,
    change: "ilan eklendi",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

const recentSearches = [
  { query: "Kadıköy 2+1 15M altı", results: 45, time: "2 saat önce" },
  { query: "Beşiktaş yatırımlık", results: 23, time: "5 saat önce" },
  { query: "Ataşehir kiralık ofis", results: 12, time: "dün" },
  { query: "Üsküdar deniz manzaralı", results: 31, time: "2 gün önce" },
];

const quickActions = [
  { label: "Yeni Arama", icon: Search, path: "/search", variant: "default" as const },
  { label: "CSV Yükle", icon: Upload, path: "/import", variant: "outline" as const },
  { label: "Rapor Oluştur", icon: BarChart3, path: "/reports", variant: "outline" as const },
];

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || '{"name": "Kullanıcı"}');
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Hoş geldin, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Son güncelleme: {new Date().toLocaleDateString("tr-TR", { 
              day: "numeric", 
              month: "long", 
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
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
            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-semibold text-foreground mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.path}>
                  <Button variant={action.variant} className="gap-2">
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Searches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Son Aramalarım</CardTitle>
            <Link to="/search">
              <Button variant="ghost" size="sm" className="gap-1">
                Tümü
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border">
              {recentSearches.map((search, index) => (
                <Link
                  key={index}
                  to={`/search?q=${encodeURIComponent(search.query)}`}
                  className="flex items-center justify-between py-3 hover:bg-muted/50 -mx-6 px-6 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Search className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-foreground">"{search.query}"</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{search.results} sonuç</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{search.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
