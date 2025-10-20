import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/innerspark-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-secondary text-secondary-foreground py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-end items-center gap-6">
          <a href="#personal" className="hover:text-primary transition-colors">FOR INDIVIDUALS</a>
          <a href="#corporate" className="hover:text-primary transition-colors">FOR BUSINESS</a>
          <a href="#about" className="hover:text-primary transition-colors">ABOUT US</a>
          <a href="#contact" className="hover:text-primary transition-colors">CONTACT</a>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <img src={logo} alt="Innerspark Africa" className="h-10 w-10" />
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-foreground block">Innerspark Africa</span>
                <span className="text-xs text-muted-foreground">Africa's Digital Wellness Hub</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#app" className="hover:text-primary transition-colors font-medium">
                Our App
              </a>
              <a href="#services" className="hover:text-primary transition-colors font-medium">
                Services
              </a>
              <a href="#therapists" className="hover:text-primary transition-colors font-medium">
                Find a Therapist
              </a>
              <a href="#community" className="hover:text-primary transition-colors font-medium">
                Community
              </a>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
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
              <a href="#app" className="block hover:text-primary transition-colors font-medium">
                Our App
              </a>
              <a href="#services" className="block hover:text-primary transition-colors font-medium">
                Services
              </a>
              <a href="#therapists" className="block hover:text-primary transition-colors font-medium">
                Find a Therapist
              </a>
              <a href="#community" className="block hover:text-primary transition-colors font-medium">
                Community
              </a>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
