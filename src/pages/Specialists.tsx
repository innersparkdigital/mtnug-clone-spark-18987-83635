import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { T } from "@/components/Translate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Search, Video, Phone, ExternalLink, CheckCircle,
  Pill, Baby, Brain, Users, AlertTriangle, CloudRain, Heart, Handshake, Sparkles, Briefcase, LayoutGrid
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSpecialistImage } from "@/lib/specialistImages";
import PreAssessmentModal from "@/components/PreAssessmentModal";
import BookingFormModal from "@/components/BookingFormModal";
import { useBookingFlow } from "@/hooks/useBookingFlow";
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
  shortName: string;
  icon: React.ElementType;
  description: string;
  lookingFor: string[];
  conditions: string[];
  keywords: string[];
}

const supportCategories: SupportCategory[] = [
  {
    id: "all",
    name: "All Categories",
    shortName: "All",
    icon: LayoutGrid,
    description: "Browse all mental health professionals available on our platform.",
    lookingFor: [],
    conditions: [],
    keywords: []
  },
  {
    id: "addiction",
    name: "Addiction & Substance Use Support",
    shortName: "Addiction",
    icon: Pill,
    description: "For individuals struggling with any form of addiction, including alcohol, drugs, prescription medications, gambling, digital or behavioral addictions. Support includes relapse prevention, recovery planning, motivation, and 12-step–informed care.",
    lookingFor: [
      "Help to stop or reduce substance use",
      "Relapse prevention strategies",
      "Recovery planning and motivation",
      "12-step or alternative recovery approaches",
      "Support for behavioral addictions (gambling, gaming, internet)"
    ],
    conditions: ["Alcohol Addiction", "Drug Addiction", "Prescription Drug Abuse", "Gambling Addiction", "Internet/Gaming Addiction", "Sex Addiction", "Food Addiction", "Nicotine Dependence"],
    keywords: ["addiction", "substance", "alcohol", "drug", "recovery", "detox", "gambling", "relapse", "motivational"]
  },
  {
    id: "child-adolescent",
    name: "Child & Adolescent Counseling",
    shortName: "Child & Teen",
    icon: Baby,
    description: "Support for children and teenagers facing school challenges, behavioral concerns, emotional regulation issues, and developmental difficulties.",
    lookingFor: [
      "Help with school-related challenges",
      "Behavioral management support",
      "Emotional regulation techniques",
      "Social skills development",
      "Support during family transitions"
    ],
    conditions: ["ADHD", "Learning Disabilities", "Bullying", "School Anxiety", "Behavioral Disorders", "Autism Spectrum", "Childhood Depression", "Teen Anxiety", "Social Difficulties"],
    keywords: ["child", "adolescent", "children", "teen", "youth", "behavioral", "school", "developmental", "kids"]
  },
  {
    id: "trauma-stress",
    name: "Trauma & Stress Therapy",
    shortName: "Trauma",
    icon: Brain,
    description: "Help for those affected by trauma, chronic stress, or PTSD using evidence-based approaches such as CBT, mindfulness, and trauma-informed care.",
    lookingFor: [
      "Processing traumatic experiences",
      "PTSD symptom management",
      "Coping with chronic stress",
      "Healing from abuse or violence",
      "Recovery from accidents or disasters"
    ],
    conditions: ["PTSD", "Complex Trauma", "Childhood Trauma", "Sexual Abuse", "Domestic Violence", "Accident Trauma", "War/Conflict Trauma", "Chronic Stress Disorder"],
    keywords: ["trauma", "ptsd", "stress", "cbt", "mindfulness", "trauma-informed", "abuse", "survivor"]
  },
  {
    id: "family-couples",
    name: "Family & Couples Counseling",
    shortName: "Family & Couples",
    icon: Users,
    description: "Guidance for families and couples dealing with relationship challenges, communication breakdown, parenting stress, and conflict resolution.",
    lookingFor: [
      "Improving couple communication",
      "Resolving family conflicts",
      "Parenting guidance and support",
      "Blended family adjustment",
      "Pre-marital counseling"
    ],
    conditions: ["Marital Conflict", "Communication Breakdown", "Parenting Challenges", "Divorce/Separation", "Infidelity Recovery", "Blended Family Issues", "Parent-Child Conflict", "Co-Parenting Difficulties"],
    keywords: ["family", "couples", "marriage", "relationship", "parenting", "communication", "conflict", "divorce"]
  },
  {
    id: "crisis-emergency",
    name: "Crisis & Emergency Mental Health Support",
    shortName: "Crisis",
    icon: AlertTriangle,
    description: "Immediate support for individuals experiencing acute emotional distress, suicidal thoughts, or mental health crises.",
    lookingFor: [
      "Immediate emotional support",
      "Suicidal thoughts intervention",
      "Crisis stabilization",
      "Safety planning",
      "Urgent mental health care"
    ],
    conditions: ["Suicidal Ideation", "Self-Harm", "Acute Anxiety Attacks", "Psychotic Episodes", "Severe Depression", "Emotional Breakdown", "Acute Grief", "Mental Health Emergency"],
    keywords: ["crisis", "emergency", "suicide", "suicidal", "self-harm", "intervention", "acute"]
  },
  {
    id: "depression-anxiety",
    name: "Depression & Anxiety Therapy",
    shortName: "Depression & Anxiety",
    icon: CloudRain,
    description: "Care for individuals experiencing depression, anxiety, panic attacks, excessive worry, or long-term low mood.",
    lookingFor: [
      "Managing depressive symptoms",
      "Reducing anxiety and worry",
      "Panic attack prevention",
      "Mood regulation techniques",
      "Building emotional resilience"
    ],
    conditions: ["Major Depression", "Generalized Anxiety", "Panic Disorder", "Social Anxiety", "Phobias", "OCD", "Dysthymia", "Seasonal Affective Disorder", "Health Anxiety"],
    keywords: ["depression", "anxiety", "panic", "worry", "mood", "depressed", "anxious"]
  },
  {
    id: "grief-bereavement",
    name: "Grief & Bereavement Support",
    shortName: "Grief",
    icon: Heart,
    description: "Compassionate counseling for those coping with loss, bereavement, and emotional pain after traumatic events.",
    lookingFor: [
      "Processing the loss of a loved one",
      "Coping with sudden death",
      "Managing complicated grief",
      "Finding meaning after loss",
      "Support through mourning stages"
    ],
    conditions: ["Loss of Spouse/Partner", "Loss of Parent", "Loss of Child", "Pregnancy Loss", "Pet Loss", "Anticipatory Grief", "Complicated Grief", "Traumatic Loss"],
    keywords: ["grief", "bereavement", "loss", "death", "mourning", "bereaved"]
  },
  {
    id: "relationships-intimacy",
    name: "Relationships & Intimacy Counseling",
    shortName: "Relationships",
    icon: Handshake,
    description: "Support around romantic relationships, communication challenges, trust issues, and sexual health concerns.",
    lookingFor: [
      "Improving relationship patterns",
      "Building trust and intimacy",
      "Addressing sexual concerns",
      "Navigating dating challenges",
      "Healing from relationship trauma"
    ],
    conditions: ["Relationship Anxiety", "Intimacy Issues", "Trust Issues", "Dating Difficulties", "Sexual Dysfunction", "Attachment Issues", "Codependency", "Relationship Trauma"],
    keywords: ["relationship", "intimacy", "romantic", "trust", "sexual", "dating", "partner"]
  },
  {
    id: "self-esteem-growth",
    name: "Self-Esteem & Personal Growth Coaching",
    shortName: "Self-Esteem",
    icon: Sparkles,
    description: "For individuals seeking to build confidence, improve self-worth, set life goals, and achieve personal or professional growth.",
    lookingFor: [
      "Building self-confidence",
      "Overcoming limiting beliefs",
      "Setting and achieving life goals",
      "Career development support",
      "Personal transformation"
    ],
    conditions: ["Low Self-Esteem", "Imposter Syndrome", "Perfectionism", "People-Pleasing", "Identity Issues", "Life Transitions", "Career Confusion", "Motivation Challenges"],
    keywords: ["self-esteem", "confidence", "personal growth", "self-worth", "goals", "life coach", "wellness"]
  },
  {
    id: "work-stress",
    name: "Work, Stress & Occupational Therapy",
    shortName: "Work Stress",
    icon: Briefcase,
    description: "Support for work-related stress, burnout, productivity challenges, and improving mental wellbeing in professional and daily life.",
    lookingFor: [
      "Managing workplace stress",
      "Preventing or recovering from burnout",
      "Work-life balance strategies",
      "Career decision support",
      "Workplace conflict resolution"
    ],
    conditions: ["Work Burnout", "Job Stress", "Workplace Anxiety", "Career Burnout", "Work-Life Imbalance", "Job Loss Stress", "Workplace Bullying", "Performance Anxiety"],
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

// Context for booking flow - passed from parent
interface SpecialistCardProps {
  specialist: Specialist;
  isVerified: boolean;
  onBookClick: () => void;
}

const SpecialistCard = ({ specialist, isVerified, onBookClick }: SpecialistCardProps) => {
  const primaryCategory = getSpecialistPrimaryCategory(specialist.name);

  const initials = specialist.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const imageUrl = getSpecialistImage(specialist.name, specialist.image_url);

  return (
      <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0 overflow-hidden border-2 border-primary/20">
            {imageUrl ? (
              <img src={imageUrl} alt={specialist.name} className="w-full h-full object-cover object-top" loading="lazy" />
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
              {primaryCategory && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs px-1.5 py-0.5 border-primary/50 text-primary">
                  <primaryCategory.icon className="w-3 h-3" />
                  {primaryCategory.shortName}
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
          <Button className="flex-1" onClick={onBookClick}>
            Book
          </Button>
          <Link to={`/specialists/${specialist.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
  );
};

// Explicit category assignments for specialists
const specialistCategoryAssignments: Record<string, string[]> = {
  "Julius Kizito": ["addiction"],
  "Nassuuna Margret": ["addiction"],
  "Mubiru Rashid": ["addiction"],
  "Atwiine Priscilla": ["trauma-stress"],
  "Winnie Anzazi Jira": ["trauma-stress"],
  // New specialists
  "Leonard Ogugu": ["work-stress"],
  "Leah Wanjiru Muiruri": ["self-esteem-growth"],
  "Boingotlo Moremi": ["relationships-intimacy", "family-couples"],
  "Mbabazi Jovia": ["relationships-intimacy"],
  "Esther Murungi": ["depression-anxiety"],
  "Zemeyi Rita": ["family-couples", "grief-bereavement"],
  "Florence Winfred Nakaweesa": ["child-adolescent"],
};

// Get primary category for a specialist
const getSpecialistPrimaryCategory = (specialistName: string): SupportCategory | null => {
  const categoryIds = specialistCategoryAssignments[specialistName];
  if (categoryIds && categoryIds.length > 0) {
    return supportCategories.find(c => c.id === categoryIds[0]) || null;
  }
  return null;
};

// Function to match specialists to categories based on their profile
const matchSpecialistToSupportCategory = (specialist: Specialist, category: SupportCategory): boolean => {
  if (category.id === "all") return true;
  
  // Check explicit assignments first
  const explicitCategories = specialistCategoryAssignments[specialist.name];
  if (explicitCategories) {
    return explicitCategories.includes(category.id);
  }
  
  // Fallback to keyword matching for specialists without explicit assignments
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
  const [bookingSpecialist, setBookingSpecialist] = useState<Specialist | null>(null);

  const {
    startBooking,
    closeFlow,
    resetFlow,
    isAssessmentModalOpen,
    isBookingFormOpen,
    actionType
  } = useBookingFlow();

  const handleSpecialistBook = (specialist: Specialist) => {
    setBookingSpecialist(specialist);
    startBooking();
  };

  const currentCategory = supportCategories.find(c => c.id === selectedCategory) || supportCategories[0];

  useEffect(() => {
    const fetchData = async () => {
      // Fetch specialists and certificates in parallel for faster loading
      const [specialistsResult, certificatesResult] = await Promise.all([
        supabase
          .from("specialists")
          .select("*")
          .eq("is_active", true)
          .not("bio", "is", null)
          .not("education", "is", null)
          .order("experience_years", { ascending: false }),
        supabase
          .from("specialist_certificates")
          .select("specialist_id")
      ]);

      if (specialistsResult.error) {
        console.error("Error fetching specialists:", specialistsResult.error);
      } else {
        setSpecialists(specialistsResult.data || []);
      }

      if (!certificatesResult.error && certificatesResult.data) {
        const verifiedIds = new Set(certificatesResult.data.map(cert => cert.specialist_id));
        setVerifiedSpecialists(verifiedIds);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

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
        <title>Find a Therapist Online - Book Licensed Therapists Today | Innerspark Africa</title>
        <meta
          name="description"
          content="Find and book licensed therapists online today. Browse our network of verified counselors & psychologists. Get help for depression, anxiety, trauma & more. Affordable rates from $20. Book now!"
        />
        <meta name="keywords" content="find therapist online, book therapist, find therapist near me, online therapist, licensed therapists, psychologists, counselors, mental health professionals, online therapy, virtual counseling, therapist directory, book a therapist, affordable therapy, licensed counselors, depression therapist, anxiety counselor, trauma specialist, relationship counselor" />
        <link rel="canonical" href="https://www.innersparkafrica.com/specialists" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Find a Therapist Online - Book Today | Innerspark" />
        <meta property="og:description" content="Browse our network of licensed therapists, counselors & psychologists. Find the right mental health professional. Book online sessions today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/specialists" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Find a Therapist Online | Innerspark Africa" />
        <meta name="twitter:description" content="Find licensed therapists & counselors. Book affordable online therapy for depression, anxiety, trauma & more." />
        
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            "name": "Find a Therapist Online - Mental Health Professionals Directory",
            "description": "Browse and book sessions with licensed therapists, counselors, and psychologists. Available globally.",
            "url": "https://www.innersparkafrica.com/specialists",
            "specialty": "Psychiatry",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Mental Health Professionals",
              "description": "Directory of licensed therapists, counselors, and psychologists",
              "numberOfItems": 15
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.innersparkafrica.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Find a Therapist",
                "item": "https://www.innersparkafrica.com/specialists"
              }
            ]
          })}
        </script>
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
              <div className="flex flex-wrap gap-3">
                {supportCategories.map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                        isSelected
                          ? "border-primary bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                          : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:shadow-md hover:scale-[1.01]"
                      }`}
                    >
                      <span className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300 ${
                        isSelected 
                          ? "bg-white/20" 
                          : "bg-primary/10 group-hover:bg-primary/20"
                      }`}>
                        <IconComponent className={`w-4 h-4 transition-colors duration-300 ${
                          isSelected ? "text-primary-foreground" : "text-primary"
                        }`} />
                      </span>
                      <span className="whitespace-nowrap">{category.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Description Card */}
            {selectedCategory !== "all" && currentCategory && (
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 mb-6 border border-primary/20">
                <h2 className="font-bold text-xl text-foreground mb-3">{currentCategory.name}</h2>
                <p className="text-muted-foreground mb-4">{currentCategory.description}</p>
                
                {currentCategory.lookingFor.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-foreground mb-2">What You're Looking For:</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentCategory.lookingFor.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {currentCategory.conditions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Conditions Managed:</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentCategory.conditions.map((condition, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredSpecialists.length} professional{filteredSpecialists.length !== 1 ? 's' : ''}
              {selectedCategory !== "all" && ` in ${currentCategory.name}`}
              {selectedCountry && ` from ${selectedCountry}`}
            </p>

            {/* Loading State with Skeleton Cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-lg bg-muted"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <div className="h-5 bg-muted rounded w-16"></div>
                      <div className="h-5 bg-muted rounded w-20"></div>
                      <div className="h-5 bg-muted rounded w-14"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-10 bg-muted rounded flex-1"></div>
                      <div className="h-10 bg-muted rounded flex-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Specialists Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSpecialists.map((specialist) => (
                    <SpecialistCard 
                      key={specialist.id} 
                      specialist={specialist} 
                      isVerified={verifiedSpecialists.has(specialist.id)}
                      onBookClick={() => handleSpecialistBook(specialist)}
                    />
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
                  href="https://wa.me/256792085773?text=Hi%2C%20I%20would%20like%20to%20book%20a%20therapy%20session"
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

      {/* Pre-Assessment Modal */}
      <PreAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => {
          closeFlow();
          setBookingSpecialist(null);
        }}
        actionType={actionType}
        specialist={bookingSpecialist ? {
          id: bookingSpecialist.id,
          name: bookingSpecialist.name,
          type: bookingSpecialist.type,
          specialties: bookingSpecialist.specialties,
          experience_years: bookingSpecialist.experience_years,
          price_per_hour: bookingSpecialist.price_per_hour,
          image_url: bookingSpecialist.image_url,
          bio: bookingSpecialist.bio || null,
        } : null}
      />

      {/* Booking Form Modal */}
      <BookingFormModal
        isOpen={isBookingFormOpen}
        onClose={resetFlow}
        formType={actionType}
      />
    </>
  );
};

export default Specialists;
