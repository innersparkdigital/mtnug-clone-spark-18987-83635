import { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { language, translateBatch } = useLanguage();
  const [t, setT] = useState({
    description: "Africa's digital wellness hub — making mental health support affordable, accessible, and stigma-free.",
    quickLinks: "Quick Links",
    ourServices: "Our Services",
    specialists: "Specialists",
    aboutUs: "About Us",
    blog: "Blog",
    contactUs: "Contact Us",
    forProfessionals: "For Professionals",
    forBusiness: "For Business",
    services: "Services",
    virtualTherapy: "Virtual Therapy",
    supportGroups: "Support Groups",
    wellnessResources: "Wellness Resources",
    corporateWellness: "Corporate Wellness",
    connectWithUs: "Connect With Us",
    chatWhatsApp: "Chat on WhatsApp",
    communityText: "Join our community and stay updated on wellness tips and events.",
    allRights: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePolicy: "Cookie Policy",
  });

  useEffect(() => {
    if (language === "en") {
      setT({
        description: "Africa's digital wellness hub — making mental health support affordable, accessible, and stigma-free.",
        quickLinks: "Quick Links",
        ourServices: "Our Services",
        specialists: "Specialists",
        aboutUs: "About Us",
        blog: "Blog",
        contactUs: "Contact Us",
        forProfessionals: "For Professionals",
        forBusiness: "For Business",
        services: "Services",
        virtualTherapy: "Virtual Therapy",
        supportGroups: "Support Groups",
        wellnessResources: "Wellness Resources",
        corporateWellness: "Corporate Wellness",
        connectWithUs: "Connect With Us",
        chatWhatsApp: "Chat on WhatsApp",
        communityText: "Join our community and stay updated on wellness tips and events.",
        allRights: "All rights reserved.",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        cookiePolicy: "Cookie Policy",
      });
      return;
    }

    const texts = [
      "Africa's digital wellness hub — making mental health support affordable, accessible, and stigma-free.",
      "Quick Links",
      "Our Services",
      "Specialists",
      "About Us",
      "Blog",
      "Contact Us",
      "For Professionals",
      "For Business",
      "Services",
      "Virtual Therapy",
      "Support Groups",
      "Wellness Resources",
      "Corporate Wellness",
      "Connect With Us",
      "Chat on WhatsApp",
      "Join our community and stay updated on wellness tips and events.",
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
        virtualTherapy: results[10],
        supportGroups: results[11],
        wellnessResources: results[12],
        corporateWellness: results[13],
        connectWithUs: results[14],
        chatWhatsApp: results[15],
        communityText: results[16],
        allRights: results[17],
        privacyPolicy: results[18],
        termsOfService: results[19],
        cookiePolicy: results[20],
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
                <span className="text-muted-foreground">+256 780 570 987</span>
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
              <li><a href="#services" className="hover:text-primary transition-colors">{t.virtualTherapy}</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">{t.supportGroups}</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">{t.wellnessResources}</a></li>
              <li><a href="#corporate" className="hover:text-primary transition-colors">{t.corporateWellness}</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">{t.connectWithUs}</h4>
            <div className="mb-4">
              <a href="https://wa.me/256780570987?text=Hi,%20I%20would%20like%20to%20connect%20with%20Innerspark%20Africa" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button size="sm" className="w-full">{t.chatWhatsApp}</Button>
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
