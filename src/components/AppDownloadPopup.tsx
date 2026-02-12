import { useState } from "react";
import { Download, Smartphone, Heart, Shield, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AppDownloadPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  // QR code that links to the app store or website
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://www.innersparkafrica.com&bgcolor=ffffff&color=000000";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 gap-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden lg:inline">Download App</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 border-0 shadow-2xl z-50"
        align="end"
        sideOffset={8}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Download App</h3>
            <a 
              href="/services" 
              className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
            >
              View more <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-5">
            <li className="flex items-start gap-3">
              <div className="p-1.5 bg-teal-500/20 rounded-lg">
                <Heart className="h-4 w-4 text-teal-400" />
              </div>
              <span className="text-sm text-gray-200">Access therapy & counseling anytime, anywhere</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-1.5 bg-teal-500/20 rounded-lg">
                <Smartphone className="h-4 w-4 text-teal-400" />
              </div>
              <span className="text-sm text-gray-200">Track your mood & wellness journey offline</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-1.5 bg-teal-500/20 rounded-lg">
                <Shield className="h-4 w-4 text-teal-400" />
              </div>
              <span className="text-sm text-gray-200">Private, secure & easy to use interface</span>
            </li>
          </ul>

          {/* QR Code Section */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-3">Scan QR code to download or</p>
              <a
                href="https://www.innersparkafrica.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Innerspark
              </a>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-lg">
              <img 
                src={qrCodeUrl}
                alt="Scan to download Innerspark App"
                className="w-24 h-24"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AppDownloadPopup;