import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getSpecialistImage } from "@/lib/specialistImages";
import { useAssessment, SelectedSpecialist } from "@/contexts/AssessmentContext";
import PreAssessmentModal from "@/components/PreAssessmentModal";
import ugandaBadge from "@/assets/uganda-badge.png";
import ghanaBadge from "@/assets/ghana-badge.png";
import botswanaBadge from "@/assets/botswana-badge.png";
import { 
  ArrowLeft, 
  Video, 
  Phone, 
  Star, 
  Clock, 
  GraduationCap, 
  Award,
  Calendar,
  MessageCircle,
  CheckCircle,
  User
} from "lucide-react";

interface Specialist {
  id: string;
  name: string;
  type: string;
  experience_years: number;
  price_per_hour: number;
  specialties: string[];
  languages: string[];
  available_options: string[];
  bio: string | null;
  education: string | null;
  certifications: string[] | null;
  image_url: string | null;
  country: string;
}

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  created_at: string;
}

interface Availability {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface Certificate {
  id: string;
  certificate_name: string;
  certificate_url: string;
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const countryBadges: Record<string, string> = {
  Uganda: ugandaBadge,
  Ghana: ghanaBadge,
  Botswana: botswanaBadge,
};

const formatPrice = (price: number) => {
  const ugx = new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 0,
  }).format(price);
  const usd = Math.round(price / 3700);
  return `$${usd} / ${ugx}`;
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

const StarRating = ({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (rating: number) => void }) => {
  const [hovered, setHovered] = useState(0);
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= (hovered || rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          } ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
        />
      ))}
    </div>
  );
};

const SpecialistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [showPreAssessment, setShowPreAssessment] = useState(false);
  const { assessmentResult, justCompletedAssessment, setJustCompletedAssessment } = useAssessment();
  const hasAutoOpened = useRef(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    preferredDay: "",
    preferredTime: "",
    sessionType: "video",
    notes: "",
  });

  // Auto-open booking dialog if user just completed an assessment and returned
  useEffect(() => {
    if (justCompletedAssessment && assessmentResult && !hasAutoOpened.current) {
      hasAutoOpened.current = true;
      setBookingDialogOpen(true);
      setJustCompletedAssessment(false);
    }
  }, [justCompletedAssessment, assessmentResult, setJustCompletedAssessment]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.phone.trim()) {
      toast({ title: "Please fill in your name and phone number", variant: "destructive" });
      return;
    }

    let message = `Hello, I would like to book a therapy session.

*Client Details:*
• Name: ${bookingForm.name}
• Phone: ${bookingForm.phone}

*Booking Request:*
• Therapist: ${specialist?.name}
• Session Type: ${bookingForm.sessionType === "video" ? "Video Call" : "Voice Call"}
${bookingForm.preferredDay ? `• Preferred Day: ${bookingForm.preferredDay}` : ""}
${bookingForm.preferredTime ? `• Preferred Time: ${bookingForm.preferredTime}` : ""}`;

    // Include assessment results if available
    if (assessmentResult) {
      message += `

*Assessment Results:*
• Condition: ${assessmentResult.assessmentLabel}
• Severity: ${assessmentResult.severity}
• Score: ${assessmentResult.score}/${assessmentResult.maxScore}
• Recommendation: ${assessmentResult.recommendation}`;
    }

    message += `
${bookingForm.notes ? `\n*Additional Notes:*\n${bookingForm.notes}` : ""}

Please confirm availability. Thank you!`;

    window.open(
      `https://wa.me/256792085773?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    setBookingDialogOpen(false);
    setBookingForm({ name: "", phone: "", preferredDay: "", preferredTime: "", sessionType: "video", notes: "" });
  };

  useEffect(() => {
    if (id) {
      fetchSpecialist();
      fetchReviews();
      fetchAvailability();
      fetchCertificates();
    }
  }, [id]);

  const fetchSpecialist = async () => {
    const { data, error } = await supabase
      .from("specialists")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching specialist:", error);
    } else {
      setSpecialist(data);
    }
    setLoading(false);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("specialist_reviews")
      .select("*")
      .eq("specialist_id", id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
  };

  const fetchAvailability = async () => {
    const { data, error } = await supabase
      .from("specialist_availability")
      .select("*")
      .eq("specialist_id", id)
      .order("day_of_week", { ascending: true });

    if (!error && data) {
      setAvailability(data);
    }
  };

  const fetchCertificates = async () => {
    const { data, error } = await supabase
      .from("specialist_certificates")
      .select("*")
      .eq("specialist_id", id)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setCertificates(data);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim()) {
      toast({ title: "Please enter your name", variant: "destructive" });
      return;
    }

    setSubmittingReview(true);
    const { error } = await supabase.from("specialist_reviews").insert({
      specialist_id: id,
      reviewer_name: reviewForm.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment || null,
    });

    if (error) {
      toast({ title: "Error submitting review", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Review submitted successfully!" });
      setReviewForm({ name: "", rating: 5, comment: "" });
      fetchReviews();
    }
    setSubmittingReview(false);
  };

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!specialist) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Specialist Not Found</h1>
            <p className="text-muted-foreground mb-8">The specialist you're looking for doesn't exist.</p>
            <Link to="/specialists">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Specialists
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const initials = specialist.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const imageUrl = getSpecialistImage(specialist.name, specialist.image_url);

  return (
    <>
      <Helmet>
        <title>{specialist.name} - {specialist.type.charAt(0).toUpperCase() + specialist.type.slice(1)} | Innerspark Africa</title>
        <meta
          name="description"
          content={`Book a session with ${specialist.name}, an experienced ${specialist.type} specializing in ${specialist.specialties.slice(0, 3).join(", ")}.`}
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/specialists" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Specialists
          </Link>
        </div>

        {/* Profile Header */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-4xl shrink-0 border-4 border-primary/20 shadow-lg overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt={specialist.name} className="w-full h-full object-cover object-top" />
                ) : (
                  initials
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{specialist.name}</h1>
                  {certificates.length > 0 && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                  {countryBadges[specialist.country] && (
                    <img src={countryBadges[specialist.country]} alt={specialist.country} className="w-6 h-6 object-contain" title={specialist.country} />
                  )}
                  <Badge variant="secondary" className="capitalize">{specialist.type}</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{specialist.experience_years} years experience</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{averageRating} ({reviews.length} reviews)</span>
                  </div>
                </div>

                <p className="text-2xl font-bold text-primary mb-4">
                  {formatPrice(specialist.price_per_hour)}/hr
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {specialist.available_options.includes("voice") && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Voice
                    </Badge>
                  )}
                  {specialist.available_options.includes("video") && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Video className="w-3 h-3" /> Video
                    </Badge>
                  )}
                </div>

                <Button size="lg" onClick={() => setShowPreAssessment(true)}>
                  <MessageCircle className="w-4 h-4 mr-2" /> Book Session via WhatsApp
                </Button>

                <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Book a Session with {specialist.name}</DialogTitle>
                      <DialogDescription>
                        Fill in your details and we'll send them via WhatsApp to confirm your booking.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Assessment Summary if available */}
                    {assessmentResult && (
                      <div className="bg-muted/50 rounded-lg p-3 border text-sm space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Assessment Result</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{assessmentResult.severity}</span>
                        </div>
                        <p className="text-muted-foreground"><strong>Condition:</strong> {assessmentResult.assessmentLabel}</p>
                        <p className="text-muted-foreground"><strong>Score:</strong> {assessmentResult.score}/{assessmentResult.maxScore}</p>
                      </div>
                    )}

                    <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="booking-name">Your Name *</Label>
                        <Input
                          id="booking-name"
                          placeholder="Enter your full name"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="booking-phone">Phone Number *</Label>
                        <Input
                          id="booking-phone"
                          placeholder="e.g., 0780123456"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="preferred-day">Preferred Day</Label>
                          <Select
                            value={bookingForm.preferredDay}
                            onValueChange={(value) => setBookingForm({ ...bookingForm, preferredDay: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monday">Monday</SelectItem>
                              <SelectItem value="Tuesday">Tuesday</SelectItem>
                              <SelectItem value="Wednesday">Wednesday</SelectItem>
                              <SelectItem value="Thursday">Thursday</SelectItem>
                              <SelectItem value="Friday">Friday</SelectItem>
                              <SelectItem value="Saturday">Saturday</SelectItem>
                              <SelectItem value="Sunday">Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preferred-time">Preferred Time</Label>
                          <Select
                            value={bookingForm.preferredTime}
                            onValueChange={(value) => setBookingForm({ ...bookingForm, preferredTime: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Morning (9am-12pm)">Morning (9am-12pm)</SelectItem>
                              <SelectItem value="Afternoon (12pm-3pm)">Afternoon (12pm-3pm)</SelectItem>
                              <SelectItem value="Evening (3pm-6pm)">Evening (3pm-6pm)</SelectItem>
                              <SelectItem value="Late Evening (6pm-9pm)">Late Evening (6pm-9pm)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="session-type">Session Type</Label>
                        <Select
                          value={bookingForm.sessionType}
                          onValueChange={(value) => setBookingForm({ ...bookingForm, sessionType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {specialist.available_options.includes("video") && (
                              <SelectItem value="video">Video Call</SelectItem>
                            )}
                            {specialist.available_options.includes("voice") && (
                              <SelectItem value="voice">Voice Call</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="booking-notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="booking-notes"
                          placeholder="Any specific concerns or questions..."
                          value={bookingForm.notes}
                          onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" /> Send Booking Request via WhatsApp
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <PreAssessmentModal
                  isOpen={showPreAssessment}
                  onClose={() => {
                    setShowPreAssessment(false);
                  }}
                  actionType="book"
                  specialist={specialist ? {
                    id: specialist.id,
                    name: specialist.name,
                    type: specialist.type,
                    specialties: specialist.specialties,
                    experience_years: specialist.experience_years,
                    price_per_hour: specialist.price_per_hour,
                    image_url: specialist.image_url,
                    bio: specialist.bio,
                  } : null}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full max-w-md mx-auto mb-8">
                <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
                <TabsTrigger value="availability" className="flex-1">Availability</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {specialist.bio && (
                      <Card>
                        <CardHeader>
                          <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed">{specialist.bio}</p>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5" /> Education
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{specialist.education || "Not specified"}</p>
                      </CardContent>
                    </Card>

                    {specialist.certifications && specialist.certifications.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" /> Certifications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {specialist.certifications.map((cert, index) => (
                              <li key={index} className="flex items-center gap-2 text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                {cert}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {certificates.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" /> 
                            Licenses & Verified Certificates
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-4 overflow-x-auto pb-4">
                            {certificates.map((cert) => (
                              <a 
                                key={cert.id}
                                href={cert.certificate_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-shrink-0 w-64 group"
                              >
                                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-muted">
                                  <img 
                                    src={cert.certificate_url} 
                                    alt={cert.certificate_name}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <p className="text-xs font-medium text-muted-foreground mt-2 text-center line-clamp-2">{cert.certificate_name}</p>
                              </a>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Specialties</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {specialist.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Languages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {specialist.languages.map((language, index) => (
                            <Badge key={index} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Availability Tab */}
              <TabsContent value="availability">
                <Card className="max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" /> Weekly Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {availability.length > 0 ? (
                      <div className="space-y-3">
                        {dayNames.map((dayName, index) => {
                          const dayAvailability = availability.find((a) => a.day_of_week === index);
                          return (
                            <div
                              key={index}
                              className={`flex justify-between items-center p-3 rounded-lg ${
                                dayAvailability?.is_available
                                  ? "bg-primary/5 border border-primary/20"
                                  : "bg-muted/50"
                              }`}
                            >
                              <span className="font-medium">{dayName}</span>
                              {dayAvailability?.is_available ? (
                                <span className="text-primary">
                                  {formatTime(dayAvailability.start_time)} - {formatTime(dayAvailability.end_time)}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">Unavailable</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Availability information not yet provided.
                      </p>
                    )}

                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-4">
                        To book a session, fill in your details and we'll help you find a suitable time.
                      </p>
                      <Button
                        className="w-full"
                        onClick={() => setBookingDialogOpen(true)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" /> Book a Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <div className="max-w-3xl mx-auto space-y-8">
                  {/* Review Summary */}
                  <Card>
                    <CardContent className="py-6">
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-5xl font-bold text-foreground">{averageRating}</div>
                        <div>
                          <StarRating rating={Math.round(parseFloat(averageRating))} />
                          <p className="text-muted-foreground mt-1">{reviews.length} reviews</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Write Review */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={submitReview} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Your Name</Label>
                          <Input
                            id="name"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                            placeholder="Enter your name"
                          />
                        </div>
                        <div>
                          <Label>Rating</Label>
                          <StarRating
                            rating={reviewForm.rating}
                            interactive
                            onRate={(rating) => setReviewForm({ ...reviewForm, rating })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="comment">Your Review (Optional)</Label>
                          <Textarea
                            id="comment"
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            placeholder="Share your experience..."
                            rows={4}
                          />
                        </div>
                        <Button type="submit" disabled={submittingReview}>
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Reviews List */}
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="py-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">{review.reviewer_name}</span>
                                  {review.is_verified && (
                                    <Badge variant="secondary" className="text-xs">
                                      <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                    </Badge>
                                  )}
                                </div>
                                <StarRating rating={review.rating} />
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-muted-foreground mt-2">{review.comment}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SpecialistProfile;
