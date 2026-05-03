import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Plus, Upload, MoreHorizontal,
  Eye, Trash2, Check, Loader2, AlertCircle, ChevronLeft, ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useProperties, useDeleteProperty } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const formatPrice = (value: number) => {
  if (value >= 1000000) return `₺${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `₺${(value / 1000).toFixed(0)}K`;
  return `₺${value}`;
};

const STATUS_LABELS: Record<string, string> = {
  active: "Aktif",
  inactive: "Pasif",
  draft: "Taslak",
  deleted: "Silindi",
};

const ListingsManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const params: Record<string, unknown> = { page, page_size: 15 };
  if (search) params.search = search;
  if (cityFilter) params.city = cityFilter;
  if (statusFilter) params.status = statusFilter;
  else params.status = undefined; // show all statuses in admin

  const { data, isLoading, error } = useProperties(params);
  const deleteMutation = useDeleteProperty();

  const listings = data?.results ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === listings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(listings.map((l) => l.id));
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast({ title: "İlan silindi." });
      setSelectedIds((prev) => prev.filter((id) => id !== deleteId));
    } catch {
      toast({ title: "Silme işlemi başarısız.", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="İlan ara..."
            className="pl-10"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-2">
          <Link to="/admin/import">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              CSV Import
            </Button>
          </Link>
          <Button variant="default" className="gap-2" disabled>
            <Plus className="w-4 h-4" />
            Yeni İlan
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        <select
          className="h-9 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-admin-blue/30"
          value={cityFilter}
          onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
        >
          <option value="">Tüm Şehirler</option>
          <option value="İstanbul">İstanbul</option>
          <option value="Ankara">Ankara</option>
          <option value="İzmir">İzmir</option>
          <option value="Antalya">Antalya</option>
          <option value="Bursa">Bursa</option>
        </select>
        <select
          className="h-9 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-admin-blue/30"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">Tüm Durumlar</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
          <option value="draft">Taslak</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-3 bg-admin-blue/10 rounded-lg"
        >
          <span className="text-sm text-admin-blue font-medium">
            {selectedIds.length} ilan seçildi
          </span>
          <Button variant="default" size="sm" className="gap-1">
            <Check className="w-3 h-3" />
            Aktif Yap
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-1"
            onClick={() => setDeleteId(selectedIds[0])}
          >
            <Trash2 className="w-3 h-3" />
            Sil
          </Button>
        </motion.div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-admin-blue" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-6 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>İlanlar yüklenirken hata oluştu.</span>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-4 text-left">
                    <Checkbox
                      checked={listings.length > 0 && selectedIds.length === listings.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">İlan</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Konum</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Fiyat</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Kaynak</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Durum</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {listings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">
                      Ilan bulunamadı.{" "}
                      <Link to="/admin/import" className="text-admin-blue underline">
                        CSV ile import yapın
                      </Link>
                    </td>
                  </tr>
                ) : (
                  listings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedIds.includes(listing.id)}
                          onCheckedChange={() => toggleSelect(listing.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{listing.title}</p>
                          <p className="text-xs text-muted-foreground">ID: {listing.id}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {listing.district}, {listing.city}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{formatPrice(listing.price)}</p>
                          {listing.area && (
                            <p className="text-xs text-muted-foreground">{listing.area} m²</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {listing.source ?? "manual"}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          listing.status === "active"
                            ? "bg-admin-success/10 text-admin-success"
                            : listing.status === "draft"
                            ? "bg-admin-warning/10 text-admin-warning"
                            : "bg-admin-error/10 text-admin-error"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            listing.status === "active" ? "bg-admin-success" :
                            listing.status === "draft" ? "bg-admin-warning" : "bg-admin-error"
                          }`} />
                          {STATUS_LABELS[listing.status] ?? listing.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/listings/${listing.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Görüntüle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteId(listing.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Toplam: <span className="font-medium text-foreground">{total.toLocaleString("tr-TR")}</span> ilan
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>İlanı sil?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. İlan veritabanından kaldırılacak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListingsManagement;
