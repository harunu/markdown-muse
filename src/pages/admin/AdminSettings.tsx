import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Shield, Database, Mail, Globe } from "lucide-react";

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ayarlar</h2>
          <p className="text-muted-foreground">Sistem yapılandırması ve tercihler</p>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Genel Ayarlar
            </CardTitle>
            <CardDescription>Temel sistem yapılandırması</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Site Adı</Label>
                <Input id="siteName" defaultValue="AI Emlak Platformu" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input id="siteUrl" defaultValue="https://aiemlak.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adminEmail">Admin E-posta</Label>
                <Input id="adminEmail" type="email" defaultValue="admin@aiemlak.com" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Bildirim Ayarları
            </CardTitle>
            <CardDescription>E-posta ve uygulama bildirimleri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Yeni İlan Bildirimi</p>
                <p className="text-sm text-muted-foreground">Yeni ilan eklendiğinde bildirim al</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Import Tamamlandı</p>
                <p className="text-sm text-muted-foreground">CSV import işlemi bittiğinde bildirim al</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Hata Bildirimleri</p>
                <p className="text-sm text-muted-foreground">Sistem hatalarında e-posta gönder</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Haftalık Rapor</p>
                <p className="text-sm text-muted-foreground">Haftalık performans raporu gönder</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Güvenlik
            </CardTitle>
            <CardDescription>Hesap ve erişim güvenliği</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">İki Faktörlü Doğrulama</p>
                <p className="text-sm text-muted-foreground">Giriş için ek güvenlik katmanı</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Oturum Zaman Aşımı</p>
                <p className="text-sm text-muted-foreground">30 dakika hareketsizlik sonrası çıkış</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div>
              <Button variant="outline">Şifre Değiştir</Button>
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              API Ayarları
            </CardTitle>
            <CardDescription>Harici servis entegrasyonları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Anahtarı</Label>
              <div className="flex gap-2">
                <Input id="apiKey" type="password" defaultValue="sk-xxxxxxxxxxxxx" className="flex-1" />
                <Button variant="outline">Yenile</Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="webhook">Webhook URL</Label>
              <Input id="webhook" placeholder="https://..." />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg">Değişiklikleri Kaydet</Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
