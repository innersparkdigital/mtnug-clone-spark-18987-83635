import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import truckDriversImage from "@/assets/truck-drivers-training.png";
import foundersMindsetImage from "@/assets/founders-mindset-training.png";
import childrenMentalHealthImage from "@/assets/children-mental-health.jpg";

const blogPosts = [
  {
    id: 1,
    slug: "truck-drivers-retirement-training",
    image: truckDriversImage,
    date: "July 2024",
    title: "Preparing Truck Drivers for Life Beyond the Road: A Journey of Empowerment and Transition",
    excerpt: "In July, at the Nakawa National Innovation Hub, Markh Investment Ltd, with support from Inner Spark Recovery, held a six-day program to prepare truck drivers for this life transition.",
  },
  {
    id: 2,
    slug: "founders-mindset-training",
    image: foundersMindsetImage,
    date: "September 2024",
    title: "Shaping the Founder's Mindset at the National ICT Innovation Hub",
    excerpt: "Through our Startup Wellness Program, Innerspark in partnership with Dr. Lisa Tumwine from LILA Haven and Martin Tumwine from Zaantu Capital had the privilege of engaging with 30+ startup founders.",
  },
  {
    id: 3,
    slug: "children-mental-health-awareness",
    image: childrenMentalHealthImage,
    date: "August 2025",
    title: "Innerspark Brings Mental Health Awareness to Children at Full Gospel Primary School, Nsambya CDC",
    excerpt: "At Innerspark, we believe that building emotionally healthy communities begins with our children. Our team recently held a Children's Mental Health Awareness Session at Full Gospel Primary School.",
  },
];

const EventsTraining = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Innerspark Events & Training
            </h1>
            <p className="text-xl text-muted-foreground">
              Stories from our community programs and wellness initiatives
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {blogPosts.map((post) => (
              <Link key={post.id} to={`/events-training/${post.slug}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-b-4 border-b-primary/30 hover:border-b-primary">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 h-64 md:h-auto">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-3/5 p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded">
                          PRESS
                        </span>
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-semibold group">
                        <span>READ MORE</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default EventsTraining;
