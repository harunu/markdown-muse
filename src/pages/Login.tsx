import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Home, Eye, EyeOff, Loader2, Check, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";

const Login = () => {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPlans, setShowPlans] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Lütfen e-posta ve şifre giriniz.");
      return;
    }

    setIsLoading(true);

    try {
      const user = await login({ email, password }, rememberMe);
      // Redirect admins to admin panel, others to dashboard
      if (user.rol === 'super_admin' || user.rol === 'yonetici') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse<unknown>>;
      const errorMessage = axiosError.response?.data?.mesaj || "Giriş başarısız. Lütfen tekrar deneyin.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-login flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-lg shadow-elevated p-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-xl mb-4">
              <Home className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">AI Emlak Asistanı</h1>
            <p className="text-muted-foreground mt-1">İç Kullanım</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@sirket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={error ? "border-destructive focus-visible:ring-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={`pr-10 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Beni hatırla
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Şifremi unuttum
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">veya</span></div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => { demoLogin('profesyonel'); navigate('/dashboard'); }}
              >
                Demo Kullanıcı
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => { demoLogin('yonetici'); navigate('/admin'); }}
              >
                Demo Admin
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Hesabın yok mu?{" "}
              <button
                type="button"
                onClick={() => setShowPlans(true)}
                className="text-primary hover:underline font-medium"
              >
                Planları Gör
              </button>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2025 AI Emlak Asistanı - İç Kullanım
        </p>
      </motion.div>

      {/* Plans Modal */}
      <Dialog open={showPlans} onOpenChange={setShowPlans}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-semibold text-center">Planını Seç</DialogTitle>
            <p className="text-sm text-muted-foreground text-center">İhtiyacına uygun planla başla</p>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-4 p-6 pt-4">
            {/* Free Plan */}
            <div className="border border-border rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Keşfet</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">Ücretsiz</p>
              <p className="text-sm text-muted-foreground mb-4">Ürünü keşfetmek için demo erişim</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {["Demo ilanları görüntüleme", "Örnek analiz çıktısı görme", "Dashboard deneyimi"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowPlans(false);
                  demoLogin('profesyonel');
                  navigate('/dashboard');
                }}
              >
                Ücretsiz Başla
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-primary rounded-xl p-5 flex flex-col relative bg-primary/[0.03]">
              <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-0.5 rounded-full">
                Önerilen
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Profesyonel</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">Premium</p>
              <p className="text-sm text-muted-foreground mb-4">Gerçek analiz ve tam erişim</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {["Sınırsız AI analiz", "CSV import", "Semantik arama", "İlan karşılaştırma", "Excel export"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => { setShowPlans(false); navigate('/premium/checkout'); }}>
                Premium'a Geç
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
