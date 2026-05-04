import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft, MapPin, Home, Tag, Building2 } from "lucide-react";
import { useCreateProperty } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { CITIES, getDistricts } from "@/lib/cityDistricts";

const FEATURE_OPTIONS = [
  { value: "balkon", label: "Balkon" },
  { value: "asansör", label: "Asansör" },
  { value: "otopark", label: "Otopark" },
  { value: "havuz", label: "Havuz" },
  { value: "bahçe", label: "Bahçe" },
  { value: "güvenlik", label: "Güvenlik" },
  { value: "ebeveyn_banyo", label: "Ebeveyn Banyosu" },
  { value: "jakuzi", label: "Jakuzi" },
  { value: "klima", label: "Klima" },
  { value: "depolar", label: "Depo" },
];

const HEATING_OPTIONS = [
  { value: "central", label: "Merkezi" },
  { value: "individual", label: "Bireysel Kombi" },
  { value: "underfloor", label: "Yerden Isıtma" },
  { value: "stove", label: "Soba" },
  { value: "ac", label: "Klima" },
  { value: "none", label: "Yok" },
];

const formatPrice = (value: string) => {
  const num = Number(value);
  if (!value || isNaN(num) || num <= 0) return null;
  if (num >= 1_000_000) return `₺${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `₺${(num / 1_000).toFixed(0)}K`;
  return `₺${num.toLocaleString("tr-TR")}`;
};

const LISTING_TYPE_LABELS: Record<string, string> = {
  sale: "Satılık",
  rent: "Kiralık",
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: "Daire",
  villa: "Villa",
  land: "Arsa",
  commercial: "İşyeri",
  residence: "Residence",
};

const NewListingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createMutation = useCreateProperty();

  const [form, setForm] = useState({
    title: "",
    listing_type: "sale",
    property_type: "apartment",
    city: "",
    district: "",
    neighborhood: "",
    price: "",
    area: "",
    room_count: "",
    building_age: "",
    floor: "",
    total_floors: "",
    heating: "",
    description: "",
    features: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      // Reset district when city changes
      if (key === "city") updated.district = "";
      return updated;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleFeature = (value: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(value)
        ? prev.features.filter((f) => f !== value)
        : [...prev.features, value],
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title || form.title.trim().length < 5)
      e.title = "Başlık en az 5 karakter olmalıdır.";
    if (!form.city) e.city = "Şehir seçiniz.";
    if (!form.district) e.district = "İlçe seçiniz.";
    if (!form.price || Number(form.price) <= 0)
      e.price = "Geçerli bir fiyat giriniz.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (status: "active" | "draft") => {
    if (!validate()) return;
    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      listing_type: form.listing_type,
      property_type: form.property_type,
      city: form.city,
      district: form.district,
      status,
    };
    if (form.neighborhood) payload.neighborhood = form.neighborhood;
    payload.price = Number(form.price);
    if (form.area) payload.area = Number(form.area);
    if (form.room_count) payload.room_count = form.room_count;
    if (form.building_age) payload.building_age = Number(form.building_age);
    if (form.floor) payload.floor = Number(form.floor);
    if (form.total_floors) payload.total_floors = Number(form.total_floors);
    if (form.heating) payload.heating = form.heating;
    if (form.description) payload.description = form.description;
    if (form.features.length > 0) payload.features = form.features;

    try {
      await createMutation.mutateAsync(payload);
      toast({ title: status === "draft" ? "Taslak kaydedildi." : "İlan yayınlandı." });
      navigate("/admin/listings");
    } catch {
      toast({ title: "İlan oluşturulamadı.", variant: "destructive" });
    }
  };

  const districts = form.city ? getDistricts(form.city) : [];
  const priceFormatted = formatPrice(form.price);
  const selectedCity = CITIES.find((c) => c.value === form.city);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Top bar */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground mb-4"
          onClick={() => navigate("/admin/listings")}
        >
          <ArrowLeft className="w-4 h-4" />
          İlan Listesine Dön
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Yeni İlan Oluştur</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Aşağıdaki alanları doldurarak yeni bir ilan ekleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column — form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Temel Bilgiler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="w-4 h-4 text-admin-blue" />
                Temel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Listing type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  İlan Türü <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  {(["sale", "rent"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setField("listing_type", type)}
                      className={`px-5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        form.listing_type === type
                          ? "bg-admin-blue text-white border-admin-blue"
                          : "bg-card text-muted-foreground border-border hover:border-admin-blue/50"
                      }`}
                    >
                      {LISTING_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mülk Türü <span className="text-destructive">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["apartment", "villa", "land", "commercial", "residence"] as const).map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setField("property_type", type)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          form.property_type === type
                            ? "bg-admin-blue text-white border-admin-blue"
                            : "bg-card text-muted-foreground border-border hover:border-admin-blue/50"
                        }`}
                      >
                        {PROPERTY_TYPE_LABELS[type]}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Başlık <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Örn. Deniz Manzaralı 3+1 Daire"
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-destructive text-xs mt-1">{errors.title}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Konum */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="w-4 h-4 text-admin-blue" />
                Konum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Şehir <span className="text-destructive">*</span>
                  </label>
                  <select
                    className={`w-full h-10 px-3 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-admin-blue/30 ${
                      errors.city ? "border-destructive" : "border-border"
                    }`}
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                  >
                    <option value="">Şehir seçin</option>
                    {CITIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-destructive text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    İlçe <span className="text-destructive">*</span>
                  </label>
                  <select
                    className={`w-full h-10 px-3 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-admin-blue/30 ${
                      errors.district ? "border-destructive" : "border-border"
                    } disabled:opacity-50`}
                    value={form.district}
                    onChange={(e) => setField("district", e.target.value)}
                    disabled={!form.city}
                  >
                    <option value="">İlçe seçin</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-destructive text-xs mt-1">{errors.district}</p>
                  )}
                </div>
              </div>

              {/* Neighborhood */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mahalle <span className="text-muted-foreground text-xs">(opsiyonel)</span>
                </label>
                <Input
                  placeholder="Mahalle adı"
                  value={form.neighborhood}
                  onChange={(e) => setField("neighborhood", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Fiyat & Alan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="w-4 h-4 text-admin-blue" />
                Fiyat & Alan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Fiyat <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                      ₺
                    </span>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={form.price}
                      onChange={(e) => setField("price", e.target.value)}
                      className={`pl-7 ${errors.price ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-destructive text-xs mt-1">{errors.price}</p>
                  )}
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Alan <span className="text-muted-foreground text-xs">(opsiyonel)</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={form.area}
                      onChange={(e) => setField("area", e.target.value)}
                      className="pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                      m²
                    </span>
                  </div>
                </div>

                {/* Room count */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Oda Sayısı <span className="text-muted-foreground text-xs">(opsiyonel)</span>
                  </label>
                  <Input
                    placeholder="Örn. 2+1, 3+1, stüdyo"
                    value={form.room_count}
                    onChange={(e) => setField("room_count", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Yapı Detayları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="w-4 h-4 text-admin-blue" />
                Yapı Detayları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bina Yaşı (yıl)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={form.building_age}
                    onChange={(e) => setField("building_age", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Kat</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.floor}
                    onChange={(e) => setField("floor", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Toplam Kat
                  </label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="0"
                    value={form.total_floors}
                    onChange={(e) => setField("total_floors", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Isıtma
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-admin-blue/30"
                    value={form.heating}
                    onChange={(e) => setField("heating", e.target.value)}
                  >
                    <option value="">Seçin</option>
                    {HEATING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Açıklama & Özellikler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Home className="w-4 h-4 text-admin-blue" />
                Açıklama & Özellikler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Açıklama <span className="text-muted-foreground text-xs">(opsiyonel)</span>
                </label>
                <Textarea
                  rows={4}
                  placeholder="İlan hakkında detaylı açıklama..."
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Özellikler <span className="text-muted-foreground text-xs">(opsiyonel)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {FEATURE_OPTIONS.map((feat) => (
                    <label
                      key={feat.value}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <Checkbox
                        checked={form.features.includes(feat.value)}
                        onCheckedChange={() => toggleFeature(feat.value)}
                      />
                      <span className="text-sm text-foreground">{feat.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column — sticky summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="border-admin-blue/20 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-foreground">Özet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title preview */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Başlık
                  </p>
                  <p className="text-sm font-medium text-foreground line-clamp-2">
                    {form.title.trim() || (
                      <span className="text-muted-foreground italic">Başlık girilmedi</span>
                    )}
                  </p>
                </div>

                {/* Location preview */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Konum
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedCity && form.district
                      ? `${form.district}, ${selectedCity.label}`
                      : selectedCity
                      ? selectedCity.label
                      : <span className="text-muted-foreground italic">Konum seçilmedi</span>}
                  </p>
                </div>

                {/* Price preview */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Fiyat
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {priceFormatted ?? (
                      <span className="text-muted-foreground italic font-normal">
                        Fiyat girilmedi
                      </span>
                    )}
                  </p>
                </div>

                {/* Type badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-admin-blue/10 text-admin-blue">
                    {LISTING_TYPE_LABELS[form.listing_type]}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    {PROPERTY_TYPE_LABELS[form.property_type]}
                  </span>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <Button
                    className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleSubmit("active")}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    Yayınla
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full gap-2"
                    onClick={() => handleSubmit("draft")}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    Taslak Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewListingPage;
