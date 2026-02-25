import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="KNG Advisoring" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-accent font-medium tracking-[0.3em] uppercase text-sm mb-6"
          >
            Audit · Gestion des Risques · Finance · Conseil
          </motion.p>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 leading-tight">
            KNG{" "}
            <span className="text-gradient-gold">ADVISORING</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-heading text-xl md:text-2xl text-primary-foreground/80 italic mb-4"
          >
            Gerez, Auditez, Améliorez, Excellez…
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-primary-foreground/60 text-lg max-w-2xl mx-auto mb-10"
          >
            Cabinet d'expertise spécialisé dans les sciences de gestion, 
            basé au Cameroun et actif en Afrique centrale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Nos Services
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-foreground/30 text-primary-foreground font-semibold rounded-lg hover:border-accent hover:text-accent transition-colors"
            >
              Nous Contacter
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="w-6 h-6 text-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
