import innersparkLogo from "@/assets/innerspark-logo.png";

const AppDownload = () => {
  return (
    <section className="bg-gradient-to-r from-[#002855] to-[#003d7a] h-[150px] flex items-center relative overflow-visible">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Text and buttons */}
          <div className="flex-1 text-white">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              Innerspark App
            </h2>
            <div className="flex flex-wrap gap-3 items-center">
              <a 
                href="#" 
                className="inline-block transition-transform hover:scale-105"
                aria-label="Download on App Store"
              >
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="Download on the App Store" 
                  className="h-10"
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
                  className="h-10"
                />
              </a>
            </div>
          </div>

          {/* Right side - Device mockups - positioned to overflow upward */}
          <div className="flex-1 flex justify-center items-end gap-4 relative">
            {/* Mobile mockup */}
            <div className="relative -mt-24" style={{ width: '3.5cm' }}>
              <div className="bg-white rounded-[1.5rem] p-2 shadow-2xl border-4 border-gray-800">
                <div className="bg-white rounded-[0.75rem] overflow-hidden aspect-[9/19] flex items-center justify-center">
                  <img 
                    src={innersparkLogo} 
                    alt="Innerspark" 
                    className="w-12 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Tablet mockup */}
            <div className="relative -mt-16" style={{ width: '5.5cm' }}>
              <div className="bg-white rounded-[1.5rem] p-2 shadow-2xl border-4 border-gray-800">
                <div className="bg-white rounded-[0.75rem] overflow-hidden aspect-[4/3] flex items-center justify-center">
                  <img 
                    src={innersparkLogo} 
                    alt="Innerspark" 
                    className="w-20 object-contain"
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
