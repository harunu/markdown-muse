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
import { IlanOzet } from "@/types/api";

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M TL`;
  }
  return `${new Intl.NumberFormat("tr-TR").format(price)} TL`;
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    aktif: "bg-success/10 text-success border-success/20",
    taslak: "bg-warning/10 text-warning border-warning/20",
    pasif: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const labels: Record<string, string> = {
    aktif: "Aktif",
    taslak: "Taslak",
    pasif: "Pasif",
  };

  return (
    <Badge variant="outline" className={styles[status] || styles.aktif}>
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
    sayfa: currentPage,
    sayfa_boyutu: pageSize,
  };
  if (searchQuery) queryParams.arama = searchQuery;
  if (cityFilter) queryParams.sehir = cityFilter;
  if (districtFilter) queryParams.ilce = districtFilter;
  if (statusFilter) queryParams.durum = statusFilter;

  // API hooks
  const { data, isLoading, error, refetch } = useProperties(queryParams);
  const deleteMutation = useDeleteProperty();

  const listings = data?.sonuclar || [];
  const totalItems = data?.toplam || 0;
  const totalPages = data?.toplam_sayfa || 1;

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
        <h1 className="text-2xl font-semibold text-foreground">Ilan Yonetimi</h1>
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
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sehir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="istanbul">Istanbul</SelectItem>
                <SelectItem value="ankara">Ankara</SelectItem>
                <SelectItem value="izmir">Izmir</SelectItem>
              </SelectContent>
            </Select>
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Ilce" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kadikoy">Kadikoy</SelectItem>
                <SelectItem value="besiktas">Besiktas</SelectItem>
                <SelectItem value="uskudar">Uskudar</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="taslak">Taslak</SelectItem>
                <SelectItem value="pasif">Pasif</SelectItem>
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
            Secili: {selectedIds.length} ilan
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Bot className="w-4 h-4" />
              Toplu AI Analiz
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Disa Aktar
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
              <p>Ilanlar yüklenirken bir hata olustu.</p>
              <Button variant="link" onClick={() => refetch()}>
                Tekrar dene
              </Button>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Search className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-lg font-medium">Ilan bulunamadı</p>
              <p className="text-sm">Farklı filtrelerle arama yapin</p>
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
                  <TableHead>Ilan</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Kaynak</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="w-16">Islem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((listing: IlanOzet) => (
                  <TableRow key={listing.id} className="group">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(listing.id)}
                        onCheckedChange={() => toggleSelection(listing.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{listing.baslik}</p>
                        <p className="text-xs text-muted-foreground">
                          {listing.oda_sayisi} - {listing.metrekare || "-"} m2
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-foreground">{listing.ilce}</p>
                        <p className="text-xs text-muted-foreground">{listing.sehir}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{formatPrice(listing.fiyat)}</p>
                        {listing.birim_fiyat && (
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(listing.birim_fiyat)}/m2
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{listing.kaynak}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={listing.durum} />
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
                            Goruntule
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
            <AlertDialogTitle>Ilani silmek istediginize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu islem geri alinamaz. Ilan kalici olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Iptal</AlertDialogCancel>
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
