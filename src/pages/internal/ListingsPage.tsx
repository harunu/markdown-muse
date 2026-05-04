import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Bot,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useProperties, useDeleteProperty } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { PropertySummary } from "@/types/api";

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M TL`;
  }
  return `${new Intl.NumberFormat("tr-TR").format(price)} TL`;
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: "bg-success/10 text-success border-success/20",
    draft: "bg-warning/10 text-warning border-warning/20",
    inactive: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const labels: Record<string, string> = {
    active: "Aktif",
    draft: "Taslak",
    inactive: "Pasif",
  };

  return (
    <Badge variant="outline" className={styles[status] || styles.active}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${
        status === 'active' ? 'bg-success' : status === 'draft' ? 'bg-warning' : 'bg-destructive'
      }`} />
      {labels[status] || status}
    </Badge>
  );
};

const ListingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<string>();
  const [districtFilter, setDistrictFilter] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Build query params
  const queryParams: Record<string, unknown> = {
    page: currentPage,
    page_size: pageSize,
  };
  if (searchQuery) queryParams.search = searchQuery;
  if (cityFilter) queryParams.city = cityFilter;
  if (districtFilter) queryParams.district = districtFilter;
  if (statusFilter) queryParams.status = statusFilter;

  // API hooks
  const { data, isLoading, error, refetch } = useProperties(queryParams);
  const deleteMutation = useDeleteProperty();

  const listings = data?.results || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  // Selection handlers
  const toggleSelection = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === listings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(listings.map(l => l.id));
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      toast({ title: "Ilan silindi" });
      setSelectedIds(prev => prev.filter(id => id !== deleteId));
    } catch {
      toast({ title: "Silme hatasi", variant: "destructive" });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    refetch();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setCityFilter(undefined);
    setDistrictFilter(undefined);
    setStatusFilter(undefined);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <h1 className="text-2xl font-semibold text-foreground">İlan Yönetimi</h1>
        <Link to="/import">
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            CSV Import
          </Button>
        </Link>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="pl-9"
              />
            </div>
            <Select value={cityFilter} onValueChange={(v) => { setCityFilter(v); setDistrictFilter(undefined); }}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Şehir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mugla">Muğla</SelectItem>
                <SelectItem value="istanbul">İstanbul</SelectItem>
                <SelectItem value="ankara">Ankara</SelectItem>
                <SelectItem value="izmir">İzmir</SelectItem>
                <SelectItem value="antalya">Antalya</SelectItem>
                <SelectItem value="bursa">Bursa</SelectItem>
                <SelectItem value="konya">Konya</SelectItem>
                <SelectItem value="adana">Adana</SelectItem>
                <SelectItem value="kocaeli">Kocaeli</SelectItem>
              </SelectContent>
            </Select>
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="İlçe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bodrum">Bodrum</SelectItem>
                <SelectItem value="Marmaris">Marmaris</SelectItem>
                <SelectItem value="Fethiye">Fethiye</SelectItem>
                <SelectItem value="Datça">Datça</SelectItem>
                <SelectItem value="Kadıköy">Kadıköy</SelectItem>
                <SelectItem value="Beşiktaş">Beşiktaş</SelectItem>
                <SelectItem value="Şişli">Şişli</SelectItem>
                <SelectItem value="Çankaya">Çankaya</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="draft">Taslak</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={applyFilters}>
              <Filter className="w-4 h-4" />
              Filtrele
            </Button>
            <Button variant="ghost" onClick={clearFilters}>
              Temizle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 rounded-lg p-3 flex items-center justify-between"
        >
          <span className="text-sm font-medium">
            Seçili: {selectedIds.length} ilan
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Bot className="w-4 h-4" />
              Toplu AI Analiz
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Dışa Aktar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive"
              onClick={() => {
                // For bulk delete, would need a separate mutation
                toast({ title: "Toplu silme henüz desteklenmiyor", variant: "destructive" });
              }}
            >
              <Trash2 className="w-4 h-4" />
              Sil
            </Button>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-destructive">
              <AlertCircle className="w-10 h-10 mb-3" />
              <p>İlanlar yüklenirken bir hata oluştu.</p>
              <Button variant="link" onClick={() => refetch()}>
                Tekrar dene
              </Button>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-1">İlan bulunamadı</p>
              <p className="text-sm text-muted-foreground">Farklı filtrelerle arama yapın</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === listings.length && listings.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>İlan</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Kaynak</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="w-16">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((listing: PropertySummary) => (
                  <TableRow key={listing.id} className="group">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(listing.id)}
                        onCheckedChange={() => toggleSelection(listing.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {listing.room_count} - {listing.area || "-"} m²
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-foreground">{listing.district}</p>
                        <p className="text-xs text-muted-foreground">{listing.city}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{formatPrice(listing.price)}</p>
                        {listing.price_per_sqm && (
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(listing.price_per_sqm)}/m²
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{listing.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={listing.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/listings/${listing.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Görüntüle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/listings/${listing.id}`)}>
                            <Bot className="w-4 h-4 mr-2" />
                            AI Analiz
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setDeleteId(listing.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {listings.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Toplam: {totalItems.toLocaleString("tr-TR")} ilan</p>
          <div className="flex items-center gap-2">
            <span>Sayfa:</span>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="min-w-16 text-center">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Select
              value={pageSize.toString()}
              onValueChange={(v) => {
                setPageSize(parseInt(v));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>İlanı silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. İlan kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Sil"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListingsPage;
