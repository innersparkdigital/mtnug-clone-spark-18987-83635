import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssessment, AssessmentResult } from "@/contexts/AssessmentContext";
import { Calendar, Clock, CheckCircle, Send, AlertCircle, Users, Phone, User, ArrowRight, CreditCard, Smartphone, Languages, Globe, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { trackBookingFormOpened, trackBookingSubmitted, trackWhatsAppClick } from "@/lib/analytics";
import TherapistRecommendationCard from "./TherapistRecommendationCard";
import { supabase } from "@/integrations/supabase/client";

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: "book" | "group";
}

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Enter a valid phone number").max(20),
  preferredDay: z.string().min(1, "Please select a preferred day"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  preferredLanguage: z.string().min(1, "Please enter your preferred language").max(50),
  country: z.string().min(1, "Please enter your country").max(60),
  notes: z.string().max(500).optional(),
});

const groupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Enter a valid phone number").max(20),
  groupType: z.string().min(1, "Please select a group"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  preferredLanguage: z.string().min(1, "Please enter your preferred language").max(50),
  country: z.string().min(1, "Please enter your country").max(60),
  notes: z.string().max(500).optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;
type GroupFormData = z.infer<typeof groupSchema>;

const supportGroups = [
  { id: "depression", name: "Depression Support Group", fee: "UGX 25,000/week" },
  { id: "anxiety", name: "Anxiety Management Group", fee: "UGX 25,000/week" },
  { id: "grief", name: "Grief & Loss Support", fee: "UGX 25,000/week" },
  { id: "addiction", name: "Addiction Recovery Group", fee: "UGX 25,000/week" },
  { id: "stress", name: "Stress Management Circle", fee: "UGX 25,000/week" },
  { id: "relationships", name: "Healthy Relationships Group", fee: "UGX 25,000/week" },
  { id: "trauma", name: "Trauma Survivors Support", fee: "UGX 25,000/week" },
  { id: "parents", name: "New Parents Support", fee: "UGX 25,000/week" },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const times = ["Morning (8AM-12PM)", "Afternoon (12PM-4PM)", "Evening (4PM-8PM)"];

const formatWhatsAppMessage = (
  formType: "book" | "group",
  data: BookingFormData | GroupFormData,
  assessment: AssessmentResult | null
) => {
  const hasAssessment = assessment !== null;
  
  if (formType === "book") {
    const bookingData = data as BookingFormData;
    let message = `*New Booking Request – Innerspark Africa*\n\n`;
    message += `*Name:* ${bookingData.name}\n`;
    message += `*Phone:* ${bookingData.phone}\n\n`;
    
    if (hasAssessment) {
      message += `*Assessment Taken:* YES\n`;
      message += `*Condition:* ${assessment.assessmentLabel}\n`;
      message += `*Severity:* ${assessment.severity}\n`;
      message += `*Score:* ${assessment.score}/${assessment.maxScore}\n\n`;
      message += `*System Recommendation:*\n`;
      message += `– ${assessment.recommendation}\n`;
      message += `– ${assessment.recommendedFormat}\n\n`;
    } else {
      message += `*Assessment Taken:* NO\n\n`;
    }
    
    message += `*Preferred Day:* ${bookingData.preferredDay}\n`;
    message += `*Preferred Time:* ${bookingData.preferredTime}\n`;
    message += `*Payment Method:* ${bookingData.paymentMethod === "mobile_money" ? "Mobile Money" : "Visa/Card"}\n`;
    message += `*Preferred Language:* ${bookingData.preferredLanguage}\n`;
    message += `*Country:* ${bookingData.country}\n\n`;
    message += `*Session Cost:* $22 / UGX 75,000 per hour\n`;
    
    if (bookingData.notes) {
      message += `\n*Additional Notes:* ${bookingData.notes}`;
    }
    
    return message;
  } else {
    const groupData = data as GroupFormData;
    const selectedGroup = supportGroups.find(g => g.id === groupData.groupType);
    
    let message = `*New Support Group Request – Innerspark Africa*\n\n`;
    message += `*Name:* ${groupData.name}\n`;
    message += `*Phone:* ${groupData.phone}\n\n`;
    
    if (hasAssessment) {
      message += `*Assessment Taken:* YES\n`;
      message += `*Condition:* ${assessment.assessmentLabel}\n`;
      message += `*Severity:* ${assessment.severity}\n\n`;
    } else {
      message += `*Assessment Taken:* NO\n\n`;
    }
    
    message += `*Selected Group:* ${selectedGroup?.name || groupData.groupType}\n`;
    message += `*Payment Method:* ${groupData.paymentMethod === "mobile_money" ? "Mobile Money" : "Visa/Card"}\n`;
    message += `*Preferred Language:* ${groupData.preferredLanguage}\n`;
    message += `*Country:* ${groupData.country}\n`;
    message += `*Weekly Fee:* ${selectedGroup?.fee || "UGX 25,000/week"}\n`;
    
    if (groupData.notes) {
      message += `\n*Additional Notes:* ${groupData.notes}`;
    }
    
    return message;
  }
};

const BookingFormModal = ({ isOpen, onClose, formType }: BookingFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { assessmentResult, clearAssessment, setPendingAction, selectedSpecialist } = useAssessment();

  // Detect return from Stripe payment
  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setPaymentConfirmed(true);
      setShowForm(true);
      // Clean up URL params
      searchParams.delete("payment");
      searchParams.delete("session_id");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Track form opened and manage view state
  useEffect(() => {
    if (isOpen) {
      trackBookingFormOpened(!!assessmentResult);
      if (assessmentResult && formType === "book" && !paymentConfirmed) {
        setShowForm(false);
      } else {
        setShowForm(true);
      }
    } else {
      setShowForm(false);
      if (!paymentConfirmed) {
        // only reset if not returning from payment
      }
    }
  }, [isOpen, assessmentResult, formType, paymentConfirmed]);

  const handleProceedWithTherapist = () => {
    setShowForm(true);
  };

  const handleSwitchToGroup = () => {
    setPendingAction("group");
    onClose();
    // Re-open as group form
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openGroupForm'));
    }, 100);
  };
  
  const bookingForm = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      preferredDay: "",
      preferredTime: "",
      paymentMethod: "",
      preferredLanguage: "",
      country: "",
      notes: "",
    },
  });

  const groupForm = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      phone: "",
      groupType: "",
      paymentMethod: "",
      preferredLanguage: "",
      country: "",
      notes: "",
    },
  });

  const handleSubmit = async (data: BookingFormData | GroupFormData) => {
    setIsSubmitting(true);
    
    const isVisaPayment = data.paymentMethod === "visa";
    
    // If Visa/Card selected, redirect to Stripe Checkout
    if (isVisaPayment) {
      try {
        const bookingDetails: Record<string, string> = {
          name: data.name,
          phone: data.phone,
          preferredLanguage: data.preferredLanguage,
          country: data.country,
        };
        
        if (formType === "book") {
          const bookingData = data as BookingFormData;
          bookingDetails.preferredDay = bookingData.preferredDay;
          bookingDetails.preferredTime = bookingData.preferredTime;
        }
        
        if (selectedSpecialist) {
          bookingDetails.specialistName = selectedSpecialist.name;
        }
        
        if (assessmentResult) {
          bookingDetails.assessmentType = assessmentResult.assessmentLabel;
          bookingDetails.severity = assessmentResult.severity;
        }

        const { data: responseData, error } = await supabase.functions.invoke('create-payment', {
          body: {
            customerName: data.name,
            bookingDetails,
            returnPath: location.pathname,
          },
        });

        if (error) throw error;
        if (!responseData?.url) throw new Error("No checkout URL returned");

        // Track analytics before redirect
        trackBookingSubmitted(
          formType,
          assessmentResult?.assessmentType,
          assessmentResult?.severity
        );

        // Also send WhatsApp notification for admin tracking
        let message = formatWhatsAppMessage(formType, data, assessmentResult);
        if (selectedSpecialist && formType === "book") {
          message = message.replace(
            "*New Booking Request – Innerspark Africa*",
            `*New Booking Request – Innerspark Africa*\n\n*Selected Therapist:* ${selectedSpecialist.name}`
          );
        }
        message += `\n\n*💳 Payment Status:* Redirected to Stripe Checkout`;
        const encodedMessage = encodeURIComponent(message);
        // Send WhatsApp in background
        window.open(`https://wa.me/256792085773?text=${encodedMessage}`, "_blank");

        // Redirect to Stripe Checkout
        window.location.href = responseData.url;
        
        clearAssessment();
        onClose();
        return;
      } catch (error) {
        console.error("Stripe payment error:", error);
        toast({
          title: "Payment Error",
          description: "Could not initiate card payment. Please try again or use Mobile Money.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }
    
    // Mobile Money flow - send via WhatsApp as before
    let message = formatWhatsAppMessage(formType, data, assessmentResult);
    
    if (selectedSpecialist && formType === "book") {
      message = message.replace(
        "*New Booking Request – Innerspark Africa*",
        `*New Booking Request – Innerspark Africa*\n\n*Selected Therapist:* ${selectedSpecialist.name}`
      );
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/256792085773?text=${encodedMessage}`;
    
    trackBookingSubmitted(
      formType,
      assessmentResult?.assessmentType,
      assessmentResult?.severity
    );
    trackWhatsAppClick(formType === "book" ? "booking_form" : "group_form");
    
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "Request sent!",
      description: "We'll contact you shortly to confirm your booking.",
    });
    
    clearAssessment();
    onClose();
    setIsSubmitting(false);
    
    if (formType === "book") {
      bookingForm.reset();
    } else {
      groupForm.reset();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Minimal": return "text-green-600 bg-green-50";
      case "Mild": return "text-yellow-600 bg-yellow-50";
      case "Moderate": return "text-orange-600 bg-orange-50";
      case "Moderately Severe": return "text-red-500 bg-red-50";
      case "Severe": return "text-red-700 bg-red-100";
      default: return "text-primary bg-primary/10";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {formType === "book" ? (
              <>
                <Calendar className="h-6 w-6 text-primary" />
                Book a Therapy Session
              </>
            ) : (
              <>
                <Users className="h-6 w-6 text-primary" />
                Join a Support Group
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {formType === "book" 
              ? showForm 
                ? "Complete your booking details and we'll connect you with the right therapist."
                : "Based on your assessment, we've matched you with a recommended therapist."
              : "Fill in your details to join a supportive community."}
          </DialogDescription>
        </DialogHeader>

        {/* Therapist Recommendation (for booking with assessment, before form) */}
        {formType === "book" && assessmentResult && !showForm && (
          <TherapistRecommendationCard
            assessmentResult={assessmentResult}
            onProceedWithTherapist={handleProceedWithTherapist}
            onJoinSupportGroup={handleSwitchToGroup}
            selectedSpecialist={selectedSpecialist}
          />
        )}

        {/* Show form when ready */}
        {showForm && (
          <>
            {/* Payment Confirmed Banner */}
            {paymentConfirmed && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800 text-sm">Payment Confirmed ✅</p>
                  <p className="text-green-700 text-xs">Your card payment was successful. Our team will reach out shortly via WhatsApp.</p>
                </div>
              </div>
            )}

            {/* Compact Assessment Summary (when showing form) */}
            {assessmentResult && !paymentConfirmed && (
              <div className="bg-muted/50 rounded-lg p-3 border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {assessmentResult.assessmentLabel} • <span className={getSeverityColor(assessmentResult.severity).split(' ')[0]}>{assessmentResult.severity}</span>
                  </span>
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
              </div>
            )}

            {formType === "book" ? (
              <Form {...bookingForm}>
                <form onSubmit={bookingForm.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={bookingForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bookingForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="+256 XXX XXXXXX" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={bookingForm.control}
                      name="preferredDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Day</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select day" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {days.map((day) => (
                                <SelectItem key={day} value={day}>{day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bookingForm.control}
                      name="preferredTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {times.map((time) => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={bookingForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                            <div className="flex items-center gap-2 border rounded-lg p-3 flex-1 cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                              <RadioGroupItem value="mobile_money" id="booking_mobile_money" />
                              <Label htmlFor="booking_mobile_money" className="flex items-center gap-2 cursor-pointer">
                                <Smartphone className="h-4 w-4 text-primary" />
                                Mobile Money
                              </Label>
                            </div>
                            <div className="flex items-center gap-2 border rounded-lg p-3 flex-1 cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                              <RadioGroupItem value="visa" id="booking_visa" />
                              <Label htmlFor="booking_visa" className="flex items-center gap-2 cursor-pointer">
                                <CreditCard className="h-4 w-4 text-primary" />
                                Visa / Card
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bookingForm.control}
                    name="preferredLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Language</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Languages className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. English, Luganda, Swahili" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bookingForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. Uganda, Kenya, Nigeria" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bookingForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any specific concerns or preferences..." 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-primary/5 rounded-lg p-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">
                      Session Cost: <strong>$22 / UGX 75,000 per hour</strong>
                    </span>
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Booking Request
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...groupForm}>
                <form onSubmit={groupForm.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={groupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={groupForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="+256 XXX XXXXXX" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={groupForm.control}
                    name="groupType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Support Group</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a group..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {supportGroups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{group.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={groupForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                            <div className="flex items-center gap-2 border rounded-lg p-3 flex-1 cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                              <RadioGroupItem value="mobile_money" id="group_mobile_money" />
                              <Label htmlFor="group_mobile_money" className="flex items-center gap-2 cursor-pointer">
                                <Smartphone className="h-4 w-4 text-primary" />
                                Mobile Money
                              </Label>
                            </div>
                            <div className="flex items-center gap-2 border rounded-lg p-3 flex-1 cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                              <RadioGroupItem value="visa" id="group_visa" />
                              <Label htmlFor="group_visa" className="flex items-center gap-2 cursor-pointer">
                                <CreditCard className="h-4 w-4 text-primary" />
                                Visa / Card
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={groupForm.control}
                    name="preferredLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Language</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Languages className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. English, Luganda, Swahili" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={groupForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. Uganda, Kenya, Nigeria" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={groupForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any specific concerns or preferences..." 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-primary/5 rounded-lg p-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">
                      Weekly Fee: <strong>UGX 25,000</strong>
                    </span>
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Sending..." : "Submit Group Request"}
                  </Button>
                </form>
              </Form>
            )}
          </>
        )}

        <p className="text-xs text-muted-foreground text-center">
          <AlertCircle className="inline h-3 w-3 mr-1" />
          Your information is kept confidential and secure.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFormModal;
