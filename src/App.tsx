import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "@/lib/query-client";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import InternalLayout from "./components/internal/InternalLayout";
import Dashboard from "./pages/internal/Dashboard";
import SearchPage from "./pages/internal/SearchPage";
import ListingsPage from "./pages/internal/ListingsPage";
import ListingDetailPage from "./pages/internal/ListingDetailPage";
import ImportPage from "./pages/internal/ImportPage";
import FavoritesPage from "./pages/internal/FavoritesPage";
import ComparePage from "./pages/internal/ComparePage";
import ReportsPage from "./pages/internal/ReportsPage";
import SettingsPage from "./pages/internal/SettingsPage";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminIndex from "./pages/admin/AdminIndex";
import AdminListings from "./pages/admin/AdminListings";
import AdminImport from "./pages/admin/AdminImport";
import AdminHistory from "./pages/admin/AdminHistory";
import AdminQuality from "./pages/admin/AdminQuality";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

// Loading spinner component
const FullPageSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Protected route using AuthContext
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin route - requires yonetici or super_admin role
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.rol !== 'yonetici' && user?.rol !== 'super_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Routes wrapped with AuthProvider
const AppRoutes = () => (
  <Routes>
    {/* Login */}
    <Route path="/login" element={<Login />} />

    {/* Redirect root to dashboard */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />

    {/* Protected Internal App Routes */}
    <Route
      element={
        <ProtectedRoute>
          <InternalLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/listings" element={<ListingsPage />} />
      <Route path="/listings/:id" element={<ListingDetailPage />} />
      <Route path="/import" element={<ImportPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Route>

    {/* Admin Routes */}
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminIndex />
        </AdminRoute>
      }
    />
    <Route
      path="/admin/ilanlar"
      element={
        <AdminRoute>
          <AdminListings />
        </AdminRoute>
      }
    />
    <Route
      path="/admin/import"
      element={
        <AdminRoute>
          <AdminImport />
        </AdminRoute>
      }
    />
    <Route
      path="/admin/gecmis"
      element={
        <AdminRoute>
          <AdminHistory />
        </AdminRoute>
      }
    />
    <Route
      path="/admin/kalite"
      element={
        <AdminRoute>
          <AdminQuality />
        </AdminRoute>
      }
    />
    <Route
      path="/admin/analiz"
      element={
        <AdminRoute>
          <AdminAnalytics />
        </AdminRoute>
      }
    />
    <Route
      path="/admin/ayarlar"
      element={
        <AdminRoute>
          <AdminSettings />
        </AdminRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
