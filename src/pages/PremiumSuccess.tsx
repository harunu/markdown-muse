import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const PremiumSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-login flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-lg shadow-elevated p-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6"
          >
            <CheckCircle2 className="w-9 h-9 text-primary" />
          </motion.div>

          <h1 className="text-2xl font-semibold text-foreground mb-2">Premium Plan Aktif</h1>
          <p className="text-muted-foreground mb-8">
            Premium özellikler hesabınıza tanımlandı.
          </p>

          <Button size="lg" className="w-full" onClick={() => navigate("/dashboard")}>
            Dashboard'a Git
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumSuccess;
