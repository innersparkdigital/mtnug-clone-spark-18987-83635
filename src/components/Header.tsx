import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Stethoscope, Building2, LogIn, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/innerspark-logo.png";
import AppDownloadPopup from "@/components/AppDownloadPopup";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import PromoSlider from "@/components/PromoSlider";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { key: "services", label: "Our Services", path: "/services" },
  { key: "specialists", label: "Specialists", path: "/specialists" },
  { key: "learning", label: "Learning Hub", path: "/learning" },
  { key: "about", label: "About Us", path: "/about" },
  { key: "mindcheck", label: "Mind-Check", path: "/mind-check" },
  { key: "blog", label: "Blog", path: "/blog" },
  { key: "events", label: "Events & Training", path: "/events-training" },
  { key: "contact", label: "Contact Us", path: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, translateBatch } = useLanguage();
  const { user, signOut } = useAuth();
  const [translations, setTranslations] = useState({
    forProfessionals: "FOR PROFESSIONALS",
    forBusiness: "FOR BUSINESS",
    tagline: "Africa's Digital Wellness Hub",
    donateTherapy: "Donate Therapy",
    services: "Our Services",
    specialists: "Specialists",
    about: "About Us",
    mindcheck: "Mind-Check",
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
        mindcheck: "Mind-Check",
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
      "Mind-Check",
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
        mindcheck: results[7],
        blog: results[8],
        events: results[9],
        contact: results[10],
      });
    });
  }, [language, translateBatch]);

  const navLabels = {
    services: translations.services,
    specialists: translations.specialists,
    about: translations.about,
    mindcheck: translations.mindcheck,
    blog: translations.blog,
    events: translations.events,
    contact: translations.contact,
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Promo Slider */}
      <PromoSlider />
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:block bg-gradient-to-r from-primary/90 via-primary to-primary/90 text-primary-foreground py-1 px-4 text-xs">
        <div className="container mx-auto flex justify-end items-center gap-4">
          <Link to="/for-professionals" className="hover:text-primary-foreground/80 transition-colors">{translations.forProfessionals}</Link>
          <Link to="/for-business" className="hover:text-primary-foreground/80 transition-colors">{translations.forBusiness}</Link>
          <Link to="/donate-therapy">
            <Button size="sm" variant="secondary" className="text-[10px] px-2 py-0.5 h-5">
              {translations.donateTherapy}
            </Button>
          </Link>
          <LanguageSelector variant="header" />
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Innerspark Africa" className="h-8 w-8 md:h-10 md:w-10" />
              <div className="hidden sm:block">
                <span className="text-base md:text-xl font-bold text-foreground block">Innerspark Africa</span>
                <span className="text-xs text-muted-foreground">{translations.tagline}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/services" className="text-foreground hover:text-primary transition-colors font-medium">
                {navLabels.services}
              </Link>
              <Link to="/specialists" className="text-foreground hover:text-primary transition-colors font-medium">
                {navLabels.specialists}
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
                {navLabels.about}
              </Link>
              <Link to="/mind-check" className="text-foreground hover:text-primary transition-colors font-medium">
                {navLabels.mindcheck}
              </Link>
              <Link to="/learning" className="text-foreground hover:text-primary transition-colors font-medium">
                Learning Hub
              </Link>
              <Link to="/blog" className="text-foreground hover:text-primary transition-colors font-medium">
                {navLabels.blog}
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
                {navLabels.contact}
              </Link>
              
              {/* User Menu - Only show if logged in */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      <span className="max-w-20 truncate">{user.email?.split('@')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/learning/student-dashboard" className="cursor-pointer">
                        My Learning
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <AppDownloadPopup />
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 space-y-4 border-t border-border">
              <Link to="/for-professionals" className="flex items-center gap-2 text-primary font-semibold">
                <Stethoscope className="w-4 h-4" />
                {translations.forProfessionals}
              </Link>
              <Link to="/for-business" className="flex items-center gap-2 text-primary font-semibold">
                <Building2 className="w-4 h-4" />
                {translations.forBusiness}
              </Link>
              <div className="border-t border-border pt-4">
                <Link to="/services" className="block text-foreground hover:text-primary transition-colors font-medium">
                  {navLabels.services}
                </Link>
              </div>
              <Link to="/specialists" className="block text-foreground hover:text-primary transition-colors font-medium">
                {navLabels.specialists}
              </Link>
              <Link to="/about" className="block text-foreground hover:text-primary transition-colors font-medium">
                {navLabels.about}
              </Link>
              <Link to="/mind-check" className="block text-foreground hover:text-primary transition-colors font-medium">
                {navLabels.mindcheck}
              </Link>
              <Link to="/learning" className="block text-foreground hover:text-primary transition-colors font-medium">
                Learning Hub
              </Link>
              <Link to="/blog" className="block text-foreground hover:text-primary transition-colors font-medium">
                {navLabels.blog}
              </Link>
              {/* <Link to="/events-training" className="block text-foreground hover:text-primary transition-colors font-medium">
                {navLabels.events}
              </Link> */}
              <Link to="/contact" className="block text-foreground hover:text-primary transition-colors font-medium">
                {navLabels.contact}
              </Link>
              
              {/* Mobile Auth - Only show user menu if logged in */}
              {user && (
                <div className="space-y-2 border-t border-border pt-4">
                  <Link to="/learning/student-dashboard" className="block text-foreground hover:text-primary transition-colors font-medium">
                    My Learning
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
              
              <Link to="/donate-therapy">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
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
