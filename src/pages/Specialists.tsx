import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Video, Phone, ExternalLink } from "lucide-react";

interface Specialist {
  id: string;
  name: string;
  type: "therapist" | "psychotherapist" | "counselor";
  experience: number;
  pricePerHour: number;
  specialties: string[];
  languages: string[];
  availableOptions: ("voice" | "video")[];
  imageUrl?: string;
}

const specialists: Specialist[] = [
  {
    id: "1",
    name: "Dr. Sarah Nakamya",
    type: "therapist",
    experience: 8,
    pricePerHour: 100000,
    specialties: ["Anxiety", "Depression", "Trauma", "Relationship Issues", "Workplace Mental Health"],
    languages: ["English", "Luganda"],
    availableOptions: ["voice", "video"],
  },
  {
    id: "2",
    name: "James Okello",
    type: "counselor",
    experience: 5,
    pricePerHour: 75000,
    specialties: ["Grief", "Family Therapy", "Addiction", "Stress Management"],
    languages: ["English", "Luo"],
    availableOptions: ["voice", "video"],
  },
  {
    id: "3",
    name: "Dr. Grace Tumusiime",
    type: "psychotherapist",
    experience: 12,
    pricePerHour: 150000,
    specialties: ["PTSD", "Bipolar Disorder", "Schizophrenia", "Personality Disorders", "Clinical Assessment"],
    languages: ["English", "Runyankole"],
    availableOptions: ["voice", "video"],
  },
  {
    id: "4",
    name: "Emmanuel Wasswa",
    type: "therapist",
    experience: 6,
    pricePerHour: 80000,
    specialties: ["Depression", "Self-Esteem", "Life Transitions", "Career Counseling"],
    languages: ["English", "Luganda", "Swahili"],
    availableOptions: ["voice", "video"],
  },
  {
    id: "5",
    name: "Dr. Amina Hassan",
    type: "psychotherapist",
    experience: 10,
    pricePerHour: 120000,
    specialties: ["Anxiety Disorders", "OCD", "Eating Disorders", "Trauma Recovery"],
    languages: ["English", "Arabic"],
    availableOptions: ["voice", "video"],
  },
  {
    id: "6",
    name: "Patricia Namutebi",
    type: "counselor",
    experience: 4,
    pricePerHour: 60000,
    specialties: ["Relationship Issues", "Pre-Marital Counseling", "Couples Therapy", "Communication"],
    languages: ["English", "Luganda"],
    availableOptions: ["voice", "video"],
  },
  {
    id: "7",
    name: "Dr. Peter Ochieng",
    type: "therapist",
    experience: 9,
    pricePerHour: 110000,
    specialties: ["Substance Abuse", "Addiction Recovery", "Anger Management", "Behavioral Therapy"],
    languages: ["English", "Luo", "Swahili"],
    availableOptions: ["voice", "video"],
  },
  {
    id: "8",
    name: "Florence Akankwasa",
    type: "counselor",
    experience: 7,
    pricePerHour: 85000,
    specialties: ["Child Psychology", "Adolescent Issues", "Parenting", "Family Dynamics"],
    languages: ["English", "Runyankole"],
    availableOptions: ["voice", "video"],
  },
  {
    id: "9",
    name: "Dr. Moses Kiggundu",
    type: "psychotherapist",
    experience: 15,
    pricePerHour: 180000,
    specialties: ["Complex Trauma", "Dissociative Disorders", "Severe Depression", "Psychosis"],
    languages: ["English", "Luganda"],
    availableOptions: ["voice", "video"],
  },
  {
    id: "10",
    name: "Ruth Namubiru",
    type: "therapist",
    experience: 3,
    pricePerHour: 50000,
    specialties: ["Anxiety", "Stress", "Self-Care", "Work-Life Balance"],
    languages: ["English", "Luganda"],
    availableOptions: ["voice", "video"],
  },
  {
    id: "11",
    name: "Dr. Catherine Apio",
    type: "psychotherapist",
    experience: 11,
    pricePerHour: 140000,
    specialties: ["Depression", "Anxiety", "Trauma", "Women's Mental Health", "Postpartum"],
    languages: ["English", "Luo"],
    availableOptions: ["voice", "video"],
  },
  {
    id: "12",
    name: "Daniel Mugisha",
    type: "counselor",
    experience: 6,
    pricePerHour: 70000,
    specialties: ["Men's Issues", "Career Stress", "Identity", "Personal Growth"],
    languages: ["English", "Kinyarwanda", "Luganda"],
    availableOptions: ["voice", "video"],
  },
];

const typeDescriptions = {
  therapist: "Therapists are licensed professionals who help individuals navigate emotional, mental, and behavioral challenges through various therapeutic techniques. Therapists focus on addressing issues like anxiety, depression, and trauma to improve overall mental well-being.",
  psychotherapist: "Psychotherapists are highly trained mental health professionals who use evidence-based psychological methods to treat complex mental health conditions. They specialize in deep therapeutic work for personality disorders, severe trauma, and chronic mental health issues.",
  counselor: "Counselors provide guidance and support for individuals facing life challenges, relationship issues, and emotional difficulties. They focus on helping clients develop coping strategies and make positive life changes through supportive conversations.",
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 0,
  }).format(price);
};

const SpecialistCard = ({ specialist }: { specialist: Specialist }) => {
  const initials = specialist.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-lg truncate">{specialist.name}</h3>
          <button className="text-primary text-sm hover:underline flex items-center gap-1">
            View profile <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Experience:</span>
          <span className="font-medium text-foreground">{specialist.experience} Years</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Price:</span>
          <span className="font-medium text-foreground">{formatPrice(specialist.pricePerHour)}/hr</span>
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
          {specialist.availableOptions.includes("voice") && (
            <div className="flex items-center gap-1 text-sm text-foreground">
              <Phone className="w-4 h-4 text-primary" /> Voice
            </div>
          )}
          {specialist.availableOptions.includes("video") && (
            <div className="flex items-center gap-1 text-sm text-foreground">
              <Video className="w-4 h-4 text-primary" /> Video
            </div>
          )}
        </div>
      </div>

      <Button 
        className="w-full"
        onClick={() => window.open(`https://wa.me/256780570987?text=${encodeURIComponent(`Hi, I would like to book a session with ${specialist.name}`)}`, "_blank")}
      >
        Book Session
      </Button>
    </div>
  );
};

const Specialists = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("therapist");

  const filteredSpecialists = specialists.filter((specialist) => {
    const matchesType = specialist.type === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialist.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      specialist.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Our Specialists - Therapists, Counselors & Psychotherapists | Innerspark Africa</title>
        <meta
          name="description"
          content="Discover our diverse team of certified specialists ready to support your mental health journey. From experienced therapists and compassionate counselors to trusted psychotherapists."
        />
        <meta name="keywords" content="therapists Uganda, counselors Uganda, psychotherapists, mental health specialists, online therapy, virtual counseling" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Meet Our <span className="text-primary">Specialists</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover our diverse team of certified specialists ready to support your mental health journey. 
              From experienced therapists and compassionate counselors to trusted psychotherapists, 
              browse through profiles to find the right professional for you.
            </p>
          </div>
        </section>

        {/* Tabs and Search */}
        <section className="py-8 border-b border-border bg-card/50">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <TabsList className="bg-muted/50 p-1">
                  <TabsTrigger value="therapist" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Therapists
                  </TabsTrigger>
                  <TabsTrigger value="psychotherapist" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Psychotherapists
                  </TabsTrigger>
                  <TabsTrigger value="counselor" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Counselors
                  </TabsTrigger>
                </TabsList>

                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for a therapist or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Type Description */}
              <div className="bg-muted/30 rounded-lg p-4 mb-8">
                <h2 className="font-semibold text-foreground mb-2 capitalize">{activeTab}s</h2>
                <p className="text-sm text-muted-foreground">
                  {typeDescriptions[activeTab as keyof typeof typeDescriptions]}
                </p>
              </div>

              {/* Specialists Grid */}
              <TabsContent value="therapist" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSpecialists.map((specialist) => (
                    <SpecialistCard key={specialist.id} specialist={specialist} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="psychotherapist" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSpecialists.map((specialist) => (
                    <SpecialistCard key={specialist.id} specialist={specialist} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="counselor" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSpecialists.map((specialist) => (
                    <SpecialistCard key={specialist.id} specialist={specialist} />
                  ))}
                </div>
              </TabsContent>

              {filteredSpecialists.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No specialists found matching your search.</p>
                </div>
              )}
            </Tabs>
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
