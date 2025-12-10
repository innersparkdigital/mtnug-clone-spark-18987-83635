import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/innerspark-logo.png";
import AppDownloadPopup from "@/components/AppDownloadPopup";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navItems = [
  { key: "services", label: "Our Services", path: "/services" },
  { key: "specialists", label: "Specialists", path: "/specialists" },
  { key: "about", label: "About Us", path: "/about" },
  { key: "blog", label: "Blog", path: "/blog" },
  { key: "events", label: "Events & Training", path: "/events-training" },
  { key: "contact", label: "Contact Us", path: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, translateBatch } = useLanguage();
  const [translations, setTranslations] = useState({
    forProfessionals: "FOR PROFESSIONALS",
    forBusiness: "FOR BUSINESS",
    tagline: "Africa's Digital Wellness Hub",
    donateTherapy: "Donate Therapy",
    services: "Our Services",
    specialists: "Specialists",
    about: "About Us",
    blog: "Blog",
    events: "Events & Training",
    contact: "Contact Us",
  });

  useEffect(() => {
    if (language === "en") {
      setTranslations({
        forProfessionals: "FOR PROFESSIONALS",
        forBusiness: "FOR BUSINESS",
        tagline: "Africa's Digital Wellness Hub",
        donateTherapy: "Donate Therapy",
        services: "Our Services",
        specialists: "Specialists",
        about: "About Us",
        blog: "Blog",
        events: "Events & Training",
        contact: "Contact Us",
      });
      return;
    }

    const textsToTranslate = [
      "FOR PROFESSIONALS",
      "FOR BUSINESS",
      "Africa's Digital Wellness Hub",
      "Donate Therapy",
      "Our Services",
      "Specialists",
      "About Us",
      "Blog",
      "Events & Training",
      "Contact Us",
    ];

    translateBatch(textsToTranslate).then((results) => {
      setTranslations({
        forProfessionals: results[0],
        forBusiness: results[1],
        tagline: results[2],
        donateTherapy: results[3],
        services: results[4],
        specialists: results[5],
        about: results[6],
        blog: results[7],
        events: results[8],
        contact: results[9],
      });
    });
  }, [language, translateBatch]);

  const navLabels = {
    services: translations.services,
    specialists: translations.specialists,
    about: translations.about,
    blog: translations.blog,
    events: translations.events,
    contact: translations.contact,
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:block bg-secondary text-secondary-foreground py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-end items-center gap-6">
          <Link to="/for-professionals" className="hover:text-primary transition-colors">{translations.forProfessionals}</Link>
          <Link to="/for-business" className="hover:text-primary transition-colors">{translations.forBusiness}</Link>
          <LanguageSelector variant="header" />
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-primary border-b border-primary shadow-sm">
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Innerspark Africa" className="h-8 w-8 md:h-10 md:w-10" />
              <div className="hidden sm:block">
                <span className="text-base md:text-xl font-bold text-primary-foreground block">Innerspark Africa</span>
                <span className="text-xs text-primary-foreground/80">{translations.tagline}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/services" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium">
                {navLabels.services}
              </Link>
              <Link to="/specialists" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium">
                {navLabels.specialists}
              </Link>
              <Link to="/about" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium">
                {navLabels.about}
              </Link>
              <Link to="/blog" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium">
                {navLabels.blog}
              </Link>
              <Link to="/events-training" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium">
                {navLabels.events}
              </Link>
              <Link to="/contact" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium">
                {navLabels.contact}
              </Link>
              <Link to="/donate-therapy">
                <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  {translations.donateTherapy}
                </Button>
              </Link>
              <AppDownloadPopup />
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 space-y-4 border-t border-primary-foreground/20">
              <Link to="/services" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium">
                {navLabels.services}
              </Link>
              <Link to="/specialists" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium">
                {navLabels.specialists}
              </Link>
              <Link to="/about" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium">
                {navLabels.about}
              </Link>
              <Link to="/blog" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium">
                {navLabels.blog}
              </Link>
              <Link to="/events-training" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium">
                {navLabels.events}
              </Link>
              <Link to="/contact" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium">
                {navLabels.contact}
              </Link>
              <Link to="/donate-therapy">
                <Button variant="outline" className="w-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  {translations.donateTherapy}
                </Button>
              </Link>
              <div className="pt-2">
                <AppDownloadPopup />
              </div>
              <div className="pt-2">
                <LanguageSelector variant="footer" />
              </div>
            </nav>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
