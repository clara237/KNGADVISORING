import { motion } from "framer-motion";
import { Target, GraduationCap, Award, Search, BarChart, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: GraduationCap,
    title: "Formations Managériales",
    desc: "Coaching individuel ou en groupe, développement du leadership, gestion des conflits et intelligence émotionnelle.",
  },
  {
    icon: Target,
    title: "Formations Courtes",
    desc: "Modules ciblés de 5 à 30 jours sur des thématiques spécifiques avec une approche pragmatique.",
  },
  {
    icon: Award,
    title: "Mise aux Normes",
    desc: "Alignement aux standards internationaux : ISO, COSO, IFACI. Accompagnement à la certification.",
  },
  {
    icon: Search,
    title: "Audit Interne Stratégique",
    desc: "Audit organisationnel, fonctionnel, de conformité et de performance avec recommandations opérationnelles.",
  },
  {
    icon: BarChart,
    title: "Suivi & Évaluation",
    desc: "Tableaux de bord de pilotage, indicateurs clés et évaluation d'impact sur la performance globale.",
  },
  {
    icon: RefreshCw,
    title: "Réajustement Continu",
    desc: "Adaptation des interventions selon les retours et les évolutions du contexte organisationnel.",
  },
];

const ApproachSection = () => {
  return (
    <section id="demarche" className="py-24 bg-gradient-navy text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium tracking-[0.2em] uppercase text-sm mb-3">Comment nous travaillons</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Notre Démarche
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative p-8 rounded-xl border border-primary-foreground/10 hover:border-accent/40 transition-colors bg-primary-foreground/5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-accent" />
                </div>
                <span className="text-accent/50 font-heading text-3xl font-bold">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold mb-3">{step.title}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;
