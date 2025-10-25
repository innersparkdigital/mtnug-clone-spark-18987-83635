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
              <a 
                href="#" 
                className="inline-block bg-black/30 hover:bg-black/40 transition-colors rounded-lg px-6 py-3 flex items-center gap-2"
                aria-label="Explore it on AppGallery"
              >
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">H</span>
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wide opacity-90">Explore it on</div>
                  <div className="text-sm font-semibold">AppGallery</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right side - Device mockups */}
          <div className="flex-1 flex justify-center items-center gap-4 relative">
            {/* Mobile mockup */}
            <div className="relative w-32 md:w-40 lg:w-48">
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-2 md:p-3 shadow-2xl">
                <div className="bg-gray-100 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden aspect-[9/19] flex items-center justify-center relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-24 h-4 md:h-6 bg-white rounded-b-2xl z-10"></div>
                  {/* Logo */}
                  <img 
                    src={innersparkLogo} 
                    alt="Innerspark" 
                    className="w-16 md:w-20 lg:w-24 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Tablet mockup */}
            <div className="relative w-40 md:w-52 lg:w-64">
              <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-3 shadow-2xl">
                <div className="bg-gray-100 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden aspect-[4/3] flex items-center justify-center">
                  <img 
                    src={innersparkLogo} 
                    alt="Innerspark" 
                    className="w-24 md:w-32 lg:w-40 object-contain"
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
