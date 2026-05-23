import { Helmet } from "react-helmet";
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
import { Link } from "react-router-dom";
import { Gift, Repeat, Users, ShieldCheck, Receipt, Building } from "lucide-react";

interface DonationTier {
  amount: string;
  ugx: string;
  title: string;
  desc: string;
}

const donationTiers: DonationTier[] = [
  { amount: "30,000", ugx: "UGX (~$8)", title: "Support Session", desc: "Covers 1 chat therapy session" },
  { amount: "75,000", ugx: "UGX (~$20)", title: "Full Session", desc: "Funds 1 complete video therapy session" },
  { amount: "300,000", ugx: "UGX (~$80)", title: "Monthly Care", desc: "Provides a full month of therapy support" },
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

    const whatsappUrl = `https://wa.me/256792085773?text=${message}`;
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
      <Helmet>
        <title>Donate Therapy — Fund Mental Health Support in Africa | InnerSpark Africa</title>
        <meta name="description" content="Donate a therapy session to someone who can't afford mental health care. Starting from UGX 30,000 / ~$8. 100% of donations go directly to therapy access." />
        <meta name="keywords" content="donate therapy, mental health donation, therapy fund Africa, support mental health, charity therapy, community mental health" />
        <link rel="canonical" href="https://www.innersparkafrica.com/donate-therapy" />
        <meta property="og:url" content="https://www.innersparkafrica.com/donate-therapy" />
        <meta property="og:title" content="Donate Therapy | Innerspark Africa" />
        <meta property="og:description" content="Help someone access mental health care through our community therapy fund." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How does Donate Therapy work?","acceptedAnswer":{"@type":"Answer","text":"Your donation funds free therapy sessions for Ugandans who cannot afford it — students, refugees, and low-income families. UGX 75,000 covers one full session."}},{"@type":"Question","name":"Is my donation tax-deductible?","acceptedAnswer":{"@type":"Answer","text":"Currently donations are not tax-deductible. We provide a receipt for your records, and we publish quarterly impact reports."}},{"@type":"Question","name":"Can I sponsor a specific person?","acceptedAnswer":{"@type":"Answer","text":"Yes. We can match your donation with a specific cause area (e.g., student therapy, trauma survivors). Contact info@innersparkafrica.com to set this up."}}]})}
        </script>
      </Helmet>
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

            {/* Live Impact Counter */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto bg-background/80 backdrop-blur rounded-2xl border border-primary/20 p-6">
              <div>
                <p className="text-3xl font-bold text-primary">1,247</p>
                <p className="text-xs text-muted-foreground">Sessions funded to date</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">38</p>
                <p className="text-xs text-muted-foreground">People supported this month</p>
              </div>
            </div>
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

      {/* Donor Stories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">Stories from people you've helped</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "I finally had someone to talk to who truly understood me.", who: "Anonymous, 24 · University student, Gulu", sessions: "4 donated sessions" },
              { quote: "Therapy gave me back my confidence after losing my job.", who: "Anonymous, 31 · Boda rider, Kampala", sessions: "6 donated sessions" },
              { quote: "I learned to manage panic attacks without medication.", who: "Anonymous, 19 · Refugee, Bidibidi settlement", sessions: "8 donated sessions" },
            ].map((s) => (
              <div key={s.who} className="bg-muted/30 rounded-2xl p-6">
                <p className="text-foreground italic mb-4">"{s.quote}"</p>
                <p className="text-xs text-muted-foreground">{s.who}</p>
                <p className="text-xs text-primary font-semibold mt-1">{s.sessions}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recurring + Gift + CSR + Receipt + Transparency */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-6">
          <div className="bg-background rounded-2xl border border-border p-6">
            <Repeat className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Give monthly</h3>
            <p className="text-sm text-muted-foreground">Set up a recurring UGX 75,000 / $20 monthly donation and support someone continuously throughout the year. Mention "monthly recurring" when you contact us.</p>
          </div>
          <div className="bg-background rounded-2xl border border-border p-6">
            <Gift className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Gift a therapy session</h3>
            <p className="text-sm text-muted-foreground mb-3">Send a "Gift Session" link to someone who needs support — via WhatsApp or email.</p>
            <Button size="sm" variant="outline" onClick={() => {
              const url = `${window.location.origin}/donate-therapy?gift=1`;
              const msg = encodeURIComponent(`I'd like to gift you a therapy session through InnerSpark Africa. Use this link: ${url}`);
              window.open(`https://wa.me/?text=${msg}`, "_blank");
            }}>Share via WhatsApp</Button>
          </div>
          <div className="bg-background rounded-2xl border border-border p-6">
            <Building className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Corporate CSR partners</h3>
            <p className="text-sm text-muted-foreground mb-3">Donate therapy as part of your CSR programme. We provide full impact reports for your ESG reporting.</p>
            <Button asChild size="sm" variant="outline"><Link to="/for-business">Partner with us →</Link></Button>
          </div>
          <div className="bg-background rounded-2xl border border-border p-6">
            <Receipt className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Tax receipt available</h3>
            <p className="text-sm text-muted-foreground">We can provide a donation acknowledgement letter for your records — request one after donating by emailing info@innersparkafrica.com.</p>
          </div>
        </div>
      </section>

      {/* How donations are managed */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">How donations are managed</h2>
          </div>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li>• 100% of every donation funds therapy sessions — operating costs are covered separately by InnerSpark.</li>
            <li>• Recipients are identified through partner organisations (universities, refugee NGOs, low-income clinics) and our intake screening team.</li>
            <li>• Our clinical lead approves every match to ensure the right therapist–client fit.</li>
            <li>• Quarterly impact reports are published publicly and emailed to recurring donors.</li>
            <li>• Recipient identity is always kept confidential — donor names are never shared with recipients unless explicitly requested.</li>
          </ul>
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
