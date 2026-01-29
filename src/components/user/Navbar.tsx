import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHome ? "bg-transparent" : "bg-card/95 backdrop-blur-md border-b border-border shadow-soft"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isHome 
                ? "bg-white/10 backdrop-blur-sm group-hover:bg-gold/20" 
                : "bg-primary group-hover:bg-primary/90"
            }`}>
              <span className={`text-xl font-display font-bold ${isHome ? "text-white" : "text-primary-foreground"}`}>
                AI
              </span>
            </div>
            <span className={`text-xl font-display font-semibold hidden sm:block transition-colors ${
              isHome ? "text-white" : "text-foreground"
            }`}>
              Emlak
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/arama" 
              className={`font-medium transition-colors hover:text-gold ${
                isHome ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              İlan Ara
            </Link>
            <Link 
              to="/karsilastir" 
              className={`font-medium transition-colors hover:text-gold ${
                isHome ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Karşılaştır
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant={isHome ? "glass" : "ghost"} 
              size="icon"
              className="relative"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-[10px] font-bold rounded-full flex items-center justify-center text-primary">
                3
              </span>
            </Button>
            <Button 
              variant={isHome ? "glass" : "outline"}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Giriş Yap
            </Button>
            <Link to="/admin">
              <Button variant={isHome ? "hero" : "default"}>
                Admin Panel
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant={isHome ? "glass" : "ghost"}
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card/95 backdrop-blur-md border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link 
                to="/arama" 
                className="block py-2 text-foreground hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                İlan Ara
              </Link>
              <Link 
                to="/karsilastir" 
                className="block py-2 text-foreground hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Karşılaştır
              </Link>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <User className="h-4 w-4" />
                  Giriş Yap
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-[10px] font-bold rounded-full flex items-center justify-center text-primary">
                    3
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
