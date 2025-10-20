import { 
  Video, 
  Users, 
  MessageSquare, 
  Heart, 
  Target, 
  AlertCircle, 
  Calendar, 
  DollarSign,
  BarChart3,
  Headphones,
  UserCheck,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: Video, title: "Virtual Therapy", description: "One-on-one counseling with licensed therapists", link: "/virtual-therapy" },
  { icon: Users, title: "Support Groups", description: "Safe peer spaces for sharing and healing", link: "/support-groups" },
  { icon: MessageSquare, title: "Chat Sessions", description: "Private text-based emotional support", link: "/chat-sessions" },
  { icon: Heart, title: "Mood Check-In", description: "Daily reflections and emotional tracking", link: "/mood-check-in" },
  { icon: Target, title: "My Goals", description: "Set and track your wellness goals", link: "/my-goals" },
  { icon: AlertCircle, title: "Emergency Support", description: "One-tap access to crisis counselors", link: "/emergency-support" },
  { icon: Calendar, title: "Events & Training", description: "Workshops and community programs", link: "/events-training" },
  { icon: DollarSign, title: "Donate Therapy", description: "Help others access mental health care", link: "/donate-therapy" },
  { icon: BarChart3, title: "Wellness Reports", description: "Weekly summaries of your progress", link: "/wellness-reports" },
  { icon: Headphones, title: "Meditations", description: "Guided audio for relaxation and calm", link: "/meditations" },
  { icon: UserCheck, title: "Find a Therapist", description: "Browse qualified mental health professionals", link: "/find-therapist" },
  { icon: Settings, title: "Profile & Settings", description: "Manage your preferences securely", link: "/profile-settings" },
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
