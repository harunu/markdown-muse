/**
 * TypeScript types for API integration
 * Based on 10-frontend-integration.md
 */

// API Response Envelope
export interface ApiResponse<T> {
  basarili: boolean;
  veri?: T;
  mesaj?: string;
  hata_kodu?: string;
  detaylar?: Record<string, string[]>;
}

// Paginated Response
export interface PaginatedResponse<T> {
  sonuclar: T[];
  toplam: number;
  sayfa: number;
  toplam_sayfa: number;
}

// User Preferences
export interface KullaniciTercihler {
  varsayilan_sehir: string;
  sonuc_sayisi: number;
  ai_otomatik: boolean;
  email_bildirimleri: boolean;
}

// User
export interface Kullanici {
  id: number;
  ad_soyad: string;
  email: string;
  rol: 'profesyonel' | 'yonetici' | 'super_admin';
  tercihler?: KullaniciTercihler;
}

// Auth Response
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  kullanici: Kullanici;
}

// Property (Full)
export interface Ilan {
  id: number;
  baslik: string;
  ilan_tipi: 'satilik' | 'kiralik';
  emlak_tipi: 'daire' | 'villa' | 'arsa' | 'isyeri' | 'residence';
  sehir: string;
  ilce: string;
  mahalle?: string | null;
  fiyat: number;
  para_birimi: string;
  metrekare?: number | null;
  oda_sayisi?: string | null;
  banyo_sayisi?: number | null;
  bina_yasi?: number | null;
  kat?: number | null;
  toplam_kat?: number | null;
  isitma_tipi?: string | null;
  aciklama?: string | null;
  ozellikler: string[];
  gorseller: string[];
  konum?: { enlem: number; boylam: number } | null;
  kaynak: string;
  durum: 'aktif' | 'pasif' | 'taslak' | 'silindi';
  birim_fiyat?: number | null;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

// Property Summary (used in lists)
export interface IlanOzet {
  id: number;
  baslik: string;
  ilan_tipi: 'satilik' | 'kiralik';
  emlak_tipi: string;
  sehir: string;
  ilce: string;
  fiyat: number;
  metrekare?: number | null;
  oda_sayisi?: string | null;
  bina_yasi?: number | null;
  durum: string;
  kaynak: string;
  birim_fiyat?: number | null;
  konum?: { enlem: number; boylam: number } | null;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  ai_skoru?: number;
}

// AI Analysis
export interface AiAnaliz {
  fiyat_skoru: number;
  fiyat_degerlendirme: string;
  metrekare_birim_fiyat?: number;
  bolge_ortalama_birim_fiyat?: number;
  fiyat_farki_yuzde?: number;
  avantajlar: string[];
  dezavantajlar: string[];
  tavsiye: string;
  genel_degerlendirme: string;
}

// AI Comparison
export interface AiKarsilastirma {
  ozet: string;
  en_uygun_fiyat?: {
    ilan_id: number;
    baslik: string;
    sebep: string;
  };
  en_iyi_konum?: {
    ilan_id: number;
    baslik: string;
    sebep: string;
  };
  en_iyi_deger?: {
    ilan_id: number;
    baslik: string;
    sebep: string;
  };
  karsilastirma_tablosu?: Array<{
    ilan_id: number;
    baslik: string;
    fiyat_skoru: number;
    konum_skoru: number;
    ozellik_skoru: number;
    genel_skor: number;
    one_cikan_ozellik: string;
    dikkat_edilecek: string;
  }>;
  tavsiye: string;
}

// Import Status
export interface ImportDurum {
  import_id: string;
  durum: 'dogrulaniyor' | 'onay_bekliyor' | 'isleniyor' | 'tamamlandi' | 'hatali';
  ilerleme: number;
  toplam_satir: number;
  gecerli_satir: number;
  hatali_satir: number;
  on_izleme?: Record<string, unknown>[];
  hatalar?: Array<{ satir: number; alan: string; mesaj: string }>;
}

// Dashboard Stats
export interface DashboardStats {
  toplam_ilan: number;
  bugun_arama: number;
  favori_sayisi: number;
  son_import?: {
    id: number;
    dosya_adi: string;
    durum: string;
    toplam_satir: number;
    basarili_satir: number;
    hatali_satir: number;
    tarih: string;
  } | null;
}

// Recent Search
export interface SonArama {
  id: number;
  sorgu: string;
  filtreler: Record<string, unknown>;
  sonuc_sayisi: number;
  tarih: string;
}

// Saved Search
export interface KaydedilenArama {
  id: number;
  sorgu: string;
  filtreler: Record<string, unknown>;
  sonuc_sayisi: number;
  isim: string;
  olusturma_tarihi: string;
}

// Favorite
export interface Favori {
  ilan: IlanOzet;
  not_metni: string;
  eklenme_tarihi: string;
}

// Search Request
export interface AramaIstegi {
  sorgu?: string;
  filtreler?: {
    sehir?: string;
    ilce?: string;
    tip?: string;
    islem_tipi?: string;
    min_fiyat?: number;
    max_fiyat?: number;
    min_metrekare?: number;
    max_metrekare?: number;
    oda_sayisi?: string;
  };
  siralama?: string;
  sayfa?: number;
  sayfa_boyutu?: number;
}

// Chat Message
export interface SohbetMesaj {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Chat Session
export interface SohbetOturum {
  session_id: string;
  session_tipi: 'property' | 'search' | 'comparison' | 'general';
  mesaj_sayisi: number;
  son_mesaj?: string;
  guncelleme_tarihi: string;
}

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Change Password Request
export interface SifreDegistirRequest {
  mevcut_sifre: string;
  yeni_sifre: string;
  yeni_sifre_tekrar: string;
}

// Profile Update Request
export interface ProfilGuncelle {
  ad_soyad?: string;
}

// Preferences Update Request
export interface TercihlerGuncelle {
  varsayilan_sehir?: string;
  sonuc_sayisi?: number;
  ai_otomatik?: boolean;
  email_bildirimleri?: boolean;
}
