import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin } from "lucide-react";
import contactHero from "@/assets/contact-hero.jpg";

const defaultTexts = {
  heroTitle: "Let's Get Doing for Tomorrow, Today",
  heroDesc: "Reach out to us for inquiries, support, or partnership opportunities. We're here to help you on your mental wellness journey.",
  chatWhatsApp: "Chat with Us on WhatsApp",
  phoneContact: "Phone Contact",
  generalInquiries: "General Inquiries",
  ourLocation: "Our Location",
  getInTouch: "Get In Touch",
  fullName: "Full Name",
  emailAddress: "Email Address",
  phoneNumber: "Phone Number",
  subject: "Subject",
  message: "Message",
  yourName: "Your name",
  emailPlaceholder: "your.email@example.com",
  phonePlaceholder: "+256 XXX XXX XXX",
  subjectPlaceholder: "How can we help you?",
  messagePlaceholder: "Tell us more about your inquiry...",
  sendMessage: "Send Message",
  sending: "Sending...",
};

const Contact = () => {
  const { toast } = useToast();
  const { language, translateBatch } = useLanguage();
  const [t, setT] = useState(defaultTexts);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (language === "en") {
      setT(defaultTexts);
      return;
    }

    const values = Object.values(defaultTexts);
    translateBatch(values).then((results) => {
      const keys = Object.keys(defaultTexts) as (keyof typeof defaultTexts)[];
      const newT = {} as typeof defaultTexts;
      keys.forEach((key, i) => {
        newT[key] = results[i];
      });
      setT(newT);
    });
  }, [language, translateBatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const mailtoLink = `mailto:info@innersparkafrica.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    )}`;

    window.location.href = mailtoLink;

    toast({
      title: "Opening your email client",
      description: "Please send the email to complete your message.",
    });

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-deep/10 to-background z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                {t.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {t.heroDesc}
              </p>
              
              <div className="mb-8">
                <a href="https://wa.me/256780570987?text=Hi,%20I%20would%20like%20to%20get%20in%20touch%20with%20Innerspark%20Africa" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full md:w-auto">
                    {t.chatWhatsApp}
                  </Button>
                </a>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.phoneContact}</h3>
                    <p className="text-muted-foreground">+256 780 570 987</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.generalInquiries}</h3>
                    <p className="text-muted-foreground">info@innersparkafrica.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.ourLocation}</h3>
                    <p className="text-muted-foreground">National ICT Innovation Hub</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img src={contactHero} alt="Contact us" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 text-foreground text-center">
                {t.getInTouch}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    {t.fullName} *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.yourName}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t.emailAddress} *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.emailPlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    {t.phoneNumber}
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t.phonePlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    {t.subject} *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t.subjectPlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    {t.message} *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t.messagePlaceholder}
                    rows={6}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t.sending : t.sendMessage}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
