import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, Users, MapPin, CheckCircle, AlertCircle, ArrowRight, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, isPast, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";

interface Training {
  id: string;
  title: string;
  description: string;
  session_focus: string[];
  target_audience: string;
  facilitator_name: string;
  facilitator_title: string;
  training_date: string;
  end_time: string;
  flier_image_url: string | null;
  meeting_link: string | null;
  meeting_password: string | null;
  is_active: boolean;
}

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(targetDate);
      const now = new Date();
      if (target <= now) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      setTimeLeft({
        days: differenceInDays(target, now),
        hours: differenceInHours(target, now) % 24,
        minutes: differenceInMinutes(target, now) % 60,
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) return null;

  return (
    <div className="flex gap-2 mt-3">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hrs" },
        { value: timeLeft.minutes, label: "Min" },
      ].map((item) => (
        <div key={item.label} className="bg-primary/10 rounded-lg px-3 py-1.5 text-center min-w-[50px]">
          <div className="text-lg font-bold text-primary">{item.value}</div>
          <div className="text-[10px] text-muted-foreground uppercase">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const Trainings = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    organisation: "",
    position: "",
    phone_number: "",
  });

  useEffect(() => {
    const fetchTrainings = async () => {
      const { data, error } = await supabase
        .from("trainings")
        .select("*")
        .eq("is_active", true)
        .order("training_date", { ascending: true });
      if (!error && data) setTrainings(data);
      setLoading(false);
    };
    fetchTrainings();
  }, []);

  const upcomingTrainings = trainings.filter((t) => !isPast(new Date(t.training_date)));
  const pastTrainings = trainings.filter((t) => isPast(new Date(t.training_date)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTraining) return;

    if (!formData.full_name.trim() || !formData.email.trim() || !formData.phone_number.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("training_registrations").insert({
        training_id: selectedTraining.id,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        organisation: formData.organisation.trim() || null,
        position: formData.position.trim() || null,
        phone_number: formData.phone_number.trim(),
      });

      if (error) throw error;

      // Send confirmation email via transactional email system
      const firstName = formData.full_name.trim().split(" ")[0];
      const trainingDateFormatted = format(new Date(selectedTraining.training_date), "EEEE, MMMM d, yyyy");
      const registrationId = crypto.randomUUID();

      await supabase.functions.invoke("send-resend-email", {
        body: {
          type: "training-confirmation",
          to: formData.email.trim(),
          data: {
            recipientName: firstName,
            trainingTitle: selectedTraining.title,
            trainingDate: trainingDateFormatted,
            trainingTime: `10:00AM – ${selectedTraining.end_time || "11:00AM"}`,
            meetingLink: selectedTraining.meeting_link || "",
            meetingPassword: selectedTraining.meeting_password || "",
            facilitatorName: selectedTraining.facilitator_name,
            facilitatorTitle: selectedTraining.facilitator_title,
          },
        },
      });

      setSubmitted(true);
      setFormData({ full_name: "", email: "", organisation: "", position: "", phone_number: "" });
    } catch (err) {
      toast({ title: "Registration failed. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const trainingIsPast = (date: string) => isPast(new Date(date));

  const renderTrainingCard = (training: Training) => {
    const passed = trainingIsPast(training.training_date);
    return (
      <Card
        key={training.id}
        className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
        onClick={() => {
          setSelectedTraining(training);
          setSubmitted(false);
        }}
      >
        <div className="relative">
          {training.flier_image_url && (
            <img
              src={training.flier_image_url}
              alt={training.title}
              className="w-full h-56 object-cover"
            />
          )}
          <Badge
            className={`absolute top-3 right-3 ${
              passed
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {passed ? "Training Passed" : "Upcoming Training"}
          </Badge>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {training.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span>{training.target_audience}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(training.training_date), "EEEE, MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Clock className="w-4 h-4" />
            <span>10:00AM – {training.end_time}</span>
          </div>
          {!passed && <CountdownTimer targetDate={training.training_date} />}
          <Button
            className="w-full mt-4"
            variant={passed ? "outline" : "default"}
            disabled={passed}
          >
            {passed ? "Session Ended" : "View Details & Register"}
            {!passed && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Trainings | InnerSpark Africa – Wellness Workshops & Sessions</title>
        <meta name="description" content="Browse and register for InnerSpark Africa's upcoming wellness trainings, workshops, and mental health sessions." />
        <link rel="canonical" href="https://www.innersparkafrica.com/events-training/trainings" />
      </Helmet>
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Wellness Trainings</h1>
          <p className="text-xl text-muted-foreground">
            Register for free virtual mental health trainings by InnerSpark Africa
          </p>
        </div>
      </section>

      {/* Upcoming */}
      {upcomingTrainings.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-foreground">📅 Upcoming Trainings</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {upcomingTrainings.map(renderTrainingCard)}
            </div>
          </div>
        </section>
      )}

      {/* Past */}
      {pastTrainings.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Past Trainings</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {pastTrainings.map(renderTrainingCard)}
            </div>
          </div>
        </section>
      )}

      {loading && (
        <div className="py-20 text-center text-muted-foreground">Loading trainings...</div>
      )}

      {/* WhatsApp Contact */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold mb-3 text-foreground">Need Support?</h3>
          <p className="text-muted-foreground mb-4">Reach out to us on WhatsApp for any inquiries</p>
          <Button
            variant="outline"
            onClick={() => window.open("https://wa.me/256792085773?text=Hi, I have a question about the InnerSpark trainings.", "_blank")}
          >
            <Phone className="w-4 h-4 mr-2" />
            WhatsApp Us
          </Button>
        </div>
      </section>

      {/* Detail Modal */}
      <Dialog open={!!selectedTraining} onOpenChange={(open) => !open && setSelectedTraining(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTraining && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedTraining.title}</DialogTitle>
              </DialogHeader>

              {selectedTraining.flier_image_url && (
                <img
                  src={selectedTraining.flier_image_url}
                  alt={selectedTraining.title}
                  className="w-full rounded-lg mb-4"
                />
              )}

              <p className="text-muted-foreground mb-4">{selectedTraining.description}</p>

              {selectedTraining.session_focus.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-foreground">What we will cover:</h4>
                  <ul className="space-y-1">
                    {selectedTraining.session_focus.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4 mb-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{format(new Date(selectedTraining.training_date), "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>10:00AM – {selectedTraining.end_time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Google Meet (Virtual Session)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Facilitator: {selectedTraining.facilitator_name} – {selectedTraining.facilitator_title}</span>
                </div>
              </div>

              {trainingIsPast(selectedTraining.training_date) ? (
                <div className="flex items-center gap-2 bg-muted rounded-lg p-4 text-muted-foreground">
                  <AlertCircle className="w-5 h-5" />
                  <span>This session has already taken place. Stay tuned for upcoming trainings!</span>
                </div>
              ) : submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-foreground mb-2">Registration Successful!</h4>
                  <p className="text-muted-foreground">
                    Thank you for registering. Please check your email for the meeting link.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
                  <h4 className="text-lg font-semibold text-foreground">Register for this Training</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        required
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <Label htmlFor="organisation">Organisation / Company</Label>
                      <Input
                        id="organisation"
                        value={formData.organisation}
                        onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position / Role</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        maxLength={100}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="phone_number">Phone Number *</Label>
                      <Input
                        id="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        required
                        maxLength={20}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Registering..." : "Register Now"}
                  </Button>
                </form>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Trainings;
