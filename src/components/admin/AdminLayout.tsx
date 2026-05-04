import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, Upload, History,
  Database, BarChart3, Settings, Bell, User,
  ChevronLeft, ChevronRight, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: FileText, label: "İlan Yönetimi", path: "/admin/listings" },
  { icon: Upload, label: "CSV Import", path: "/admin/import" },
  { icon: History, label: "Import Geçmişi", path: "/admin/history" },
  { icon: Database, label: "Veri Kalitesi", path: "/admin/quality" },
  { icon: BarChart3, label: "Analiz", path: "/admin/analytics" },
  { icon: Settings, label: "Ayarlar", path: "/admin/settings" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="admin-theme min-h-screen bg-background font-admin">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 z-40",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <span className="text-sm font-bold text-sidebar-primary-foreground">AI</span>
              </div>
              <span className="font-semibold">Emlak Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-0 right-0 px-2">
          <Button
            variant="ghost"
            onClick={() => logout()}
            className={cn(
              "w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-3 text-sm">Çıkış Yap</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("transition-all duration-300", collapsed ? "ml-16" : "ml-64")}>
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-lg font-semibold text-foreground">
            {menuItems.find((item) => item.path === location.pathname)?.label || "Admin"}
          </h1>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" title="Bildirimler">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-admin-error rounded-full animate-pulse" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-admin-blue/20 flex items-center justify-center">
                <span className="text-xs font-bold text-admin-blue">AD</span>
              </div>
              <span className="text-sm font-medium text-foreground hidden md:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-background/50 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
