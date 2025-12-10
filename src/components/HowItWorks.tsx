import { Button } from "@/components/ui/button";
import bookSessionMockup from "@/assets/mockups/book-session.jpeg";

const HowItWorks = () => {
  const steps = [
    {
      title: "Download the InnerSpark App",
      description: "Get started by downloading our app from Google Play or the App Store. Create your profile in minutes."
    },
    {
      title: "Choose Your Therapist",
      description: "Browse our network of licensed therapists. Filter by specialty, price, and availability to find your perfect match."
    },
    {
      title: "Book & Start Your Session",
      description: "Schedule a session at your convenience. Connect via video call and begin your healing journey from anywhere."
    }
  ];

  return (
    <section className="py-8 lg:py-10 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            A virtual consultation that feels{" "}
            <span className="text-primary">less virtual</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with licensed therapists from the comfort of your home
          </p>
        </div>

        {/* Service Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6">
            Video
          </Button>
          <Button variant="outline" className="rounded-full px-6 hover:bg-muted">
            Chat
          </Button>
          <Button variant="outline" className="rounded-full px-6 hover:bg-muted">
            Appointment
          </Button>
          <Button variant="outline" className="rounded-full px-6 hover:bg-muted">
            Support Groups
          </Button>
        </div>

        {/* How it works content */}
        <div className="bg-card rounded-3xl shadow-xl p-6 md:p-8 lg:p-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Steps */}
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-10">How it works</h3>
              
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-primary/30" />
                
                {/* Steps */}
                <div className="space-y-8">
                  {steps.map((step, index) => (
                    <div key={index} className="relative pl-10 group">
                      {/* Dot */}
                      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>
                      
                      {/* Content */}
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          {step.title}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* App Store Buttons */}
              <div className="flex flex-wrap gap-4 mt-10">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-foreground text-background px-5 py-3 rounded-xl hover:bg-foreground/90 transition-colors group"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">GET IT ON</div>
                    <div className="font-semibold text-sm">Google Play</div>
                  </div>
                </a>
                
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-foreground text-background px-5 py-3 rounded-xl hover:bg-foreground/90 transition-colors group"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="font-semibold text-sm">App Store</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Phone Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone frame - clean modern design */}
                <div className="relative w-[220px] md:w-[260px]">
                  {/* Phone bezel */}
                  <div className="relative bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
                    {/* Screen container with crop */}
                    <div className="relative bg-white rounded-[1.5rem] overflow-hidden h-[280px] md:h-[320px]">
                      {/* Screen content - positioned to show middle section */}
                      <img 
                        src={bookSessionMockup} 
                        alt="InnerSpark App - Book a therapy session" 
                        className="w-full h-auto absolute top-[-60px] left-0 object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
