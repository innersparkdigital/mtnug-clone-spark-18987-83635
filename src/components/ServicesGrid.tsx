import { 
  Smartphone, 
  Wifi, 
  Globe, 
  CreditCard, 
  Cloud, 
  Users, 
  MessageSquare, 
  Gift 
} from "lucide-react";

const services = [
  { icon: Smartphone, title: "Data Bundles", description: "Stay connected with affordable data plans" },
  { icon: Wifi, title: "WakaNet Fibre", description: "Ultra-fast home internet" },
  { icon: Globe, title: "Roaming", description: "Stay connected worldwide" },
  { icon: CreditCard, title: "Mobile Money", description: "Send, receive & save money" },
  { icon: Cloud, title: "Cloud Services", description: "Store and access your data" },
  { icon: Users, title: "Business Solutions", description: "Grow your business with us" },
  { icon: MessageSquare, title: "SMS Bundles", description: "Unlimited messaging options" },
  { icon: Gift, title: "Rewards", description: "Earn points and get rewards" },
];

const ServicesGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Our Services
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-6 rounded-lg hover:bg-muted transition-all duration-300 cursor-pointer hover:shadow-card hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
