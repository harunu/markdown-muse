import { Link } from "react-router-dom";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                <span className="text-xl font-display font-bold text-gold">AI</span>
              </div>
              <span className="text-xl font-display font-semibold">Emlak</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              Yapay zeka destekli emlak danışmanınız. Hayalinizdeki evi bulmanın en akıllı yolu.
            </p>
            <div className="flex items-center gap-2 text-gold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI Powered</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Hızlı Erişim</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/arama" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">
                  İlan Ara
                </Link>
              </li>
              <li>
                <Link to="/karsilastir" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">
                  Karşılaştır
                </Link>
              </li>
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">
                  Favorilerim
                </Link>
              </li>
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">
                  AI Danışman
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Kurumsal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">
                  KVKK
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Mail className="w-4 h-4 text-gold" />
                info@aiemlak.com.tr
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Phone className="w-4 h-4 text-gold" />
                0212 555 00 00
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70 text-sm">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Levent, İstanbul Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © 2025 AI Emlak. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-primary-foreground/50 text-sm">Türkiye'nin #1 AI Emlak Platformu</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
