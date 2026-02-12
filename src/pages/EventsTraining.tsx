import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import truckDriversImage from "@/assets/truck-drivers-training.png";
import foundersMindsetImage from "@/assets/founders-mindset-training.png";
import childrenMentalHealthImage from "@/assets/children-mental-health.jpg";
import miicImage from "@/assets/miic-mental-health.png";
import mtnImage from "@/assets/mtn-internship.png";
import worldMentalHealthImage from "@/assets/world-mental-health-day.png";
import uictImage from "@/assets/uict-training.png";
import uictWellnessImage from "@/assets/uict-wellness-activity.jpg";

const blogPosts = [
  {
    id: 1,
    slug: "uict-wellness-activity-day",
    image: uictWellnessImage,
    date: "October 29-30, 2025",
    title: "UICT Wellness Activity Day – Mental Health Is in the Palm of Your Hands",
    excerpt: "The two-day event combined interactive mental health training with individual counseling sessions, empowering participants to prioritize their physical, emotional, and cognitive wellness.",
  },
  {
    id: 2,
    slug: "children-mental-health-awareness",
    image: childrenMentalHealthImage,
    date: "August 9, 2025",
    title: "Innerspark Brings Mental Health Awareness to Children at Full Gospel Primary School, Nsambya CDC",
    excerpt: "At Innerspark, we believe that building emotionally healthy communities begins with our children. Our team recently held a Children's Mental Health Awareness Session at Full Gospel Primary School.",
  },
  {
    id: 3,
    slug: "miic-wellness-innovation",
    image: miicImage,
    date: "August 1, 2025",
    title: "Fostering Wellness in Innovation: Innerspark Conducts Mental Health Awareness Session at MIIC",
    excerpt: "At the heart of every thriving startup ecosystem lies a simple truth — innovation flourishes where minds are healthy and supported.",
  },
  {
    id: 4,
    slug: "mtn-internship-anxiety",
    image: mtnImage,
    date: "July 11, 2025",
    title: "Managing Anxiety During Internship – MTN Uganda",
    excerpt: "As part of MTN Uganda's Career ACE Internship Program, Innerspark facilitated an engaging session on managing anxiety designed to equip young professionals with emotional resilience.",
  },
  {
    id: 5,
    slug: "uict-mental-health-training",
    image: uictImage,
    date: "March 19, 2025",
    title: "Mental Health Awareness Training – Uganda Institute of Communication Technology (UICT)",
    excerpt: "Innerspark conducted a Mental Health Awareness Training at UICT, providing students with a safe space to explore their emotional well-being and learn practical coping strategies.",
  },
  {
    id: 6,
    slug: "world-mental-health-day-2024",
    image: worldMentalHealthImage,
    date: "October 8, 2024",
    title: "World Mental Health Day Workshop: Prioritizing Workplace Mental Health",
    excerpt: "In commemoration of World Mental Health Day 2024, Innerspark hosted a transformative workshop bringing together diverse professionals to discuss workplace mental wellness.",
  },
  {
    id: 7,
    slug: "founders-mindset-training",
    image: foundersMindsetImage,
    date: "September 2024",
    title: "Shaping the Founder's Mindset at the National ICT Innovation Hub",
    excerpt: "Through our Startup Wellness Program, Innerspark in partnership with Dr. Lisa Tumwine from LILA Haven and Martin Tumwine from Zaantu Capital had the privilege of engaging with 30+ startup founders.",
  },
  {
    id: 8,
    slug: "truck-drivers-retirement-training",
    image: truckDriversImage,
    date: "July 2024",
    title: "Preparing Truck Drivers for Life Beyond the Road: A Journey of Empowerment and Transition",
    excerpt: "In July, at the Nakawa National Innovation Hub, Markh Investment Ltd, with support from Inner Spark Recovery, held a six-day program to prepare truck drivers for this life transition.",
  },
];

const POSTS_PER_PAGE = 3;

const EventsTraining = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = blogPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Events & Training | Mental Health Workshops | Innerspark Africa</title>
        <meta name="description" content="Explore Innerspark's mental health events, corporate training programs, and community wellness initiatives across Africa. Learn from our workshops and awareness sessions." />
        <meta name="keywords" content="mental health events, corporate training, wellness workshops Africa, mental health awareness, community programs Uganda" />
        <link rel="canonical" href="https://www.innersparkafrica.com/events-training" />
        <meta property="og:url" content="https://www.innersparkafrica.com/events-training" />
        <meta property="og:title" content="Events & Training | Innerspark Africa" />
        <meta property="og:description" content="Explore Innerspark's mental health events and corporate training programs." />
        <meta property="og:type" content="website" />
      </Helmet>
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
            {currentPosts.map((post) => (
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

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      {/* <AppDownload /> */}
      <Footer />
    </div>
  );
};

export default EventsTraining;
