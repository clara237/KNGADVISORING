import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-navy text-primary-foreground py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-3">
              KNG <span className="text-gradient-gold">ADVISORING</span>
            </h3>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Gerez, Auditez, Améliorez, Excellez…
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-accent">Services</h4>
            <ul className="space-y-2 text-primary-foreground/60 text-sm">
              <li>Audit & Contrôle de Gestion</li>
              <li>Comptabilité & Finance</li>
              <li>Formations & Coaching</li>
              <li>Conseil Stratégique</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-accent">Contact</h4>
            <div className="space-y-2 text-primary-foreground/60 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                656 340 105 / 656 352 089
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                h.gwet@tbs-education.org
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                Yaoundé & Douala, Cameroun
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 text-center text-primary-foreground/40 text-sm">
          © {new Date().getFullYear()} KNG ADVISORING CAMEROON. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
