import { useState, useEffect } from "react";
import { Gift, Sparkles, Heart, Star, Phone, Users, Calendar, Shield } from "lucide-react";

const promoMessages = [
  { icon: Sparkles, text: "✨ New Year, New You! Start your wellness journey today" },
  { icon: Heart, text: "💚 Gift Mental Wellness - Donate therapy to someone in need" },
  { icon: Star, text: "⭐ Join 10,000+ Africans prioritizing their mental health" },
  { icon: Phone, text: "📱 Download our app - Available on Android & iOS" },
  { icon: Users, text: "👥 Free Support Groups - Connect with others on similar journeys" },
  { icon: Calendar, text: "📅 Book your first session today - No waiting lists!" },
  { icon: Shield, text: "🔒 100% Confidential - Your privacy is our priority" },
  { icon: Gift, text: "🎁 Refer a friend & both get 15% off your next session" },
  { icon: Sparkles, text: "🌟 New Feature: 24/7 Emergency Mental Health Support" },
];

const PromoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-600 via-red-600 to-green-600 text-white py-1.5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative h-6 flex items-center justify-center">
          {promoMessages.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-500 ${
                  index === currentIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <Icon className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium tracking-wide">
                  {promo.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PromoSlider;
