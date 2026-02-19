import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Crown, CreditCard, Lock, Loader2 } from "lucide-react";

const FEATURES = [
  "Sınırsız AI analiz",
  "CSV import",
  "Semantik arama",
  "İlan karşılaştırma",
  "Excel export",
];

const PremiumCheckout = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    taxNo: "",
    billingEmail: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms || !form.fullName || !form.billingEmail) return;

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    navigate("/premium/aktif");
  };

  return (
    <div className="min-h-screen gradient-login flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl"
      >
        {/* Back Link */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Planlara Dön
        </button>

        <div className="bg-card rounded-lg shadow-elevated overflow-hidden">
          {/* Header */}
          <div className="border-b border-border px-8 py-5">
            <h1 className="text-xl font-semibold text-foreground">Premium Plan Aktivasyonu</h1>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Left: Plan Summary */}
            <div className="md:col-span-2 p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground text-lg">Premium Plan</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Profesyonel kullanım için tam erişim
              </p>

              <ul className="space-y-3 mb-6 flex-1">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="border-t border-border pt-5 mt-auto">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">1.999₺</span>
                  <span className="text-sm text-muted-foreground">/ Aylık</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  İptal istediğiniz zaman mümkündür.
                </p>
              </div>
            </div>

            {/* Right: Billing Form */}
            <div className="md:col-span-3 p-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input
                  id="fullName"
                  placeholder="Adınız Soyadınız"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">
                    Şirket Adı <span className="text-muted-foreground font-normal">(opsiyonel)</span>
                  </Label>
                  <Input
                    id="company"
                    placeholder="Şirket adı"
                    value={form.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxNo">
                    Vergi No <span className="text-muted-foreground font-normal">(opsiyonel)</span>
                  </Label>
                  <Input
                    id="taxNo"
                    placeholder="Vergi numarası"
                    value={form.taxNo}
                    onChange={(e) => handleChange("taxNo", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingEmail">Fatura E-posta</Label>
                <Input
                  id="billingEmail"
                  type="email"
                  placeholder="fatura@sirket.com"
                  value={form.billingEmail}
                  onChange={(e) => handleChange("billingEmail", e.target.value)}
                  required
                />
              </div>

              {/* Stripe Card Placeholder */}
              <div className="space-y-2">
                <Label>Kart Bilgileri</Label>
                <div className="border border-border rounded-md p-4 bg-muted/30">
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-medium">Kart bilgileri</span>
                  </div>
                  <div className="space-y-3">
                    <Input placeholder="1234 5678 9012 3456" disabled className="bg-background" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="AA / YY" disabled className="bg-background" />
                      <Input placeholder="CVC" disabled className="bg-background" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Stripe entegrasyonu bağlandığında aktif olacaktır.
                  </p>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-snug">
                  Hizmet sözleşmesini kabul ediyorum.
                </Label>
              </div>

              {/* CTA */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!acceptTerms || !form.fullName || !form.billingEmail || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  "Ödemeyi Tamamla ve Premium'u Aktif Et"
                )}
              </Button>

              {/* Trust Indicator */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5" />
                Ödemeler Stripe altyapısı ile güvenle işlenir.
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumCheckout;
