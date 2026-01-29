import { motion } from "framer-motion";
import { MessageSquare, Brain, Scale } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Doğal Dil Arama",
    description: "Düz Türkçe ile arayın. 'Deniz manzaralı 3+1 ev arıyorum' deyin, gerisini AI halleder.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Brain,
    title: "Akıllı Analiz",
    description: "Her ilan AI tarafından değerlendirilir. Fiyat analizi, bölge karşılaştırması ve yatırım potansiyeli.",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
  {
    icon: Scale,
    title: "Karar Desteği",
    description: "Artılar, eksiler ve öneriler. AI danışmanınız her adımda yanınızda.",
    gradient: "from-gold/20 to-amber-500/20",
    iconColor: "text-gold",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Neden AI Emlak?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Geleneksel emlak aramayı unutun. Yapay zeka ile yeni bir deneyim keşfedin.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-card border border-border shadow-soft transition-all duration-300 group-hover:shadow-elevated group-hover:-translate-y-1 h-full">
                {/* Gradient Background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-display font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
