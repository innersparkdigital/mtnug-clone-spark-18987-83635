import innersparkLogo from "@/assets/innerspark-logo.png";

const AppDownload = () => {
  return (
    <section className="bg-gradient-to-r from-[#002855] to-[#003d7a] py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side - Text and buttons */}
          <div className="flex-1 text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Innerspark App
            </h2>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#" 
                className="inline-block transition-transform hover:scale-105"
                aria-label="Download on App Store"
              >
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="Download on the App Store" 
                  className="h-12 md:h-14"
                />
              </a>
              <a 
                href="#" 
                className="inline-block transition-transform hover:scale-105"
                aria-label="Get it on Google Play"
              >
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                  alt="Get it on Google Play" 
                  className="h-12 md:h-14"
                />
              </a>
            </div>
          </div>

          {/* Right side - Device mockups */}
          <div className="flex-1 flex justify-center items-end gap-6 relative">
            {/* Mobile mockup */}
            <div className="relative" style={{ width: '3.5cm' }}>
              <div className="bg-white rounded-[1.5rem] p-2 shadow-2xl border-8 border-gray-800">
                <div className="bg-white rounded-[0.75rem] overflow-hidden aspect-[9/19] flex items-center justify-center">
                  <img 
                    src={innersparkLogo} 
                    alt="Innerspark" 
                    className="w-16 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Tablet mockup */}
            <div className="relative" style={{ width: '5.5cm' }}>
              <div className="bg-white rounded-[1.5rem] p-2 shadow-2xl border-8 border-gray-800">
                <div className="bg-white rounded-[0.75rem] overflow-hidden aspect-[4/3] flex items-center justify-center">
                  <img 
                    src={innersparkLogo} 
                    alt="Innerspark" 
                    className="w-24 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
