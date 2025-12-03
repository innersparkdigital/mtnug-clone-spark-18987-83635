import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
    
    // Simulate subscription (replace with actual API call later)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Successfully subscribed!",
      description: "Thank you for subscribing to our newsletter."
    });
    
    setEmail("");
    setIsLoading(false);
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
