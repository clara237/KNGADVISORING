import { motion } from "framer-motion";
import {
  Calculator, Shield, BarChart3, Scale, Users, Briefcase,
  BookOpen, Building2, TrendingUp, FileCheck
} from "lucide-react";

const services = [
  {
    icon: Calculator,
    title: "Comptabilité & Finance",
    items: ["Comptabilité Analytique & Générale", "Micro Finance & Investissements", "Fiscalité", "Budget & Contrôle Budgétaire"],
  },
  {
    icon: Shield,
    title: "Audit & Contrôle",
    items: ["Audit Interne Stratégique", "Audit de conformité", "Contrôle de Gestion", "Gestion des Risques"],
  },
  {
    icon: BarChart3,
    title: "Conseil & Stratégie",
    items: ["Conseil financier opérationnel", "Gouvernance publique & privée", "Recommandations opérationnelles", "Tableaux de bord de pilotage"],
  },
  {
    icon: BookOpen,
    title: "Formations",
    items: ["Formations managériales", "Modules ciblés 5-30 jours", "Coaching dirigeants", "Développement du leadership"],
  },
  {
    icon: Scale,
    title: "Juridique & Assurance",
    items: ["Sécurité juridique", "Droit des assurances", "Analyse des garanties", "Contrats d'assurance"],
  },
  {
    icon: Building2,
    title: "QHSE & Commercial",
    items: ["Qualité & Sécurité", "Environnement & HSE", "Marketing & Communication", "Action Commerciale"],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium tracking-[0.2em] uppercase text-sm mb-3">Ce que nous faisons</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nos Services
          </h2>
          <div className="section-divider" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              className="group relative bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-xl hover:border-accent/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-lg bg-gradient-gold flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-heading text-xl font-bold text-card-foreground mb-4">
                {service.title}
              </h3>
              <ul className="space-y-2">
                {service.items.map((itm) => (
                  <li key={itm} className="text-muted-foreground text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    {itm}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
