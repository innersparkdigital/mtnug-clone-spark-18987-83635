import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Heart } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface DonationTier {
  amount: string;
  ugx: string;
  title: string;
  desc: string;
}

const donationTiers: DonationTier[] = [
  { amount: "30,000", ugx: "UGX", title: "Support Session", desc: "Helps cover one chat therapy session" },
  { amount: "75,000", ugx: "UGX", title: "Full Session", desc: "Funds one complete video therapy session" },
  { amount: "300,000", ugx: "UGX", title: "Monthly Care", desc: "Provides a full month of therapy support" },
  { amount: "custom", ugx: "UGX", title: "Custom Amount", desc: "Enter your own donation amount" }
];

const paymentMethods = [
  "Mobile Money (MTN)",
  "Mobile Money (Airtel)",
  "Bank Transfer",
  "Cash",
  "Other"
];

const DonateTherapy = () => {
  const [selectedTier, setSelectedTier] = useState<DonationTier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    paymentMethod: "",
    message: ""
  });
  const { toast } = useToast();

  const handleTierSelect = (tier: DonationTier) => {
    setSelectedTier(tier);
    if (tier.amount !== "custom") {
      setCustomAmount("");
    }
    setIsDialogOpen(true);
  };

  const isCustomTier = selectedTier?.amount === "custom";

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (isCustomTier && !customAmount) {
      toast({
        title: "Missing Amount",
        description: "Please enter your custom donation amount.",
        variant: "destructive"
      });
      return;
    }

    // Construct WhatsApp message
    const displayAmount = isCustomTier ? customAmount : selectedTier?.amount;
    const message = `*New Therapy Donation Request*%0A%0A` +
      `*Donation Tier:* ${selectedTier?.title} (${displayAmount} ${selectedTier?.ugx})%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Email:* ${formData.email || "Not provided"}%0A` +
      `*Payment Method:* ${formData.paymentMethod}%0A` +
      `*Message:* ${formData.message || "None"}`;

    const whatsappUrl = `https://wa.me/256780570987?text=${message}`;
    window.open(whatsappUrl, "_blank");

    // Reset form and close dialog
    setFormData({ name: "", phone: "", email: "", paymentMethod: "", message: "" });
    setCustomAmount("");
    setIsDialogOpen(false);
    
    toast({
      title: "Thank You!",
      description: "Your donation request has been sent. We'll follow up shortly."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Donate Therapy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Help someone in need access mental health care through our community therapy fund. Your donation makes healing possible for those who can't afford it.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Your Impact
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Fund therapy sessions for those in financial need",
                "100% of donations go directly to therapy access",
                "One-time or recurring donation options",
                "Transparent reporting on fund usage",
                "Help break down barriers to mental healthcare",
                "Support someone's journey to healing"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <p className="text-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Donation Tiers
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {donationTiers.map((tier) => (
                <div key={tier.title} className={`text-center p-6 bg-background rounded-lg border transition-colors ${tier.amount === "custom" ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary"}`}>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {tier.amount === "custom" ? "Your Choice" : tier.amount}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">{tier.ugx}</div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{tier.title}</h3>
                  <p className="text-muted-foreground mb-4">{tier.desc}</p>
                  <Button 
                    variant={tier.amount === "custom" ? "default" : "outline"}
                    className={tier.amount === "custom" ? "w-full" : "w-full hover:bg-primary hover:text-primary-foreground"}
                    onClick={() => handleTierSelect(tier)}
                  >
                    {tier.amount === "custom" ? "Enter Amount" : "Select"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Be Part of the Solution
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Every contribution brings healing to someone in need
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => handleTierSelect(donationTiers[1])}
          >
            Make a Donation
          </Button>
        </div>
      </section>

      {/* Donation Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Donation</DialogTitle>
            <DialogDescription>
              {selectedTier && !isCustomTier && (
                <span className="text-primary font-semibold">
                  {selectedTier.title} - {selectedTier.amount} {selectedTier.ugx}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {isCustomTier && (
              <div className="space-y-2">
                <Label htmlFor="customAmount">Donation Amount (UGX) *</Label>
                <Input
                  id="customAmount"
                  type="text"
                  placeholder="e.g., 50,000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., 0780123456"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Mode of Payment *</Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Any message or dedication for your donation..."
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full">
              Submit & Contact via WhatsApp
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default DonateTherapy;
