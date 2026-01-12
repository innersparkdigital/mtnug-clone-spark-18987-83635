import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScrollReveal, { StaggerContainer, StaggerItem, ScaleOnScroll } from "@/components/ScrollReveal";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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
  {
    id: 4,
    slug: "mtn-internship-anxiety",
    image: mtnImage,
    date: "July 11, 2025",
    title: "Managing Anxiety During Internship – MTN Uganda",
  },
  {
    id: 5,
    slug: "uict-mental-health-training",
    image: uictImage,
    date: "March 19, 2025",
    title: "Mental Health Awareness Training – Uganda Institute of Communication Technology (UICT)",
  },
  {
    id: 6,
    slug: "world-mental-health-day-2024",
    image: worldMentalHealthImage,
    date: "October 8, 2024",
    title: "World Mental Health Day Workshop: Prioritizing Workplace Mental Health",
  },
  {
    id: 7,
    slug: "founders-mindset-training",
    image: foundersMindsetImage,
    date: "September 2024",
    title: "Shaping the Founder's Mindset at the National ICT Innovation Hub",
  },
  {
    id: 8,
    slug: "truck-drivers-retirement-training",
    image: truckDriversImage,
    date: "July 2024",
    title: "Preparing Truck Drivers for Life Beyond the Road: A Journey of Empowerment",
  },
];

const EVENTS_PER_PAGE = 3;

const EventsSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const smoothBgY = useSpring(bgY, { stiffness: 100, damping: 30 });

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const currentEvents = events.slice(startIndex, startIndex + EVENTS_PER_PAGE);

  return (
    <section ref={sectionRef} className="py-16 bg-muted/30 relative overflow-hidden">
      {/* Parallax decorative elements */}
      <motion.div
        style={{ y: smoothBgY }}
        className="absolute -top-20 left-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        style={{ y: smoothBgY }}
        className="absolute -bottom-20 right-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal distance={60} duration={0.8}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Events & Training
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stories from our community programs and wellness initiatives across Africa
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" staggerDelay={0.15}>
          {currentEvents.map((event) => (
            <StaggerItem key={event.id} scale>
              <Link to={`/events-training/${event.slug}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full bg-background">
                    <div className="relative h-56 overflow-hidden">
                      <motion.img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {totalPages > 1 && (
          <ScrollReveal delay={0.4}>
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
