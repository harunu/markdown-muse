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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardStats, useRecentSearches } from "@/hooks/useApi";


// Format relative time in Turkish
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "az önce";
  if (diffMins < 60) return `${diffMins} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays === 1) return "dün";
  if (diffDays < 7) return `${diffDays} gün önce`;
  return date.toLocaleDateString("tr-TR");
};

// Format number with thousand separators
const formatNumber = (num: number): string => {
  return num.toLocaleString("tr-TR");
};

const quickActions = [
  { label: "Yeni Arama", icon: Search, path: "/search", variant: "default" as const },
  { label: "CSV Yükle", icon: Upload, path: "/import", variant: "outline" as const },
  { label: "Rapor Oluştur", icon: BarChart3, path: "/reports", variant: "outline" as const },
];

const Dashboard = () => {
  const { user } = useAuth();

  const { data: stats, isLoading: isStatsLoading, error: isStatsError } = useDashboardStats();
  const { data: recentSearches, isLoading: isSearchesLoading } = useRecentSearches();

  const firstName = user?.full_name?.split(" ")[0] || "Kullanıcı";

  // Build stats cards from API data
  const statsCards = [
    {
      title: "Toplam İlan",
      value: stats ? formatNumber(stats.total_properties) : "-",
      icon: FileText,
      change: "veritabanında",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-l-primary",
    },
    {
      title: "Bugün Arama",
      value: stats ? formatNumber(stats.today_searches) : "-",
      icon: Search,
      change: "aramanız",
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-l-success",
    },
    {
      title: "Favori Listesi",
      value: stats ? formatNumber(stats.favorites_count) : "-",
      icon: Star,
      change: "ilan",
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-l-warning",
    },
    {
      title: "Son Import",
      value: stats?.last_import ? formatNumber(stats.last_import.successful_rows) : "-",
      icon: Upload,
      change: stats?.last_import ? "ilan eklendi" : "henüz yok",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-l-secondary",
    },
  ];

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
            Hoş geldin, {firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role && <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium mr-2">{user.role}</span>}
            {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isStatsLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded"></div>
                    <div className="h-8 w-16 bg-muted rounded"></div>
                    <div className="h-3 w-24 bg-muted rounded"></div>
                  </div>
                  <div className="w-10 h-10 bg-muted rounded-lg"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : isStatsError ? (
          // Error state
          <Card className="col-span-full">
            <CardContent className="p-5 flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span>İstatistikler yüklenirken bir hata oluştu.</span>
            </CardContent>
          </Card>
        ) : (
          // Stats cards
          statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card data-testid="dashboard-stat-card" className={`hover:shadow-card transition-all border-l-4 ${stat.borderColor}`}>
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
          ))
        )}
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
            <p className="text-sm text-muted-foreground">Sık kullandığınız işlemlere hızlı erişin</p>
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
            <CardTitle className="text-lg">Son Aramalarim</CardTitle>
            <Link to="/search">
              <Button variant="ghost" size="sm" className="gap-1">
                Tümü
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {isSearchesLoading ? (
              // Loading state
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : !recentSearches || recentSearches.length === 0 ? (
              // Empty state
              <div className="text-center py-8 text-muted-foreground">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p>Henüz arama yapmadınız.</p>
                <Link to="/search">
                  <Button variant="link" className="mt-2">
                    İlk aramanızı yapın
                  </Button>
                </Link>
              </div>
            ) : (
              // Search list
              <div className="divide-y divide-border">
                {recentSearches.slice(0, 5).map((search) => (
                  <Link
                    key={search.id}
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
                      <span>{search.result_count} sonuç</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatRelativeTime(search.date)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
