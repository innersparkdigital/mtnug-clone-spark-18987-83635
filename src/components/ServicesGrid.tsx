import { 
  Video, 
  Users, 
  MessageSquare, 
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: Video, title: "Virtual Therapy", description: "One-on-one counseling with licensed therapists", link: "/virtual-therapy" },
  { icon: Users, title: "Support Groups", description: "Safe peer spaces for sharing and healing", link: "/support-groups" },
  { icon: MessageSquare, title: "Chat Sessions", description: "Private text-based emotional support", link: "/chat-sessions" },
  { icon: UserCheck, title: "Find a Therapist", description: "Browse qualified mental health professionals", link: "/find-therapist" },
];

const ServicesGrid = () => {
  return (
    <section id="services" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Everything You Need for Mental Wellness
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Innerspark brings together therapy, community, and self-care tools — all in one app, accessible right from your phone.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
