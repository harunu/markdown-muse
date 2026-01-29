import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Admin pages (keeping them)
import AdminIndex from "./pages/admin/AdminIndex";
import AdminListings from "./pages/admin/AdminListings";
import AdminImport from "./pages/admin/AdminImport";
import AdminHistory from "./pages/admin/AdminHistory";
import AdminQuality from "./pages/admin/AdminQuality";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

// Simple auth check
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          
          {/* Admin Routes (keeping separate) */}
          <Route path="/admin" element={<AdminIndex />} />
          <Route path="/admin/ilanlar" element={<AdminListings />} />
          <Route path="/admin/import" element={<AdminImport />} />
          <Route path="/admin/gecmis" element={<AdminHistory />} />
          <Route path="/admin/kalite" element={<AdminQuality />} />
          <Route path="/admin/analiz" element={<AdminAnalytics />} />
          <Route path="/admin/ayarlar" element={<AdminSettings />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
