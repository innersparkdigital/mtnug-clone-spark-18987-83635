import { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { language, translateBatch } = useLanguage();
  const [t, setT] = useState({
    description: "Online therapy and mental health support — making professional care affordable, accessible, and stigma-free globally.",
    quickLinks: "Quick Links",
    ourServices: "Our Services",
    specialists: "Find a Therapist",
    aboutUs: "About Us",
    blog: "Blog",
    contactUs: "Contact Us",
    forProfessionals: "For Professionals",
    forBusiness: "For Business",
    services: "Therapy Services",
    onlineTherapy: "Online Therapy",
    bookTherapist: "Book a Therapist",
    videoTherapy: "Video Therapy",
    chatTherapy: "Chat Therapy",
    supportGroups: "Support Groups",
    connectWithUs: "Connect With Us",
    chatWhatsApp: "Chat on WhatsApp",
    callUs: "Call Us",
    communityText: "Join our community. Get support when you need it most.",
    allRights: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePolicy: "Cookie Policy",
  });

  useEffect(() => {
    if (language === "en") {
      setT({
        description: "Online therapy and mental health support — making professional care affordable, accessible, and stigma-free globally.",
        quickLinks: "Quick Links",
        ourServices: "Our Services",
        specialists: "Find a Therapist",
        aboutUs: "About Us",
        blog: "Blog",
        contactUs: "Contact Us",
        forProfessionals: "For Professionals",
        forBusiness: "For Business",
        services: "Therapy Services",
        onlineTherapy: "Online Therapy",
        bookTherapist: "Book a Therapist",
        videoTherapy: "Video Therapy",
        chatTherapy: "Chat Therapy",
        supportGroups: "Support Groups",
        connectWithUs: "Connect With Us",
        chatWhatsApp: "Chat on WhatsApp",
        callUs: "Call Us",
        communityText: "Join our community. Get support when you need it most.",
        allRights: "All rights reserved.",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        cookiePolicy: "Cookie Policy",
      });
      return;
    }

    const texts = [
      "Online therapy and mental health support — making professional care affordable, accessible, and stigma-free globally.",
      "Quick Links",
      "Our Services",
      "Find a Therapist",
      "About Us",
      "Blog",
      "Contact Us",
      "For Professionals",
      "For Business",
      "Therapy Services",
      "Online Therapy",
      "Book a Therapist",
      "Video Therapy",
      "Chat Therapy",
      "Support Groups",
      "Connect With Us",
      "Chat on WhatsApp",
      "Call Us",
      "Join our community. Get support when you need it most.",
      "All rights reserved.",
      "Privacy Policy",
      "Terms of Service",
      "Cookie Policy",
    ];

    translateBatch(texts).then((results) => {
      setT({
        description: results[0],
        quickLinks: results[1],
        ourServices: results[2],
        specialists: results[3],
        aboutUs: results[4],
        blog: results[5],
        contactUs: results[6],
        forProfessionals: results[7],
        forBusiness: results[8],
        services: results[9],
        onlineTherapy: results[10],
        bookTherapist: results[11],
        videoTherapy: results[12],
        chatTherapy: results[13],
        supportGroups: results[14],
        connectWithUs: results[15],
        chatWhatsApp: results[16],
        callUs: results[17],
        communityText: results[18],
        allRights: results[19],
        privacyPolicy: results[20],
        termsOfService: results[21],
        cookiePolicy: results[22],
      });
    });
  }, [language, translateBatch]);

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Innerspark Africa</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t.description}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">National ICT Innovation Hub, Kampala, Uganda</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">+256 792 085 773</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">info@innersparkafrica.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-primary transition-colors">{t.ourServices}</Link></li>
              <li><Link to="/specialists" className="hover:text-primary transition-colors">{t.specialists}</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">{t.aboutUs}</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">{t.blog}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t.contactUs}</Link></li>
              <li><Link to="/for-professionals" className="hover:text-primary transition-colors">{t.forProfessionals}</Link></li>
              <li><Link to="/for-business" className="hover:text-primary transition-colors">{t.forBusiness}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">{t.services}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/online-therapy" className="hover:text-primary transition-colors">{t.onlineTherapy}</Link></li>
              <li><Link to="/book-therapist" className="hover:text-primary transition-colors">{t.bookTherapist}</Link></li>
              <li><Link to="/video-therapy" className="hover:text-primary transition-colors">{t.videoTherapy}</Link></li>
              <li><Link to="/chat-therapy" className="hover:text-primary transition-colors">{t.chatTherapy}</Link></li>
              <li><Link to="/support-groups" className="hover:text-primary transition-colors">{t.supportGroups}</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">{t.connectWithUs}</h4>
            <div className="flex gap-2 mb-4">
              <a href="https://wa.me/256792085773?text=Hi,%20I%20would%20like%20to%20connect%20with%20Innerspark%20Africa" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="sm" className="w-full">{t.chatWhatsApp}</Button>
              </a>
              <a href="tel:+256792085773" className="flex-1">
                <Button size="sm" variant="outline" className="w-full gap-1">
                  <PhoneCall className="w-3 h-3" />
                  {t.callUs}
                </Button>
              </a>
            </div>
            <div className="flex gap-4 mb-4">
              <a href="https://www.facebook.com/innersparkrecover" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Facebook className="w-5 h-5 text-primary-foreground" />
              </a>
              <a href="https://x.com/innersparkrcv" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Twitter className="w-5 h-5 text-primary-foreground" />
              </a>
              <a href="https://www.linkedin.com/in/inner-spark-581014326/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Linkedin className="w-5 h-5 text-primary-foreground" />
              </a>
              <a href="https://instagram.com/innersparkrecover" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Instagram className="w-5 h-5 text-primary-foreground" />
              </a>
              <a href="https://www.youtube.com/@INNERSPARK36" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Youtube className="w-5 h-5 text-primary-foreground" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.communityText}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 Innerspark Africa. {t.allRights}</p>
          <div className="flex items-center gap-6">
            <LanguageSelector variant="footer" />
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">{t.privacyPolicy}</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">{t.termsOfService}</Link>
            <Link to="/cookie-policy" className="hover:text-primary transition-colors">{t.cookiePolicy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
