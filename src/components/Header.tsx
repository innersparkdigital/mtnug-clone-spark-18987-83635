import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/innerspark-logo.png";
import AppDownloadPopup from "@/components/AppDownloadPopup";
import { LanguageSelector } from "@/components/LanguageSelector";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:block bg-secondary text-secondary-foreground py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-end items-center gap-6">
          <Link to="/for-professionals" className="hover:text-primary transition-colors">FOR PROFESSIONALS</Link>
          <Link to="/for-business" className="hover:text-primary transition-colors">FOR BUSINESS</Link>
          <LanguageSelector variant="header" />
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Innerspark Africa" className="h-8 w-8 md:h-10 md:w-10" />
              <div className="hidden sm:block">
                <span className="text-base md:text-xl font-bold text-foreground block">Innerspark Africa</span>
                <span className="text-xs text-muted-foreground">Africa's Digital Wellness Hub</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/services" className="hover:text-primary transition-colors font-medium">
                Services
              </Link>
              <Link to="/specialists" className="hover:text-primary transition-colors font-medium">
                Specialists
              </Link>
              <Link to="/about" className="hover:text-primary transition-colors font-medium">
                About
              </Link>
              <Link to="/blog" className="hover:text-primary transition-colors font-medium">
                Blog
              </Link>
              <Link to="/events-training" className="hover:text-primary transition-colors font-medium">
                Events & Training
              </Link>
              <Link to="/contact" className="hover:text-primary transition-colors font-medium">
                Contact
              </Link>
              <Link to="/donate-therapy">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Donate Therapy
                </Button>
              </Link>
              <AppDownloadPopup />
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 space-y-4 border-t border-border">
              <Link to="/services" className="block hover:text-primary transition-colors font-medium">
                Services
              </Link>
              <Link to="/specialists" className="block hover:text-primary transition-colors font-medium">
                Specialists
              </Link>
              <Link to="/about" className="block hover:text-primary transition-colors font-medium">
                About
              </Link>
              <Link to="/blog" className="block hover:text-primary transition-colors font-medium">
                Blog
              </Link>
              <Link to="/events-training" className="block hover:text-primary transition-colors font-medium">
                Events & Training
              </Link>
              <Link to="/contact" className="block hover:text-primary transition-colors font-medium">
                Contact
              </Link>
              <Link to="/donate-therapy">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Donate Therapy
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
    </>
  );
};

export default Header;
