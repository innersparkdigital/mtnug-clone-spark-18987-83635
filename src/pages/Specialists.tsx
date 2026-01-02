import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { T } from "@/components/Translate";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Video, Phone, ExternalLink, Calendar, MessageSquare, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSpecialistImage } from "@/lib/specialistImages";
import { toast } from "sonner";
import ugandaBadge from "@/assets/uganda-badge.png";
import ghanaBadge from "@/assets/ghana-badge.png";
import botswanaBadge from "@/assets/botswana-badge.png";

interface Specialist {
  id: string;
  name: string;
  type: string;
  experience_years: number;
  price_per_hour: number;
  specialties: string[];
  languages: string[];
  available_options: string[];
  image_url: string | null;
  country: string;
  education?: string;
  certifications?: string[];
  bio?: string;
}

interface SupportCategory {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

const supportCategories: SupportCategory[] = [
  {
    id: "all",
    name: "All Categories",
    description: "Browse all mental health professionals available on our platform.",
    keywords: []
  },
  {
    id: "addiction",
    name: "Addiction & Substance Use Support",
    description: "For individuals struggling with any form of addiction, including alcohol, drugs, prescription medications, gambling, digital or behavioral addictions. Support includes relapse prevention, recovery planning, motivation, and 12-step–informed care.",
    keywords: ["addiction", "substance", "alcohol", "drug", "recovery", "detox", "gambling", "relapse", "motivational"]
  },
  {
    id: "child-adolescent",
    name: "Child & Adolescent Counseling",
    description: "Support for children and teenagers facing school challenges, behavioral concerns, emotional regulation issues, and developmental difficulties.",
    keywords: ["child", "adolescent", "children", "teen", "youth", "behavioral", "school", "developmental", "kids"]
  },
  {
    id: "trauma-stress",
    name: "Trauma & Stress Therapy",
    description: "Help for those affected by trauma, chronic stress, or PTSD using evidence-based approaches such as CBT, mindfulness, and trauma-informed care.",
    keywords: ["trauma", "ptsd", "stress", "cbt", "mindfulness", "trauma-informed", "abuse", "survivor"]
  },
  {
    id: "family-couples",
    name: "Family & Couples Counseling",
    description: "Guidance for families and couples dealing with relationship challenges, communication breakdown, parenting stress, and conflict resolution.",
    keywords: ["family", "couples", "marriage", "relationship", "parenting", "communication", "conflict", "divorce"]
  },
  {
    id: "crisis-emergency",
    name: "Crisis & Emergency Mental Health Support",
    description: "Immediate support for individuals experiencing acute emotional distress, suicidal thoughts, or mental health crises.",
    keywords: ["crisis", "emergency", "suicide", "suicidal", "self-harm", "intervention", "acute"]
  },
  {
    id: "depression-anxiety",
    name: "Depression & Anxiety Therapy",
    description: "Care for individuals experiencing depression, anxiety, panic attacks, excessive worry, or long-term low mood.",
    keywords: ["depression", "anxiety", "panic", "worry", "mood", "depressed", "anxious"]
  },
  {
    id: "grief-bereavement",
    name: "Grief & Bereavement Support",
    description: "Compassionate counseling for those coping with loss, bereavement, and emotional pain after traumatic events.",
    keywords: ["grief", "bereavement", "loss", "death", "mourning", "bereaved"]
  },
  {
    id: "relationships-intimacy",
    name: "Relationships & Intimacy Counseling",
    description: "Support around romantic relationships, communication challenges, trust issues, and sexual health concerns.",
    keywords: ["relationship", "intimacy", "romantic", "trust", "sexual", "dating", "partner"]
  },
  {
    id: "self-esteem-growth",
    name: "Self-Esteem & Personal Growth Coaching",
    description: "For individuals seeking to build confidence, improve self-worth, set life goals, and achieve personal or professional growth.",
    keywords: ["self-esteem", "confidence", "personal growth", "self-worth", "goals", "life coach", "wellness"]
  },
  {
    id: "work-stress",
    name: "Work, Stress & Occupational Therapy",
    description: "Support for work-related stress, burnout, productivity challenges, and improving mental wellbeing in professional and daily life.",
    keywords: ["work", "occupational", "burnout", "productivity", "career", "professional", "workplace", "job"]
  }
];

const countryBadges: Record<string, string> = {
  Uganda: ugandaBadge,
  Ghana: ghanaBadge,
  Botswana: botswanaBadge,
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 0,
  }).format(price);
};

const SpecialistCard = ({ specialist, isVerified }: { specialist: Specialist; isVerified: boolean }) => {
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    sessionType: "",
    notes: "",
  });

  const initials = specialist.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const imageUrl = getSpecialistImage(specialist.name, specialist.image_url);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.name.trim() || !bookingForm.phone.trim()) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    const message = `Hello, I would like to book a session with ${specialist.name}.

*Booking Details:*
- Name: ${bookingForm.name.trim()}
- Phone: ${bookingForm.phone.trim()}
- Preferred Date: ${bookingForm.preferredDate || "Flexible"}
- Preferred Time: ${bookingForm.preferredTime || "Flexible"}
- Session Type: ${bookingForm.sessionType || "Not specified"}
- Additional Notes: ${bookingForm.notes.trim() || "None"}

Please confirm availability. Thank you!`;

    window.open(
      `https://wa.me/256780570987?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    
    setBookingDialogOpen(false);
    setBookingForm({
      name: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      sessionType: "",
      notes: "",
    });
    toast.success("Redirecting to WhatsApp...");
  };

  return (
    <>
      <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0 overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={specialist.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground text-lg truncate">{specialist.name}</h3>
              {isVerified && (
                <Badge className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 text-xs px-1.5 py-0.5">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </Badge>
              )}
              {countryBadges[specialist.country] && (
                <img src={countryBadges[specialist.country]} alt={specialist.country} className="w-5 h-5 object-contain shrink-0" title={specialist.country} />
              )}
            </div>
            <Link 
              to={`/specialists/${specialist.id}`}
              className="text-primary text-sm hover:underline flex items-center gap-1"
            >
              View profile <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Experience:</span>
            <span className="font-medium text-foreground">{specialist.experience_years} Years</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium text-foreground">{formatPrice(specialist.price_per_hour)}/hr</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Specialties:</p>
          <div className="flex flex-wrap gap-1.5">
            {specialist.specialties.slice(0, 4).map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {specialist.specialties.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{specialist.specialties.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Languages:</p>
          <p className="text-sm text-foreground">{specialist.languages.join(", ")}</p>
        </div>

        <div className="mb-5">
          <p className="text-sm text-muted-foreground mb-2">Available Options:</p>
          <div className="flex gap-2">
            {specialist.available_options.includes("voice") && (
              <div className="flex items-center gap-1 text-sm text-foreground">
                <Phone className="w-4 h-4 text-primary" /> Voice
              </div>
            )}
            {specialist.available_options.includes("video") && (
              <div className="flex items-center gap-1 text-sm text-foreground">
                <Video className="w-4 h-4 text-primary" /> Video
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => setBookingDialogOpen(true)}>
            Book
          </Button>
          <Link to={`/specialists/${specialist.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Book Session with {specialist.name}
            </DialogTitle>
            <DialogDescription>
              Fill in your details and we'll connect you via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${specialist.id}`}>Your Name *</Label>
              <Input
                id={`name-${specialist.id}`}
                placeholder="Enter your full name"
                value={bookingForm.name}
                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`phone-${specialist.id}`}>Phone Number *</Label>
              <Input
                id={`phone-${specialist.id}`}
                placeholder="e.g., +256 700 000 000"
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                maxLength={20}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor={`date-${specialist.id}`}>Preferred Date</Label>
                <Input
                  id={`date-${specialist.id}`}
                  type="date"
                  value={bookingForm.preferredDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`time-${specialist.id}`}>Preferred Time</Label>
                <Input
                  id={`time-${specialist.id}`}
                  type="time"
                  value={bookingForm.preferredTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`session-type-${specialist.id}`}>Session Type</Label>
              <Select
                value={bookingForm.sessionType}
                onValueChange={(value) => setBookingForm({ ...bookingForm, sessionType: value })}
              >
                <SelectTrigger id={`session-type-${specialist.id}`}>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="voice">Voice Call</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`notes-${specialist.id}`}>Additional Notes</Label>
              <Textarea
                id={`notes-${specialist.id}`}
                placeholder="Any specific concerns or preferences..."
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                maxLength={500}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full gap-2">
              <MessageSquare className="w-4 h-4" />
              Continue to WhatsApp
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Function to match specialists to categories based on their profile
const matchSpecialistToSupportCategory = (specialist: Specialist, category: SupportCategory): boolean => {
  if (category.id === "all") return true;
  
  const searchableText = [
    specialist.type,
    specialist.bio || "",
    specialist.education || "",
    ...(specialist.certifications || []),
    ...specialist.specialties
  ].join(" ").toLowerCase();
  
  return category.keywords.some(keyword => searchableText.includes(keyword.toLowerCase()));
};

const Specialists = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [verifiedSpecialists, setVerifiedSpecialists] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const currentCategory = supportCategories.find(c => c.id === selectedCategory) || supportCategories[0];

  useEffect(() => {
    fetchSpecialists();
    fetchVerifiedSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    // Only fetch specialists with complete profiles (bio and education)
    const { data, error } = await supabase
      .from("specialists")
      .select("*")
      .eq("is_active", true)
      .not("bio", "is", null)
      .not("education", "is", null)
      .order("experience_years", { ascending: false });

    if (error) {
      console.error("Error fetching specialists:", error);
    } else {
      setSpecialists(data || []);
    }
    setLoading(false);
  };

  const fetchVerifiedSpecialists = async () => {
    const { data, error } = await supabase
      .from("specialist_certificates")
      .select("specialist_id");

    if (!error && data) {
      const verifiedIds = new Set(data.map(cert => cert.specialist_id));
      setVerifiedSpecialists(verifiedIds);
    }
  };

  const filteredSpecialists = specialists.filter((specialist) => {
    const matchesCategory = matchSpecialistToSupportCategory(specialist, currentCategory);
    const matchesSearch =
      searchQuery === "" ||
      specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialist.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      specialist.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCountry =
      selectedCountry === "" ||
      specialist.country === selectedCountry;
    return matchesCategory && matchesSearch && matchesCountry;
  });

  return (
    <>
      <Helmet>
        <title>Our Specialists - Mental Health Professionals | Innerspark Africa</title>
        <meta
          name="description"
          content="Find qualified mental health professionals including psychologists, counselors, psychiatrists, therapists, and more. Get help for depression, anxiety, trauma, relationships, and life challenges."
        />
        <meta name="keywords" content="psychologists Uganda, counselors, psychiatrists, therapists, mental health professionals, online therapy, virtual counseling Africa" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              <T>Find Your</T> <span className="text-primary"><T>Mental Health Professional</T></span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              <T>Browse our network of qualified professionals including psychologists, counselors, psychiatrists, and specialized therapists. Find the right expert for your unique needs.</T>
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b border-border bg-card/50">
          <div className="container mx-auto px-4">
            {/* Search and Country Filter */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCountry || "all"} onValueChange={(val) => setSelectedCountry(val === "all" ? "" : val)}>
                <SelectTrigger className="w-[160px] bg-background">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="Uganda">
                    <span className="flex items-center gap-2">
                      <img src={ugandaBadge} alt="Uganda" className="w-4 h-4" />
                      Uganda
                    </span>
                  </SelectItem>
                  <SelectItem value="Ghana">
                    <span className="flex items-center gap-2">
                      <img src={ghanaBadge} alt="Ghana" className="w-4 h-4" />
                      Ghana
                    </span>
                  </SelectItem>
                  <SelectItem value="Botswana">
                    <span className="flex items-center gap-2">
                      <img src={botswanaBadge} alt="Botswana" className="w-4 h-4" />
                      Botswana
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Support Category Cards */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-3 block">Browse by Support Category</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {supportCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedCategory === category.id
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <div className="font-semibold text-sm text-foreground mb-1">{category.name}</div>
                    {category.id !== "all" && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Description Card */}
            {currentCategory && currentCategory.id !== "all" && (
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 mb-6 border border-primary/20">
                <h2 className="font-bold text-xl text-foreground mb-3">{currentCategory.name}</h2>
                <p className="text-muted-foreground">{currentCategory.description}</p>
              </div>
            )}

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredSpecialists.length} professional{filteredSpecialists.length !== 1 ? 's' : ''}
              {selectedCategory !== "all" && ` in ${currentCategory.name}`}
              {selectedCountry && ` from ${selectedCountry}`}
            </p>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-pulse text-muted-foreground">Loading specialists...</div>
              </div>
            ) : (
              <>
                {/* Specialists Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSpecialists.map((specialist) => (
                    <SpecialistCard key={specialist.id} specialist={specialist} isVerified={verifiedSpecialists.has(specialist.id)} />
                  ))}
                </div>

                {filteredSpecialists.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No specialists found matching your criteria.</p>
                <Button variant="outline" onClick={() => { setSelectedCategory("all"); setSearchQuery(""); setSelectedCountry(""); }}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Start Your Mental Health Journey Today
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Download our app to match with an affordable, vetted professional in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a
                  href="https://wa.me/256780570987?text=Hi%2C%20I%20would%20like%20to%20book%20a%20therapy%20session"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a Session
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Specialists;
