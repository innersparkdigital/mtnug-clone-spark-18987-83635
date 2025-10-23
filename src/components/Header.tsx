import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/innerspark-logo.png";
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
          <Link to="/services" className="hover:text-primary transition-colors">FOR INDIVIDUALS</Link>
          <Link to="/events-training" className="hover:text-primary transition-colors">FOR BUSINESS</Link>
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
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="hover:text-primary font-medium">
                      Our App
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[400px] p-4">
                        <h3 className="font-semibold text-lg mb-4">Everything You Need for Mental Wellness</h3>
                        <ul className="grid gap-3">
                          <li>
                            <NavigationMenuLink asChild>
                              <Link to="/virtual-therapy" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">Virtual Therapy</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Access professional therapy from anywhere</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link to="/support-groups" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">Support Groups</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Join communities for shared experiences</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link to="/chat-sessions" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">Chat Sessions</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Connect with mental health professionals</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link to="/find-therapist" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">Find a Therapist</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Browse and connect with therapists</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link to="/mood-check-in" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">Mood Check-In</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Track your emotional wellbeing</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link to="/meditations" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">Meditations</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Guided meditation sessions</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link to="/my-goals" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">My Goals</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Set and track wellness goals</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link to="/wellness-reports" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">Wellness Reports</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">View your progress reports</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link to="/emergency-support" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">Emergency Support</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">24/7 crisis support resources</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link to="/profile-settings" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">Profile Settings</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Manage your account preferences</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <Link to="/about" className="hover:text-primary transition-colors font-medium">
                About
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
              <Link to="/contact">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
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
              <div className="space-y-2">
                <div className="font-medium text-sm text-muted-foreground">Our App</div>
                <Link to="/virtual-therapy" className="block pl-4 hover:text-primary transition-colors text-sm">
                  Virtual Therapy
                </Link>
                <Link to="/support-groups" className="block pl-4 hover:text-primary transition-colors text-sm">
                  Support Groups
                </Link>
                <Link to="/chat-sessions" className="block pl-4 hover:text-primary transition-colors text-sm">
                  Chat Sessions
                </Link>
                <Link to="/find-therapist" className="block pl-4 hover:text-primary transition-colors text-sm">
                  Find a Therapist
                </Link>
                <Link to="/mood-check-in" className="block pl-4 hover:text-primary transition-colors text-sm">
                  Mood Check-In
                </Link>
                <Link to="/meditations" className="block pl-4 hover:text-primary transition-colors text-sm">
                  Meditations
                </Link>
                <Link to="/my-goals" className="block pl-4 hover:text-primary transition-colors text-sm">
                  My Goals
                </Link>
                <Link to="/wellness-reports" className="block pl-4 hover:text-primary transition-colors text-sm">
                  Wellness Reports
                </Link>
                <Link to="/emergency-support" className="block pl-4 hover:text-primary transition-colors text-sm">
                  Emergency Support
                </Link>
                <Link to="/profile-settings" className="block pl-4 hover:text-primary transition-colors text-sm">
                  Profile Settings
                </Link>
              </div>
              <Link to="/about" className="block hover:text-primary transition-colors font-medium">
                About
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
              <Link to="/contact">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
