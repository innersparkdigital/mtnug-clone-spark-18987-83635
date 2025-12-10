import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Video, Phone, ExternalLink, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSpecialistImage } from "@/lib/specialistImages";

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
}

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

  const imageUrl = getSpecialistImage(specialist.name, specialist.image_url);

  return (
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
          <h3 className="font-semibold text-foreground text-lg truncate">{specialist.name}</h3>
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
        <Button 
          className="flex-1"
          onClick={() => window.open(`https://wa.me/256780570987?text=${encodeURIComponent(`Hi, I would like to book a session with ${specialist.name}`)}`, "_blank")}
        >
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

const specialtyCategories = [
  { label: "All", value: "" },
  { label: "Child Psychology", value: "child" },
  { label: "Couples/Relationships", value: "couples" },
  { label: "Families", value: "family" },
  { label: "Adolescents", value: "adolescent" },
  { label: "Sports Psychology", value: "sports" },
  { label: "Youth & Family", value: "youth" },
  { label: "Employees/Organizations", value: "corporate" },
];

const Specialists = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("therapist");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecialists();
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

  const filteredSpecialists = specialists.filter((specialist) => {
    const matchesType = specialist.type === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialist.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      specialist.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "" ||
      specialist.specialties.some((s) => s.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesType && matchesSearch && matchesCategory;
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

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {specialtyCategories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className="rounded-full"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

              {/* Type Description */}
              <div className="bg-muted/30 rounded-lg p-4 mb-8">
                <h2 className="font-semibold text-foreground mb-2 capitalize">{activeTab}s</h2>
                <p className="text-sm text-muted-foreground">
                  {typeDescriptions[activeTab as keyof typeof typeDescriptions]}
                </p>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-pulse text-muted-foreground">Loading specialists...</div>
                </div>
              ) : (
                <>
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
                </>
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
