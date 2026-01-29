import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

const AdminImport = () => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">CSV Import</h2>
          <p className="text-muted-foreground">Emlak verilerini CSV dosyasından içe aktarın</p>
        </div>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Dosya Yükle</CardTitle>
            <CardDescription>CSV dosyanızı sürükleyip bırakın veya seçin</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? "border-admin-blue bg-admin-blue/5"
                  : "border-border hover:border-admin-blue/50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground mb-2">
                CSV dosyanızı buraya sürükleyin
              </p>
              <p className="text-sm text-muted-foreground mb-4">veya</p>
              <Button>Dosya Seç</Button>
            </div>
          </CardContent>
        </Card>

        {/* Format Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              CSV Format Bilgisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                CSV dosyanız aşağıdaki sütunları içermelidir:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["title", "price", "location", "bedrooms", "bathrooms", "area", "type", "status"].map(
                  (field) => (
                    <div
                      key={field}
                      className="px-3 py-2 bg-muted rounded-lg text-sm font-mono text-foreground"
                    >
                      {field}
                    </div>
                  )
                )}
              </div>
              <div className="flex gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-admin-success">
                  <CheckCircle2 className="w-4 h-4" />
                  UTF-8 encoding desteklenir
                </div>
                <div className="flex items-center gap-2 text-sm text-admin-warning">
                  <AlertCircle className="w-4 h-4" />
                  Maksimum 10.000 satır
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminImport;
