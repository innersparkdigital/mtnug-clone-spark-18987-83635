import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Home, ArrowLeft, Search, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Page Not Found - 404 | Innerspark Africa</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="prerender-status-code" content="404" />
        <meta name="description" content="The page you're looking for doesn't exist. Return to Innerspark Africa's homepage to find mental health resources, therapy services, and support." />
      </Helmet>

      <Header />

      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Visual */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            </div>

            {/* Message */}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Sorry, the page you're looking for doesn't exist or has been moved. 
              Let's get you back on track.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Home className="w-5 h-5" />
                  Go to Homepage
                </Button>
              </Link>
              <Link to="/specialists">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Search className="w-5 h-5" />
                  Find a Therapist
                </Button>
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="bg-muted/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Popular Pages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <Link 
                  to="/virtual-therapy" 
                  className="text-primary hover:underline"
                >
                  Virtual Therapy
                </Link>
                <Link 
                  to="/support-groups" 
                  className="text-primary hover:underline"
                >
                  Support Groups
                </Link>
                <Link 
                  to="/mind-check" 
                  className="text-primary hover:underline"
                >
                  Mental Health Tests
                </Link>
                <Link 
                  to="/blog" 
                  className="text-primary hover:underline"
                >
                  Mental Health Blog
                </Link>
                <Link 
                  to="/about" 
                  className="text-primary hover:underline"
                >
                  About Us
                </Link>
                <Link 
                  to="/services" 
                  className="text-primary hover:underline"
                >
                  Our Services
                </Link>
                <Link 
                  to="/learning" 
                  className="text-primary hover:underline"
                >
                  Learning Hub
                </Link>
                <Link 
                  to="/contact" 
                  className="text-primary hover:underline"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Emergency Support */}
            <div className="mt-8 p-4 bg-destructive/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Need immediate support?
              </p>
              <a 
                href="https://wa.me/256780570987?text=Hi%2C%20I%20need%20immediate%20mental%20health%20support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Crisis Support
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
