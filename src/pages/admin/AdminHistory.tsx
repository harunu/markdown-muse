import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Download, Eye, CheckCircle2, XCircle, Clock } from "lucide-react";

const importHistory = [
  {
    id: 1,
    filename: "istanbul_emlak_2024.csv",
    date: "2024-01-15 14:30",
    records: 1250,
    success: 1245,
    failed: 5,
    status: "completed",
  },
  {
    id: 2,
    filename: "ankara_konut.csv",
    date: "2024-01-14 10:15",
    records: 800,
    success: 800,
    failed: 0,
    status: "completed",
  },
  {
    id: 3,
    filename: "izmir_ticari.csv",
    date: "2024-01-13 16:45",
    records: 320,
    success: 0,
    failed: 320,
    status: "failed",
  },
  {
    id: 4,
    filename: "antalya_villa.csv",
    date: "2024-01-12 09:00",
    records: 150,
    success: 75,
    failed: 0,
    status: "processing",
  },
];

const AdminHistory = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-admin-success/10 text-admin-success border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Tamamlandı
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-admin-error/10 text-admin-error border-0">
            <XCircle className="w-3 h-3 mr-1" />
            Başarısız
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-admin-warning/10 text-admin-warning border-0">
            <Clock className="w-3 h-3 mr-1" />
            İşleniyor
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Import Geçmişi</h2>
            <p className="text-muted-foreground">Tüm CSV import işlemlerinin geçmişi</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Rapor İndir
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Son İşlemler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {importHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.filename}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{item.records} kayıt</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-admin-success">{item.success} başarılı</span>
                        {item.failed > 0 && (
                          <span className="text-admin-error ml-2">{item.failed} hatalı</span>
                        )}
                      </p>
                    </div>
                    {getStatusBadge(item.status)}
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminHistory;
