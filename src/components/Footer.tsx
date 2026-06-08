import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";

const Footer = () => {
  return (
    <footer className="bg-secondary text-foreground border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 — Company */}
          <div>
            <h4 className="font-display text-base font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/events-training" className="hover:text-primary transition-colors">Events</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/donate-therapy" className="hover:text-primary transition-colors">Donate Therapy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Column 2 — Individual */}
          <div>
            <h4 className="font-display text-base font-semibold mb-4">For Individuals</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/online-therapy" className="hover:text-primary transition-colors">Online Therapy</Link></li>
              <li><Link to="/specialists" className="hover:text-primary transition-colors">Find a Therapist</Link></li>
              <li><Link to="/support-groups" className="hover:text-primary transition-colors">Support Groups</Link></li>
              <li><Link to="/mind-check" className="hover:text-primary transition-colors">Mind-Check</Link></li>
              <li><Link to="/whisper" className="hover:text-primary transition-colors">Whisper</Link></li>
              <li><Link to="/amani-ai" className="hover:text-primary transition-colors">Amani AI</Link></li>
              <li><Link to="/kenya" className="hover:text-primary transition-colors">Therapy in Kenya</Link></li>
              <li><Link to="/therapy-in-uganda" className="hover:text-primary transition-colors">Therapy in Uganda</Link></li>
            </ul>
          </div>

          {/* Column 3 — Corporate */}
          <div>
            <h4 className="font-display text-base font-semibold mb-4">For Business</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/for-business" className="hover:text-primary transition-colors">For Business</Link></li>
              <li><Link to="/blog/corporate-wellbeing-screening-uganda" className="hover:text-primary transition-colors">Corporate Screening — UGX 7,500</Link></li>
              <li><Link to="/learning" className="hover:text-primary transition-colors">Learning Hub</Link></li>
              <li><Link to="/corporate-wellbeing-check" className="hover:text-primary transition-colors">Corporate Screening</Link></li>
              <li><Link to="/events-training/trainings" className="hover:text-primary transition-colors">S.P.A.R.K Training</Link></li>
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="font-display text-base font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <a href="tel:+256792085773" className="hover:text-primary transition-colors">+256 792 085 773</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <a href="mailto:info@innersparkafrica.com" className="hover:text-primary transition-colors break-all">info@innersparkafrica.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>National ICT Innovation Hub, Nakawa, Kampala</span>
              </li>
            </ul>

            <a
              href="https://wa.me/256792085773?text=Hi%20InnerSpark%2C%20I'd%20like%20to%20chat"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex"
            >
              <Button size="sm" className="gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white">
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </Button>
            </a>

            {/* App badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="https://play.google.com/store/apps/details?id=com.innerspark.africa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
                className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90 transition"
              >
                <span className="text-[10px] opacity-80 leading-none">GET IT ON</span>
                <span className="font-semibold">Google Play</span>
              </a>
              <Link
                to="/app-coming-soon"
                aria-label="Download on the App Store"
                className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90 transition"
              >
                <span className="text-[10px] opacity-80 leading-none">Download on the</span>
                <span className="font-semibold">App Store</span>
              </Link>
            </div>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-2">
              {[
                { href: "https://www.facebook.com/innersparkrecover", Icon: Facebook, label: "Facebook" },
                { href: "https://x.com/innersparkrcv", Icon: Twitter, label: "Twitter" },
                { href: "https://www.linkedin.com/in/inner-spark-581014326/", Icon: Linkedin, label: "LinkedIn" },
                { href: "https://instagram.com/innersparkrecover", Icon: Instagram, label: "Instagram" },
                { href: "https://www.youtube.com/@INNERSPARK36", Icon: Youtube, label: "YouTube" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Brand block + crisis line */}
        <div className="border-t border-border pt-6 mb-6 grid gap-4 md:grid-cols-2 items-center">
          <div>
            <Link to="/" className="font-display text-lg font-semibold tracking-tight">
              InnerSpark <span className="text-primary">Africa</span>
            </Link>
            <p className="text-xs text-muted-foreground mt-1 max-w-md leading-relaxed">
              Africa's Most Accessible Mental Wellness Platform — connecting individuals, organisations and communities to licensed therapists and self-care tools across the continent.
            </p>
          </div>
          <a
            href="https://wa.me/256792085773?text=I%20need%20urgent%20mental%20health%20support"
            target="_blank"
            rel="noopener noreferrer"
            className="md:justify-self-end inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            Need urgent help? WhatsApp +256 792 085 773
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} InnerSpark Africa. All rights reserved.</p>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <LanguageSelector variant="footer" />
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/cookie-policy" className="hover:text-primary transition-colors">Cookies</Link>
            <Link to="/account-deletion" className="hover:text-primary transition-colors">Account Deletion</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
