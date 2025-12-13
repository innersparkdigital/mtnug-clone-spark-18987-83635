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
import { Search, Video, Phone, ExternalLink, Calendar, MessageSquare, CheckCircle, ChevronDown, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSpecialistImage } from "@/lib/specialistImages";
import { toast } from "sonner";
import ugandaBadge from "@/assets/uganda-badge.png";
import ghanaBadge from "@/assets/ghana-badge.png";
import botswanaBadge from "@/assets/botswana-badge.png";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

interface ProfessionalCategory {
  id: string;
  name: string;
  description: string;
  qualifications: string;
  conditions: string[];
  commonQuestions: string[];
  keywords: string[];
}

interface PricingTier {
  id: string;
  name: string;
  label: string;
  description: string;
  priceRange: { min: number; max: number };
  whoFits: string[];
}

const pricingTiers: PricingTier[] = [
  {
    id: "all",
    name: "All Price Ranges",
    label: "All",
    description: "Browse all professionals across all pricing levels",
    priceRange: { min: 0, max: Infinity },
    whoFits: []
  },
  {
    id: "affordable",
    name: "Affordable Emotional Support",
    label: "10K - 30K UGX",
    description: "Entry-level support from peer specialists and certificate counsellors with up to 2 years experience",
    priceRange: { min: 10000, max: 30000 },
    whoFits: ["Peer Support Specialists", "Certificate Counsellors", "< 2 years experience"]
  },
  {
    id: "professional",
    name: "Professional Counselling",
    label: "30K - 80K UGX",
    description: "Mid-level practitioners including diploma/bachelor counsellors, social workers, and psychiatric nurses with 2-5 years experience",
    priceRange: { min: 30001, max: 80000 },
    whoFits: ["Diploma/Bachelor Counsellors", "Social Workers", "Psychiatric Nurses", "2-5 years experience"]
  },
  {
    id: "advanced",
    name: "Advanced Therapy",
    label: "80K - 150K UGX",
    description: "Senior professionals including Master's-level psychologists and counselling psychologists with 5+ years experience",
    priceRange: { min: 80001, max: 150000 },
    whoFits: ["Master's-level Psychologists", "Counselling Psychologists", "5+ years experience"]
  },
  {
    id: "specialist",
    name: "Specialist Psychiatric Care",
    label: "150K - 300K UGX",
    description: "Medical specialists including psychiatrists and medical doctors with psychiatry training",
    priceRange: { min: 150001, max: 300000 },
    whoFits: ["Psychiatrists", "Medical Doctors with Psychiatry training"]
  }
];

const professionalCategories: ProfessionalCategory[] = [
  {
    id: "all",
    name: "All Professionals",
    description: "Browse all mental health professionals available on our platform.",
    qualifications: "Various qualifications across different specializations.",
    conditions: [],
    commonQuestions: [],
    keywords: []
  },
  {
    id: "clinical-psychologist",
    name: "Clinical Psychologists",
    description: "Work with depression, anxiety, PTSD, and other mental disorders, helping people cope and improve mental functioning.",
    qualifications: "Master's or PhD in Clinical Psychology",
    conditions: ["Depression", "Anxiety disorders", "PTSD", "Personality disorders", "Severe mental illness"],
    commonQuestions: ["Why do I feel sad all the time?", "How do I know if I have depression?", "Can therapy help with trauma?"],
    keywords: ["clinical psychology", "phd", "master's psychology", "depression", "anxiety", "ptsd"]
  },
  {
    id: "counselling-psychologist",
    name: "Counselling Psychologists",
    description: "Help with emotional stress, relationship problems, grief, and life changes.",
    qualifications: "Bachelor's or Master's in Counselling Psychology",
    conditions: ["Emotional stress", "Relationship problems", "Grief", "Life transitions", "Self-esteem issues"],
    commonQuestions: ["How do I cope with a breakup?", "Why can't I move on from loss?", "How do I handle major life changes?"],
    keywords: ["counselling psychology", "counseling psychology", "bachelor psychology", "relationship", "grief"]
  },
  {
    id: "psychotherapist",
    name: "Psychotherapists",
    description: "Treat depression, anxiety, trauma, phobias, and obsessive behaviors using therapy techniques like CBT, DBT, or trauma-focused therapy.",
    qualifications: "Training/certification in specific therapy approaches (CBT, DBT, etc.)",
    conditions: ["Depression", "Anxiety", "Trauma", "Phobias", "OCD", "Obsessive behaviors"],
    commonQuestions: ["What is CBT and how does it work?", "Can therapy cure my anxiety?", "How long does psychotherapy take?"],
    keywords: ["psychotherapist", "cbt", "dbt", "trauma therapy", "phobia"]
  },
  {
    id: "psychiatric-nurse",
    name: "Psychiatric Nurses / Clinical Officers",
    description: "Work with severe mental illness such as schizophrenia or bipolar disorder, often in hospital or clinical settings.",
    qualifications: "Nursing degree with psychiatric specialization, or Clinical Officer with psychiatry training",
    conditions: ["Schizophrenia", "Bipolar disorder", "Severe mental illness", "Psychosis"],
    commonQuestions: ["What are the signs of bipolar disorder?", "How is schizophrenia treated?", "Do I need hospitalization?"],
    keywords: ["psychiatric nurse", "clinical officer", "psychiatry training", "nursing", "schizophrenia", "bipolar"]
  },
  {
    id: "psychiatrist",
    name: "Psychiatrists",
    description: "Diagnose and treat serious mental disorders with medication and therapy, including psychosis, bipolar disorder, and severe anxiety.",
    qualifications: "Medical degree (MBChB/MD) plus Masters in Psychiatry",
    conditions: ["Psychosis", "Bipolar disorder", "Severe anxiety", "Major depression", "Medication management"],
    commonQuestions: ["Do I need medication for my condition?", "What's the difference between a psychiatrist and psychologist?", "Can mental illness be cured?"],
    keywords: ["psychiatrist", "mbchb", "md", "medical doctor", "psychiatry", "medication"]
  },
  {
    id: "addiction-counsellor",
    name: "Addiction Counsellors / Substance Use Specialists",
    description: "Support individuals struggling with alcohol, drugs, or behavioral addictions and guide recovery.",
    qualifications: "Certification in addiction counseling, motivational interviewing, or detox support",
    conditions: ["Alcohol addiction", "Drug addiction", "Behavioral addictions", "Recovery support", "Relapse prevention"],
    commonQuestions: ["Am I addicted?", "How do I quit drinking?", "What is the first step to recovery?"],
    keywords: ["addiction", "substance", "alcohol", "drug", "recovery", "detox", "motivational interviewing"]
  },
  {
    id: "social-worker",
    name: "Social Workers / Psychosocial Support",
    description: "Assist in crisis situations, child protection, domestic violence cases, and community wellbeing.",
    qualifications: "Bachelor's or Master's in Social Work or related field",
    conditions: ["Crisis situations", "Child protection", "Domestic violence", "Community support", "Family welfare"],
    commonQuestions: ["Where can I get help for domestic violence?", "How do I report child abuse?", "What support is available for my family?"],
    keywords: ["social work", "psychosocial", "child protection", "domestic violence", "community"]
  },
  {
    id: "child-psychologist",
    name: "Child & Adolescent Counselors / Psychologists",
    description: "Address behavioral problems, trauma, school difficulties, and emotional challenges in children and teens.",
    qualifications: "Master's in Child Psychology, Counseling, or related field",
    conditions: ["Behavioral problems", "Childhood trauma", "School difficulties", "ADHD", "Teen depression", "Anxiety in children"],
    commonQuestions: ["Why is my child acting out?", "How do I help my teenager with anxiety?", "Is my child's behavior normal?"],
    keywords: ["child psychology", "adolescent", "children", "teen", "youth", "behavioral", "school"]
  },
  {
    id: "family-therapist",
    name: "Family & Marriage Therapists",
    description: "Help couples and families improve communication, resolve conflicts, and strengthen relationships.",
    qualifications: "Certification or Master's in Family/Marriage Therapy",
    conditions: ["Marriage problems", "Family conflicts", "Communication issues", "Divorce", "Blended families"],
    commonQuestions: ["Can couples therapy save my marriage?", "How do we communicate better?", "Should we stay together for the kids?"],
    keywords: ["family therapy", "marriage", "couples", "relationship", "communication", "conflict"]
  },
  {
    id: "trauma-practitioner",
    name: "Trauma-Informed Practitioners",
    description: "Work with people recovering from trauma, abuse, accidents, or violence.",
    qualifications: "Certification in Trauma-Informed Care (TIC), TF-CBT, or survivor support programs",
    conditions: ["Trauma recovery", "Abuse survivors", "Accident trauma", "Violence survivors", "PTSD"],
    commonQuestions: ["How do I heal from trauma?", "Will I ever feel normal again?", "Why do I have flashbacks?"],
    keywords: ["trauma", "abuse", "survivor", "tf-cbt", "trauma-informed", "violence"]
  },
  {
    id: "school-counsellor",
    name: "School Guidance Counselors",
    description: "Support students with academic challenges, career guidance, personal issues, and school adjustment.",
    qualifications: "Degree in Educational Psychology, Counseling, or related field",
    conditions: ["Academic challenges", "Career guidance", "School adjustment", "Bullying", "Student stress"],
    commonQuestions: ["What career should I choose?", "How do I deal with exam stress?", "My child is being bullied, what do I do?"],
    keywords: ["school", "guidance", "education", "academic", "career", "student"]
  },
  {
    id: "occupational-therapist",
    name: "Occupational Therapists (Mental Health)",
    description: "Help people regain daily life skills affected by mental illness, trauma, or disability.",
    qualifications: "Bachelor's or Master's in Occupational Therapy",
    conditions: ["Daily living skills", "Mental illness recovery", "Disability support", "Work rehabilitation"],
    commonQuestions: ["How can I get back to normal life?", "What activities can help my recovery?", "How do I manage daily tasks with my condition?"],
    keywords: ["occupational therapy", "daily living", "rehabilitation", "disability"]
  },
  {
    id: "behavioural-therapist",
    name: "Behavioural Therapists",
    description: "Focus on changing harmful behaviors such as aggression, compulsions, or bad habits in children and adults.",
    qualifications: "Certification in Behavioral Therapy; Psychology degree preferred",
    conditions: ["Aggression", "Compulsive behaviors", "Bad habits", "Behavioral disorders", "Anger management"],
    commonQuestions: ["How do I control my anger?", "Why can't I stop my bad habits?", "Can behavior therapy help my child?"],
    keywords: ["behavioral therapy", "behaviour", "aggression", "habits", "anger", "compulsive"]
  },
  {
    id: "peer-support",
    name: "Peer Support Specialists / Recovery Coaches",
    description: "Guide and support others through recovery by sharing lived experience.",
    qualifications: "Certification in peer support or recovery coaching",
    conditions: ["Recovery support", "Peer mentoring", "Lived experience support", "Community recovery"],
    commonQuestions: ["How did you overcome your challenges?", "Can someone who's been through this help me?", "What is peer support?"],
    keywords: ["peer support", "recovery coach", "lived experience", "peer"]
  },
  {
    id: "life-coach",
    name: "Life / Wellness Coaches",
    description: "Support stress management, personal growth, life balance, and healthy habits.",
    qualifications: "Certified Life Coach or Wellness Coach programs",
    conditions: ["Stress management", "Personal growth", "Life balance", "Goal setting", "Healthy habits"],
    commonQuestions: ["How do I achieve work-life balance?", "What are my life goals?", "How do I develop better habits?"],
    keywords: ["life coach", "wellness coach", "personal growth", "stress management", "goals"]
  },
  {
    id: "program-manager",
    name: "Mental Health Program Managers",
    description: "Oversee mental health programs in communities or organizations and ensure proper care delivery.",
    qualifications: "Degree in Public Health, Psychology, Social Work, or related field",
    conditions: ["Program development", "Community mental health", "Organizational wellness", "Care coordination"],
    commonQuestions: ["How do I set up a mental health program?", "What resources are available for communities?"],
    keywords: ["program manager", "public health", "community", "organizational", "mhpss"]
  },
  {
    id: "crisis-counsellor",
    name: "Crisis Counselors / Suicide Prevention Specialists",
    description: "Provide immediate support to people in crisis, suicidal thoughts, or emergencies.",
    qualifications: "Certification in crisis counseling, suicide prevention, or mental health",
    conditions: ["Crisis intervention", "Suicidal thoughts", "Emergency support", "Self-harm"],
    commonQuestions: ["I'm having suicidal thoughts, what do I do?", "How do I help someone in crisis?", "Is there hope for me?"],
    keywords: ["crisis", "suicide prevention", "emergency", "self-harm", "intervention"]
  },
  {
    id: "rehabilitation-counsellor",
    name: "Rehabilitation Counselors",
    description: "Help people recovering from injury, illness, or long-term disability regain independence.",
    qualifications: "Master's in Rehabilitation Counseling or related field",
    conditions: ["Injury recovery", "Illness recovery", "Disability independence", "Vocational rehabilitation"],
    commonQuestions: ["How do I get back to work after my illness?", "Can I live independently again?", "What support is available for my disability?"],
    keywords: ["rehabilitation", "injury", "disability", "vocational", "recovery"]
  },
  {
    id: "neuropsychologist",
    name: "Neuropsychologists",
    description: "Assess and treat cognitive or brain-related problems like memory loss, attention difficulties, or effects of brain injury.",
    qualifications: "Master's or PhD in Neuropsychology or Clinical Neuropsychology",
    conditions: ["Memory loss", "Attention difficulties", "Brain injury", "Cognitive problems", "Dementia"],
    commonQuestions: ["Why am I forgetting things?", "Did my head injury affect my brain?", "Can cognitive problems be treated?"],
    keywords: ["neuropsychology", "brain", "memory", "cognitive", "attention", "dementia"]
  },
  {
    id: "counsellor",
    name: "Counsellors",
    description: "Help people cope with emotional, behavioral, and personal issues. They provide support for stress, grief, relationship problems, life transitions, low self-esteem, and everyday mental health challenges.",
    qualifications: "Bachelor's or Master's in Counselling, Psychology, or related fields, often with additional certification in counseling skills",
    conditions: ["Stress", "Grief", "Relationship problems", "Life transitions", "Low self-esteem", "Everyday challenges"],
    commonQuestions: ["How do I deal with stress?", "Why do I feel so down?", "How can I improve my self-esteem?"],
    keywords: ["counsellor", "counselor", "counselling", "counseling", "stress", "grief", "self-esteem"]
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
const matchSpecialistToCategory = (specialist: Specialist, category: ProfessionalCategory): boolean => {
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
  const [selectedPricingTier, setSelectedPricingTier] = useState("all");
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [verifiedSpecialists, setVerifiedSpecialists] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);

  const currentCategory = professionalCategories.find(c => c.id === selectedCategory) || professionalCategories[0];
  const currentPricingTier = pricingTiers.find(t => t.id === selectedPricingTier) || pricingTiers[0];

  useEffect(() => {
    fetchSpecialists();
    fetchVerifiedSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    const { data, error } = await supabase
      .from("specialists")
      .select("*")
      .eq("is_active", true)
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
    const matchesCategory = matchSpecialistToCategory(specialist, currentCategory);
    const matchesSearch =
      searchQuery === "" ||
      specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialist.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      specialist.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCountry =
      selectedCountry === "" ||
      specialist.country === selectedCountry;
    const matchesPricingTier =
      selectedPricingTier === "all" ||
      (specialist.price_per_hour >= currentPricingTier.priceRange.min &&
       specialist.price_per_hour <= currentPricingTier.priceRange.max);
    return matchesCategory && matchesSearch && matchesCountry && matchesPricingTier;
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

            {/* Pricing Tier Cards */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-3 block">Filter by Affordability</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {pricingTiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedPricingTier(tier.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedPricingTier === tier.id
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <div className="font-semibold text-sm text-foreground mb-1">{tier.name}</div>
                    {tier.id !== "all" && (
                      <div className="text-xs text-primary font-medium">{tier.label}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Pricing Tier Info */}
            {currentPricingTier && currentPricingTier.id !== "all" && (
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 mb-6 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <span className="text-green-600 font-bold text-sm">💰</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{currentPricingTier.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{currentPricingTier.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentPricingTier.whoFits.map((fit, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                          {fit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Dropdown */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Select Professional Type</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[400px] bg-background">
                  <SelectValue placeholder="All Professionals" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50 max-h-[400px]">
                  {professionalCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Description Card */}
            {currentCategory && currentCategory.id !== "all" && (
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 mb-6 border border-primary/20">
                <h2 className="font-bold text-xl text-foreground mb-3">{currentCategory.name}</h2>
                <p className="text-muted-foreground mb-4">{currentCategory.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-2">Qualifications</h3>
                    <p className="text-sm text-muted-foreground">{currentCategory.qualifications}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-2">Conditions They Help With</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCategory.conditions.slice(0, 5).map((condition, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {currentCategory.commonQuestions.length > 0 && (
                  <Collapsible open={showQuestions} onOpenChange={setShowQuestions}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary/80">
                        <HelpCircle className="w-4 h-4" />
                        Common questions people ask
                        <ChevronDown className={`w-4 h-4 transition-transform ${showQuestions ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      <ul className="space-y-2">
                        {currentCategory.commonQuestions.map((question, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            "{question}"
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                )}
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
                <Button variant="outline" onClick={() => { setSelectedCategory("all"); setSearchQuery(""); setSelectedCountry(""); setSelectedPricingTier("all"); }}>
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
