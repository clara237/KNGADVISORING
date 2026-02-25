import { motion } from "framer-motion";
import { Building, Leaf, HeartPulse, GraduationCap, Wrench } from "lucide-react";

const references = [
  {
    icon: Wrench,
    client: "Laboratoire GEOLAB",
    desc: "Accompagnement sur les questions économiques et financières : budget, fiscalité, comptabilité.",
  },
  {
    icon: Leaf,
    client: "Entreprise GPT (Agro-alimentaire)",
    desc: "Accompagnement économique et financier complet incluant budget, fiscalité et tenue comptable.",
  },
  {
    icon: HeartPulse,
    client: "Fondation Médicale Ad Lucem",
    desc: "Accompagnement financier et mise en place des outils d'audit interne et contrôle de gestion.",
  },
  {
    icon: Building,
    client: "AER (Agence Énergie Rurale)",
    desc: "Formation du personnel sur la planification budgétaire et performances stratégiques.",
  },
  {
    icon: Building,
    client: "SIC (Société Immobilière)",
    desc: "Formation sur l'audit interne et le contrôle de gestion. Mise en place d'outils d'audit.",
  },
];

const ReferencesSection = () => {
  return (
    <section id="references" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium tracking-[0.2em] uppercase text-sm mb-3">Ils nous font confiance</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nos Références
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {references.map((ref, i) => (
            <motion.div
              key={ref.client}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-4">
                <ref.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-bold text-card-foreground mb-2">{ref.client}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{ref.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReferencesSection;
