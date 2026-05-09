import { Link } from "react-router-dom";
import { ArrowRight, MessageSquareLock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const WhisperTeaser = () => (
  <section className="py-16 bg-foreground text-background">
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 text-xs font-semibold tracking-[0.06em] uppercase mb-4">
            <MessageSquareLock className="w-3.5 h-3.5" /> Introducing Whisper
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Not ready to talk? Whisper anonymously.</h2>
          <p className="text-base md:text-lg text-background/80 mb-8 leading-relaxed">
            Share what's on your mind without giving your name. Get a thoughtful, human reply — completely anonymous, completely free.
          </p>
          <Link
            to="/whisper"
            className="inline-flex items-center gap-2 bg-background text-foreground rounded-full px-6 py-3 font-semibold hover:bg-background/90 transition-colors"
          >
            Try Whisper <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default WhisperTeaser;