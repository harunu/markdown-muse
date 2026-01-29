import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Plus, Upload, Download, MoreHorizontal, 
  Eye, Edit, Bot, Power, Trash2, Check
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

const listings = [
  { id: "KDK-001", title: "2+1 Daire", location: "Kadıköy, İstanbul", price: 12500000, area: 95, source: "sahibinden", status: "active" },
  { id: "BSK-002", title: "3+1 Villa", location: "Beşiktaş, İstanbul", price: 45200000, area: 280, source: "emlakjet", status: "pending" },
  { id: "USK-003", title: "1+1 Stüdyo", location: "Üsküdar, İstanbul", price: 6800000, area: 55, source: "hepsiemlak", status: "active" },
  { id: "ANK-004", title: "4+1 Dubleks", location: "Çankaya, Ankara", price: 18500000, area: 185, source: "sahibinden", status: "active" },
  { id: "IZM-005", title: "2+1 Rezidans", location: "Karşıyaka, İzmir", price: 9200000, area: 88, source: "emlakjet", status: "error" },
];

const formatPrice = (value: number) => `₺${(value / 1000000).toFixed(1)}M`;

const ListingsManagement = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            variant="admin"
            placeholder="İlan ara..." 
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="adminSecondary" className="gap-2">
            <Upload className="w-4 h-4" />
            CSV Import
          </Button>
          <Button variant="adminSecondary" className="gap-2">
            <Download className="w-4 h-4" />
            Dışa Aktar
          </Button>
          <Button variant="admin" className="gap-2">
            <Plus className="w-4 h-4" />
            Yeni İlan
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        <select className="h-9 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-admin-blue/30">
          <option>Tüm Şehirler</option>
          <option>İstanbul</option>
          <option>Ankara</option>
          <option>İzmir</option>
        </select>
        <select className="h-9 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-admin-blue/30">
          <option>Tüm Durumlar</option>
          <option>Aktif</option>
          <option>Beklemede</option>
          <option>Hatalı</option>
        </select>
        <select className="h-9 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-admin-blue/30">
          <option>Tüm Kaynaklar</option>
          <option>sahibinden</option>
          <option>emlakjet</option>
          <option>hepsiemlak</option>
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
          <Button variant="admin" size="sm" className="gap-1">
            <Check className="w-3 h-3" />
            Aktif Yap
          </Button>
          <Button variant="adminSecondary" size="sm" className="gap-1">
            <Bot className="w-3 h-3" />
            AI Analiz
          </Button>
          <Button variant="adminDanger" size="sm" className="gap-1">
            <Trash2 className="w-3 h-3" />
            Sil
          </Button>
        </motion.div>
      )}

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedIds.length === listings.length}
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
              {listings.map((listing) => (
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
                  <td className="p-4 text-sm text-muted-foreground">{listing.location}</td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{formatPrice(listing.price)}</p>
                      <p className="text-xs text-muted-foreground">{listing.area} m²</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{listing.source}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      listing.status === "active" ? "status-active" :
                      listing.status === "pending" ? "status-pending" : "status-error"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        listing.status === "active" ? "bg-admin-success" :
                        listing.status === "pending" ? "bg-admin-warning" : "bg-admin-error"
                      }`} />
                      {listing.status === "active" ? "Aktif" : 
                       listing.status === "pending" ? "Beklemede" : "Hatalı"}
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
                        <DropdownMenuItem>
                          <Power className="w-4 h-4 mr-2" />
                          Deaktif Et
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Toplam: <span className="font-medium text-foreground">12,456</span> ilan
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled>Önceki</Button>
            <Button variant="admin" size="sm">1</Button>
            <Button variant="ghost" size="sm">2</Button>
            <Button variant="ghost" size="sm">3</Button>
            <span className="text-muted-foreground">...</span>
            <Button variant="ghost" size="sm">124</Button>
            <Button variant="ghost" size="sm">Sonraki</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingsManagement;
