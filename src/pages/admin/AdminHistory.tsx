import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Eye, CheckCircle2, XCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import { useImportHistory } from "@/hooks/useApi";
import { Link } from "react-router-dom";

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_MAP: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  completed: {
    label: "Tamamlandı",
    icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
    className: "bg-admin-success/10 text-admin-success border-0",
  },
  failed: {
    label: "Başarısız",
    icon: <XCircle className="w-3 h-3 mr-1" />,
    className: "bg-admin-error/10 text-admin-error border-0",
  },
  processing: {
    label: "İşleniyor",
    icon: <Clock className="w-3 h-3 mr-1" />,
    className: "bg-admin-warning/10 text-admin-warning border-0",
  },
  validating: {
    label: "Doğrulanıyor",
    icon: <Clock className="w-3 h-3 mr-1" />,
    className: "bg-admin-warning/10 text-admin-warning border-0",
  },
  pending_confirmation: {
    label: "Onay Bekliyor",
    icon: <Clock className="w-3 h-3 mr-1" />,
    className: "bg-admin-blue/10 text-admin-blue border-0",
  },
};

const AdminHistory = () => {
  const { data: history, isLoading, error } = useImportHistory();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Import Geçmişi</h2>
            <p className="text-muted-foreground">Tüm CSV import işlemlerinin geçmişi</p>
          </div>
          <Link to="/admin/import">
            <Button variant="outline">Yeni Import</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Son İşlemler
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 py-6 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span>Import geçmişi yüklenemedi.</span>
              </div>
            ) : !history || history.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                Henüz import yapılmadı.{" "}
                <Link to="/admin/import" className="text-admin-blue underline">
                  CSV yükleyin
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => {
                  const statusInfo = STATUS_MAP[item.status] ?? {
                    label: item.status,
                    icon: null,
                    className: "bg-muted text-muted-foreground border-0",
                  };
                  return (
                    <div
                      key={item.import_id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.file_name}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(item.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {item.total_rows} kayıt
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="text-admin-success">{item.successful_rows} başarılı</span>
                            {item.failed_rows > 0 && (
                              <span className="text-admin-error ml-2">{item.failed_rows} hatalı</span>
                            )}
                          </p>
                        </div>
                        <Badge className={statusInfo.className}>
                          {statusInfo.icon}
                          {statusInfo.label}
                        </Badge>
                        <Link to={`/admin/import`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminHistory;
