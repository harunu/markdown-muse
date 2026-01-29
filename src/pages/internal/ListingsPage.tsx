import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Bot,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const listings = [
  {
    id: "KDK-001",
    title: "2+1 Daire",
    location: "Kadıköy, İstanbul",
    price: 12500000,
    area: 95,
    source: "CSV",
    status: "active",
    createdAt: "29 Oca 2025",
  },
  {
    id: "BSK-002",
    title: "3+1 Villa",
    location: "Beşiktaş, İstanbul",
    price: 45200000,
    area: 280,
    source: "CSV",
    status: "active",
    createdAt: "25 Oca 2025",
  },
  {
    id: "USK-003",
    title: "1+1 Daire",
    location: "Üsküdar, İstanbul",
    price: 6500000,
    area: 55,
    source: "Manuel",
    status: "pending",
    createdAt: "20 Oca 2025",
  },
  {
    id: "ATS-004",
    title: "4+1 Rezidans",
    location: "Ataşehir, İstanbul",
    price: 32000000,
    area: 185,
    source: "CSV",
    status: "active",
    createdAt: "18 Oca 2025",
  },
  {
    id: "MLT-005",
    title: "2+1 Daire",
    location: "Maltepe, İstanbul",
    price: 8900000,
    area: 85,
    source: "CSV",
    status: "inactive",
    createdAt: "15 Oca 2025",
  },
];

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `₺${(price / 1000000).toFixed(1)}M`;
  }
  return `₺${new Intl.NumberFormat("tr-TR").format(price)}`;
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    active: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    inactive: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const labels = {
    active: "Aktif",
    pending: "Beklemede",
    inactive: "Pasif",
  };

  return (
    <Badge variant="outline" className={styles[status as keyof typeof styles]}>
      {labels[status as keyof typeof labels]}
    </Badge>
  );
};

const ListingsPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelection = (id: string) => {
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
                className="pl-9"
              />
            </div>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Şehir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="istanbul">İstanbul</SelectItem>
                <SelectItem value="ankara">Ankara</SelectItem>
                <SelectItem value="izmir">İzmir</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="İlçe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kadikoy">Kadıköy</SelectItem>
                <SelectItem value="besiktas">Beşiktaş</SelectItem>
                <SelectItem value="uskudar">Üsküdar</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="pending">Beklemede</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtrele
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
            <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
              Sil
            </Button>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === listings.length}
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
              {listings.map((listing) => (
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
                      <p className="text-xs text-muted-foreground">ID: {listing.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-foreground">{listing.location.split(",")[0]}</p>
                      <p className="text-xs text-muted-foreground">{listing.location.split(",")[1]}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{formatPrice(listing.price)}</p>
                      <p className="text-xs text-muted-foreground">{listing.area} m²</p>
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
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Görüntüle
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bot className="w-4 h-4 mr-2" />
                          AI Analiz
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
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
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Toplam: 12,456 ilan</p>
        <div className="flex items-center gap-2">
          <span>Sayfa:</span>
          <Button variant="outline" size="icon" className="w-8 h-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="min-w-8 h-8">1</Button>
          <Button variant="ghost" size="sm" className="min-w-8 h-8">2</Button>
          <Button variant="ghost" size="sm" className="min-w-8 h-8">3</Button>
          <span>...</span>
          <Button variant="ghost" size="sm" className="min-w-8 h-8">498</Button>
          <Button variant="outline" size="icon" className="w-8 h-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Select defaultValue="25">
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
    </div>
  );
};

export default ListingsPage;
