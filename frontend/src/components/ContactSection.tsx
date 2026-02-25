import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { submitContactForm, type ContactFormData } from "@/lib/api";

const contactSchema = z.object({
  nom: z.string().min(2).max(200),
  email: z.string().email(),
  sujet: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message?: string;
  }>({ type: null });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nom: "",
      email: "",
      sujet: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitStatus({ type: null });
    form.clearErrors();

    const data: ContactFormData = {
      nom: values.nom.trim(),
      email: values.email.trim(),
      sujet: values.sujet.trim(),
      message: values.message.trim(),
    };

    try {
      const result = await submitContactForm(data);

      if (result.success) {
        setSubmitStatus({ type: "success", message: result.message });
        form.reset();
        return;
      }

      if (result.errors && typeof result.errors === "object") {
        Object.entries(result.errors).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages[0] : String(messages);
          if (field === "non_field_errors" || field === "detail") {
            setSubmitStatus({ type: "error", message: msg });
          } else {
            form.setError(field as keyof ContactFormValues, { type: "server", message: msg });
          }
        });
        return;
      }

      if (result.message) {
        setSubmitStatus({ type: "error", message: result.message });
        return;
      }

      if ("detail" in result) {
        setSubmitStatus({ type: "error", message: (result as any).detail });
        return;
      }

      setSubmitStatus({ type: "error", message: "Une erreur est survenue. Veuillez réessayer." });
    } catch (err) {
      console.error("Erreur lors de l'envoi du formulaire:", err);
      setSubmitStatus({
        type: "error",
        message: "Impossible de joindre le serveur. Vérifiez votre connexion.",
      });
    }
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium tracking-[0.2em] uppercase text-sm mb-3">
            Parlons de votre projet
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Contactez-nous
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                KNG ADVISORING CAMEROON
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Cabinet d'expertise spécialisé dans les sciences de gestion, créé en 2024.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { icon: MapPin, label: "Siège Social", value: "Avenue Biyem Assi – Yaoundé\nDouala – Akwa face Boulangerie" },
                { icon: MapPin, label: "Bureau Douala", value: "MAKEPE (PARCOURS VITA)" },
                { icon: Phone, label: "Téléphone", value: "656 340 105 / 656 352 089" },
                { icon: Mail, label: "Email", value: "h.gwet@tbs-education.org" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{item.label}</p>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-gradient-navy text-primary-foreground">
              <p className="text-sm text-primary-foreground/70 mb-1">N° Contribuable</p>
              <p className="font-mono font-semibold text-accent">M012517529347E</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-card rounded-xl p-8 shadow-sm border border-border space-y-5"
              >
                {submitStatus.type === "success" && submitStatus.message && (
                  <div className="p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
                    {submitStatus.message}
                  </div>
                )}
                {submitStatus.type === "error" && submitStatus.message && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {submitStatus.message}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="votre@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sujet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sujet</FormLabel>
                      <FormControl>
                        <Input placeholder="Objet de votre demande" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Décrivez votre besoin..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full py-3.5 bg-gradient-gold font-semibold rounded-lg" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Envoi en cours..." : "Envoyer le Message"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;