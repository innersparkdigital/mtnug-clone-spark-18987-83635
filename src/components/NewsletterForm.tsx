import { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Save to newsletter_subscribers table
      const { error: dbError } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.toLowerCase().trim() });

      if (dbError) {
        if (dbError.code === "23505") {
          toast({
            title: "Already subscribed!",
            description: "You're already on our mailing list."
          });
          setEmail("");
          setIsLoading(false);
          return;
        }
        throw dbError;
      }

      // Send welcome email via Resend
      await supabase.functions.invoke('send-resend-email', {
        body: {
          type: 'newsletter-welcome',
          to: email.toLowerCase().trim(),
          data: {},
        },
      });

      // Notify admin
      await supabase.functions.invoke('send-resend-email', {
        body: {
          type: 'newsletter-notify',
          to: 'info@innersparkafrica.com',
          data: { email: email.toLowerCase().trim() },
        },
      });

      setEmail("");
      setIsLoading(false);
      navigate("/thank-you-newsletter");
      return;
    } catch (error) {
      console.error("Newsletter error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/10 via-accent to-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Stay Updated on Mental Wellness
          </h2>
          <p className="text-muted-foreground mb-8">
            Get expert tips, resources, and the latest articles delivered to your inbox. 
            Join our community of wellness seekers.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-background border-border"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="h-12 px-8"
              disabled={isLoading}
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterForm;
