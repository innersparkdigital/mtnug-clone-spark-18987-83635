import { useState } from "react";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-secondary text-secondary-foreground py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-end items-center gap-6">
          <a href="#" className="hover:text-primary transition-colors">PERSONAL</a>
          <a href="#" className="hover:text-primary transition-colors">BUSINESS</a>
          <a href="#" className="hover:text-primary transition-colors">MOBILE MONEY</a>
          <a href="#" className="hover:text-primary transition-colors">INVESTORS</a>
          <a href="#" className="hover:text-primary transition-colors">ABOUT</a>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center font-bold text-primary text-xl">
                MT
              </div>
              <span className="text-2xl font-bold hidden sm:block">MTelecom</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#about" className="hover:opacity-80 transition-opacity font-medium">
                About MTelecom
              </a>
              <a href="#wakanet" className="hover:opacity-80 transition-opacity font-medium">
                WakaNet Fibre
              </a>
              <a href="#devices" className="hover:opacity-80 transition-opacity font-medium">
                Devices and Bundles
              </a>
              <a href="#contact" className="hover:opacity-80 transition-opacity font-medium">
                Contact
              </a>
              <Button variant="ghost" size="icon" className="hover:bg-secondary/10">
                <Search className="h-5 w-5" />
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
            <nav className="md:hidden py-4 space-y-4 border-t border-secondary/20">
              <a href="#about" className="block hover:opacity-80 transition-opacity font-medium">
                About MTelecom
              </a>
              <a href="#wakanet" className="block hover:opacity-80 transition-opacity font-medium">
                WakaNet Fibre
              </a>
              <a href="#devices" className="block hover:opacity-80 transition-opacity font-medium">
                Devices and Bundles
              </a>
              <a href="#contact" className="block hover:opacity-80 transition-opacity font-medium">
                Contact
              </a>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
