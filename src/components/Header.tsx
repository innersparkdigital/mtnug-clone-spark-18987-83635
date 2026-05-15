import { useState } from "react";
import { Menu, X, User, LogOut, Phone, MessageCircle, Shield, ChevronDown, ChevronRight, Heart, Users, Brain, GraduationCap, Building2, Stethoscope, FileText, Smartphone, MessagesSquare, ClipboardCheck, BookOpen, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/innerspark-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MegaItem = { label: string; description: string; to: string; icon: React.ComponentType<{ className?: string }> };

const individualsItems: MegaItem[] = [
  { label: "Our Services", description: "Therapy, screening, support groups & more", to: "/services", icon: Heart },
  { label: "Find a Therapist", description: "Browse licensed African therapists", to: "/specialists", icon: Users },
  { label: "Mind-Check", description: "Free mental health screening tools", to: "/mind-check", icon: Brain },
  { label: "Support Groups", description: "Moderated peer-led group sessions", to: "/support-groups", icon: MessagesSquare },
  { label: "Blog", description: "Articles, guides & lived experience", to: "/blog", icon: FileText },
  { label: "Get the App", description: "Wellness in your pocket — Android & iOS", to: "/app-coming-soon", icon: Smartphone },
];

const businessItems: MegaItem[] = [
  { label: "Corporate Wellness", description: "EAP & employee mental health plans", to: "/for-business", icon: Building2 },
  { label: "S.P.A.R.K Training", description: "In-person & virtual workplace training", to: "/events-training/trainings", icon: GraduationCap },
  { label: "Employee Screening", description: "Confidential corporate wellbeing checks", to: "/corporate-wellbeing-check", icon: ClipboardCheck },
  { label: "Learning Hub", description: "Self-paced workplace mental health courses", to: "/learning", icon: BookOpen },
  { label: "Request Proposal", description: "Custom plan for your organisation", to: "/contact?type=corporate", icon: FileText },
];

const professionalsItems: MegaItem[] = [
  { label: "Join Our Network", description: "Apply to become an InnerSpark therapist", to: "/for-professionals", icon: Stethoscope },
  { label: "Refer a Patient", description: "Send a secure clinical referral", to: "/for-professionals/refer", icon: HandHeart },
];

function MegaPanel({ items }: { items: MegaItem[] }) {
  return (
    <div className="grid w-[560px] grid-cols-2 gap-2 p-4 bg-background">
      {items.map((it) => (
        <Link
          key={it.to}
          to={it.to}
          className="group flex items-start gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
        >
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent group-hover:bg-primary/10">
            <it.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground">{it.label}</div>
            <p className="text-xs text-muted-foreground leading-snug">{it.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function MobileMegaSection({ title, items, onNavigate }: { title: string; items: MegaItem[]; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-left font-semibold text-foreground"
      >
        <span>{title}</span>
        <ChevronRight className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="pb-3 space-y-1">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent"
            >
              <it.icon className="h-4 w-4 text-primary flex-shrink-0" />
              <span>{it.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const closeMobile = () => setIsMenuOpen(false);

  return (
    <div className="sticky top-0 z-50">
      {/* Crisis support strip */}
      <div className="hidden md:block bg-green-wellness text-primary-foreground py-1.5 px-4 text-xs">
        <div className="container mx-auto flex justify-between items-center gap-4">
          <a
            href="https://wa.me/256792085773?text=I%20need%20urgent%20mental%20health%20support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-medium hover:text-primary transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Need urgent help? WhatsApp +256 792 085 773</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="tel:+256792085773" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone className="w-3 h-3" />
              <span>0792 085 773</span>
            </a>
            <a href="tel:+256740616404" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone className="w-3 h-3" />
              <span>0740 616 404</span>
            </a>
            {isAdmin && (
              <Link to="/corporate-admin" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Shield className="w-3 h-3" /> Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile crisis strip */}
      <div className="md:hidden bg-green-wellness text-primary-foreground py-1.5 px-3">
        <a
          href="https://wa.me/256792085773?text=I%20need%20urgent%20mental%20health%20support"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-[11px] font-medium"
        >
          <MessageCircle className="w-3 h-3" />
          <span>Need urgent help? WhatsApp +256 792 085 773</span>
        </a>
      </div>

      {/* Main nav */}
      <header className="bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src={logo} alt="InnerSpark Africa" className="h-9 w-9" />
              <span className="hidden sm:block font-display text-lg font-semibold text-foreground tracking-tight">
                InnerSpark <span className="text-primary">Africa</span>
              </span>
            </Link>

            {/* Desktop mega-menus */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">For Individuals</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <MegaPanel items={individualsItems} />
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">For Business</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <MegaPanel items={businessItems} />
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">For Professionals</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <MegaPanel items={professionalsItems} />
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right cluster */}
            <div className="flex items-center gap-2 md:gap-3">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 hidden md:inline-flex">
                      <User className="w-4 h-4" />
                      <span className="max-w-20 truncate text-xs">{user.email?.split('@')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72">
                    <DropdownMenuItem asChild>
                      <Link to="/learning/student-dashboard" className="cursor-pointer">My Learning</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <div className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Admin Dashboards
                        </div>
                        <DropdownMenuItem asChild>
                          <Link to="/learning/admin-dashboard" className="cursor-pointer flex flex-col items-start gap-0.5 py-2">
                            <span className="text-sm font-medium">Platform Management</span>
                            <span className="text-[11px] text-muted-foreground">Learners, training, newsletter, crisis & more</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/mind-check/analytics" className="cursor-pointer flex flex-col items-start gap-0.5 py-2">
                            <span className="text-sm font-medium">Mind-Check Analytics</span>
                            <span className="text-[11px] text-muted-foreground">Engagement, WHO-5 & assessment trends</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/corporate-admin" className="cursor-pointer flex flex-col items-start gap-0.5 py-2">
                            <span className="text-sm font-medium">Corporate Wellbeing Admin</span>
                            <span className="text-[11px] text-muted-foreground">Companies, employees & screening analytics</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/finance" className="cursor-pointer flex flex-col items-start gap-0.5 py-2">
                            <span className="text-sm font-medium">Finance & Accounts</span>
                            <span className="text-[11px] text-muted-foreground">Invoices, income, expenses & reports</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Always-visible primary CTA */}
              <Link to="/specialists">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 md:px-5 font-semibold shadow-sm"
                >
                  Book a Session
                </Button>
              </Link>

              {/* Mobile toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <nav className="lg:hidden py-2 border-t border-border">
              <MobileMegaSection title="For Individuals" items={individualsItems} onNavigate={closeMobile} />
              <MobileMegaSection title="For Business" items={businessItems} onNavigate={closeMobile} />
              <MobileMegaSection title="For Professionals" items={professionalsItems} onNavigate={closeMobile} />

              {user ? (
                <div className="py-3 space-y-2">
                  <Link to="/learning/student-dashboard" onClick={closeMobile} className="block text-sm font-medium">My Learning</Link>
                  {isAdmin && (
                    <div className="pt-2 mt-2 border-t border-border space-y-2">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Admin Dashboards
                      </div>
                      <Link to="/learning/admin-dashboard" onClick={closeMobile} className="block text-sm font-medium text-primary">Platform Management</Link>
                      <Link to="/mind-check/analytics" onClick={closeMobile} className="block text-sm font-medium text-primary">Mind-Check Analytics</Link>
                      <Link to="/corporate-admin" onClick={closeMobile} className="block text-sm font-medium text-primary">Corporate Wellbeing Admin</Link>
                      <Link to="/admin/finance" onClick={closeMobile} className="block text-sm font-medium text-primary">Finance & Accounts</Link>
                    </div>
                  )}
                  <Button variant="outline" className="w-full" onClick={() => { signOut(); closeMobile(); }}>
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={closeMobile} className="block py-3 text-sm font-medium">Sign In</Link>
              )}

              <Link to="/donate-therapy" onClick={closeMobile} className="block py-2">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Donate Therapy
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
