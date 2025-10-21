import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString(),
    }));
    setShowPreferences(false);
    setShowBanner(false);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === "necessary") return; // Necessary cookies cannot be disabled
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg animate-in slide-in-from-bottom duration-300">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-semibold mb-2">This website uses cookies</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies and similar technologies to provide the necessary site functionality, 
                and improve your experience on our website. By clicking the "Accept All Cookies" button, 
                you consent to our use of cookies for all purposes. Learn more in our{" "}
                <Link to="/cookie-policy" className="text-primary hover:underline">
                  Cookie Policy
                </Link>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowPreferences(true)}
                className="w-full sm:w-auto"
              >
                Manage Cookie Preferences
              </Button>
              <Button
                variant="outline"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto"
              >
                Reject Non-Essential
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="w-full sm:w-auto"
              >
                Accept All Cookies
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Customize which cookies you allow us to use. Necessary cookies are required for the website to function.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex-1 pr-4">
                <h4 className="font-semibold mb-1">Strictly Necessary Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  These cookies are essential for the website to function properly. They enable basic features 
                  like page navigation, secure login, and access to protected areas. The website cannot function 
                  properly without these cookies.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Always Active</span>
                <div className="w-12 h-6 bg-primary rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                </div>
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex-1 pr-4">
                <h4 className="font-semibold mb-1">Functional Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  These cookies enable enhanced functionality and personalization, such as remembering your 
                  language preference, theme selection, and previous session data.
                </p>
              </div>
              <button
                onClick={() => togglePreference("functional")}
                className="flex items-center gap-2 group"
              >
                <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                  preferences.functional ? "bg-primary" : "bg-muted"
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                    preferences.functional ? "ml-auto" : "ml-0"
                  }`} />
                </div>
              </button>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex-1 pr-4">
                <h4 className="font-semibold mb-1">Analytics & Performance Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  These cookies help us understand how visitors interact with our website by collecting and 
                  reporting information anonymously. This helps us improve our website and services.
                </p>
              </div>
              <button
                onClick={() => togglePreference("analytics")}
                className="flex items-center gap-2 group"
              >
                <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                  preferences.analytics ? "bg-primary" : "bg-muted"
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                    preferences.analytics ? "ml-auto" : "ml-0"
                  }`} />
                </div>
              </button>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h4 className="font-semibold mb-1">Marketing & Advertising Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  These cookies are used to deliver relevant advertisements and measure the effectiveness of 
                  our marketing campaigns. They may be set by our advertising partners through our website.
                </p>
              </div>
              <button
                onClick={() => togglePreference("marketing")}
                className="flex items-center gap-2 group"
              >
                <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                  preferences.marketing ? "bg-primary" : "bg-muted"
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                    preferences.marketing ? "ml-auto" : "ml-0"
                  }`} />
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPreferences(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;