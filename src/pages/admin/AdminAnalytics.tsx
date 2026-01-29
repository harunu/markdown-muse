import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, Eye, MousePointer, Clock, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const viewsData = [
  { name: "Pzt", views: 4200, clicks: 320 },
  { name: "Sal", views: 3800, clicks: 280 },
  { name: "Çar", views: 5100, clicks: 420 },
  { name: "Per", views: 4700, clicks: 380 },
  { name: "Cum", views: 6200, clicks: 520 },
  { name: "Cmt", views: 8500, clicks: 680 },
  { name: "Paz", views: 7800, clicks: 620 },
];

const trendData = [
  { name: "Hafta 1", value: 12500 },
  { name: "Hafta 2", value: 15200 },
  { name: "Hafta 3", value: 14800 },
  { name: "Hafta 4", value: 18900 },
];

const stats = [
  { label: "Toplam Görüntüleme", value: "42.5K", change: "+12%", trend: "up", icon: Eye },
  { label: "Tıklama Oranı", value: "%8.2", change: "+2.1%", trend: "up", icon: MousePointer },
  { label: "Ort. Sayfa Süresi", value: "3:24", change: "-0:15", trend: "down", icon: Clock },
  { label: "Aktif Kullanıcı", value: "1,892", change: "+156", trend: "up", icon: Users },
];

const AdminAnalytics = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Analiz</h2>
            <p className="text-muted-foreground">Detaylı trafik ve etkileşim analizleri</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Son 7 Gün</Button>
            <Button variant="outline" size="sm">Son 30 Gün</Button>
            <Button variant="outline" size="sm">Son 90 Gün</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${
                      stat.trend === "up" ? "text-admin-success" : "text-admin-error"
                    }`}>
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-admin-blue/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-admin-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Views Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Günlük Görüntüleme ve Tıklama
              </CardTitle>
              <CardDescription>Son 7 günün performansı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="views" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="clicks" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Haftalık Trend
              </CardTitle>
              <CardDescription>Son 4 haftanın trendi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
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
                      stroke="hsl(262, 83%, 58%)" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(262, 83%, 58%)", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
