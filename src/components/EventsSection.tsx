import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import truckDriversImage from "@/assets/truck-drivers-training.png";
import foundersMindsetImage from "@/assets/founders-mindset-training.png";
import childrenMentalHealthImage from "@/assets/children-mental-health.jpg";
import miicImage from "@/assets/miic-mental-health.png";
import mtnImage from "@/assets/mtn-internship.png";
import worldMentalHealthImage from "@/assets/world-mental-health-day.png";
import uictImage from "@/assets/uict-training.png";
import uictWellnessImage from "@/assets/uict-wellness-activity.jpg";

const events = [
  {
    id: 1,
    slug: "uict-wellness-activity-day",
    image: uictWellnessImage,
    date: "October 29-30, 2025",
    title: "UICT Wellness Activity Day – Mental Health Is in the Palm of Your Hands",
  },
  {
    id: 2,
    slug: "children-mental-health-awareness",
    image: childrenMentalHealthImage,
    date: "August 9, 2025",
    title: "Innerspark Brings Mental Health Awareness to Children at Full Gospel Primary School",
  },
  {
    id: 3,
    slug: "miic-wellness-innovation",
    image: miicImage,
    date: "August 1, 2025",
    title: "Fostering Wellness in Innovation: Mental Health Awareness Session at MIIC",
  },
];

const EventsSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Events & Training
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stories from our community programs and wellness initiatives across Africa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.map((event) => (
            <Link key={event.id} to={`/events-training/${event.slug}`}>
              <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full bg-background">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {event.date}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/events-training">
            <Button variant="outline" size="lg" className="group">
              View All Events
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
