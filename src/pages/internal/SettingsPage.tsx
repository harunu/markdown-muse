import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Settings2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateProfile, useUpdatePreferences, useChangePassword } from "@/hooks/useApi";
import { CITIES } from "@/lib/cityDistricts";

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const updateProfile = useUpdateProfile();
  const updatePreferences = useUpdatePreferences();
  const changePassword = useChangePassword();

  const [profile, setProfile] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [preferences, setPreferences] = useState({
    defaultCity: user?.preferences?.default_city || "mugla",
    resultsPerPage: String(user?.preferences?.results_per_page ?? 25),
    aiAutoAnalysis: user?.preferences?.ai_auto ?? true,
    emailNotifications: user?.preferences?.email_notifications ?? true,
  });

  // Sync form state once the authenticated user (and saved preferences) load
  useEffect(() => {
    if (user) {
      setProfile({ name: user.full_name || "", email: user.email || "" });
      setPreferences({
        defaultCity: user.preferences?.default_city || "mugla",
        resultsPerPage: String(user.preferences?.results_per_page ?? 25),
        aiAutoAnalysis: user.preferences?.ai_auto ?? true,
        emailNotifications: user.preferences?.email_notifications ?? true,
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!profile.name.trim()) {
      toast.error("Ad Soyad boş olamaz");
      return;
    }
    try {
      await updateProfile.mutateAsync({ full_name: profile.name.trim() });
      updateUser({ full_name: profile.name.trim() });
      toast.success("Profil güncellendi");
    } catch {
      toast.error("Profil güncellenirken bir hata oluştu");
    }
  };

  const handleSavePreferences = async () => {
    try {
      const payload = {
        default_city: preferences.defaultCity,
        results_per_page: Number(preferences.resultsPerPage),
        ai_auto: preferences.aiAutoAnalysis,
        email_notifications: preferences.emailNotifications,
      };
      await updatePreferences.mutateAsync(payload);
      updateUser({ preferences: payload });
      toast.success("Tercihler kaydedildi");
    } catch {
      toast.error("Tercihler kaydedilirken bir hata oluştu");
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current) {
      toast.error("Mevcut şifrenizi girin");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("Şifre en az 8 karakter olmalı");
      return;
    }
    try {
      await changePassword.mutateAsync({
        current_password: passwords.current,
        new_password: passwords.new,
        new_password_confirm: passwords.confirm,
      });
      toast.success("Şifre güncellendi");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch {
      toast.error("Şifre güncellenemedi. Mevcut şifrenizi kontrol edin.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold text-foreground">Ayarlar</h1>
        <p className="text-muted-foreground">Hesap ve uygulama ayarlarını yönetin</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">E-posta adresi değiştirilemez.</p>
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Input value="Emlak Danışmanı" disabled className="bg-muted" />
            </div>
            <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
              {updateProfile.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Kaydet
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Şifre Değiştir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mevcut Şifre</Label>
              <Input
                id="current-password"
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Yeni Şifre</Label>
              <Input
                id="new-password"
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Yeni Şifre (Tekrar)</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
              />
            </div>
            <Button onClick={handleChangePassword} disabled={changePassword.isPending}>
              {changePassword.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Şifreyi Güncelle
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Tercihler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Varsayılan Şehir</Label>
                <p className="text-sm text-muted-foreground">Arama için varsayılan şehir</p>
              </div>
              <Select
                value={preferences.defaultCity}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, defaultCity: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sonuç Sayısı (sayfa)</Label>
                <p className="text-sm text-muted-foreground">Sayfa başına gösterilecek sonuç</p>
              </div>
              <Select
                value={preferences.resultsPerPage}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, resultsPerPage: value }))}
              >
                <SelectTrigger className="w-40">
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

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Otomatik Analiz</Label>
                <p className="text-sm text-muted-foreground">İlanlarda otomatik AI analizi çalıştır</p>
              </div>
              <Switch
                checked={preferences.aiAutoAnalysis}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, aiAutoAnalysis: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>E-posta Bildirimleri</Label>
                <p className="text-sm text-muted-foreground">Önemli güncellemeler için e-posta al</p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>

            <Button onClick={handleSavePreferences} disabled={updatePreferences.isPending}>
              {updatePreferences.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Tercihleri Kaydet
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
