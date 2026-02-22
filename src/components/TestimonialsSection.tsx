import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Kampala, Uganda",
    text: "Innerspark changed my life. I was struggling with anxiety for years, and my therapist helped me find peace again. The sessions are affordable and so convenient.",
    rating: 5,
  },
  {
    name: "David K.",
    location: "Nairobi, Kenya",
    text: "I was skeptical about online therapy, but the professionalism and care I received was beyond my expectations. Highly recommend to anyone in Africa seeking support.",
    rating: 5,
  },
  {
    name: "Grace N.",
    location: "Entebbe, Uganda",
    text: "Being able to talk to someone confidentially from home made all the difference. The booking process was simple and my therapist truly understood me.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">What Our Clients Say</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground font-serif">
              Real stories, real healing.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-muted/50 border border-border rounded-2xl p-6 relative"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-3" />
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
