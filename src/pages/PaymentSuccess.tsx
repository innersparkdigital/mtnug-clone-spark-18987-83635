import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, MessageSquare, Home, Loader2, XCircle, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type PaymentStatus = "loading" | "success" | "failed" | "pending";

interface PendingBooking {
  formType: string;
  formData: {
    name: string;
    email: string;
    phone: string;
    paymentMethod?: string;
    preferredDay?: string;
    preferredTime?: string;
    groupType?: string;
    preferredLanguage?: string;
    country?: string;
    notes?: string;
  };
  assessment: any;
  selectedSpecialist: { name: string } | null;
  merchantReference: string;
  amount: string;
  description: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [bookingData, setBookingData] = useState<PendingBooking | null>(null);
  const [receiptSent, setReceiptSent] = useState(false);
  const hasProcessed = useRef(false);
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const merchantReference = searchParams.get("merchant_reference");

  // Load pending booking data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("innerspark_pending_booking");
    if (stored) {
      try {
        setBookingData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse pending booking", e);
      }
    }
  }, []);

  useEffect(() => {
    if (orderTrackingId) {
      checkPesaPalStatus(orderTrackingId);
    } else {
      setStatus("success");
    }
  }, [orderTrackingId]);

  // When payment is successful, send WhatsApp + receipt email
  useEffect(() => {
    if (status === "success" && bookingData && !hasProcessed.current) {
      hasProcessed.current = true;
      handlePostPayment(bookingData);
    }
  }, [status, bookingData]);

  const checkPesaPalStatus = async (trackingId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("check-pesapal-status", {
        body: { orderTrackingId: trackingId },
      });

      if (error) {
        setStatus("pending");
        return;
      }

      if (data?.payment_status_description === "Completed" || data?.status_code === 1) {
        setStatus("success");
      } else if (data?.status_code === 2) {
        setStatus("failed");
      } else {
        setStatus("pending");
      }
    } catch {
      setStatus("pending");
    }
  };

  const handlePostPayment = async (booking: PendingBooking) => {
    // 1. Send WhatsApp notification to admin
    const whatsAppMessage = buildWhatsAppMessage(booking);
    const encodedMessage = encodeURIComponent(whatsAppMessage);
    window.open(`https://wa.me/256792085773?text=${encodedMessage}`, "_blank");

    // 2. Send receipt email to customer
    if (booking.formData.email) {
      try {
        const paymentMethodLabel = booking.formData.paymentMethod === "mobile_money" ? "PesaPal Mobile Money" : "PesaPal Visa / Card";
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "payment-receipt",
            recipientEmail: booking.formData.email,
            idempotencyKey: `receipt-${booking.merchantReference}`,
            templateData: {
              name: booking.formData.name,
              amount: booking.amount,
              currency: "UGX",
              description: booking.description,
              paymentMethod: paymentMethodLabel,
              merchantReference: booking.merchantReference,
              paymentDate: new Date().toLocaleDateString("en-UG", { year: "numeric", month: "long", day: "numeric" }),
              receiptNumber: booking.merchantReference,
            },
          },
        });
        setReceiptSent(true);
        toast({
          title: "Receipt sent!",
          description: `A payment receipt has been sent to ${booking.formData.email}`,
        });
      } catch (e) {
        console.error("Failed to send receipt email:", e);
      }
    }

    // 3. Clean up sessionStorage
    sessionStorage.removeItem("innerspark_pending_booking");
    sessionStorage.removeItem("innerspark_assessment");
  };

  const buildWhatsAppMessage = (booking: PendingBooking): string => {
    const { formType, formData, assessment, selectedSpecialist, merchantReference: ref } = booking;
    const isGroup = formType === "group";
    
    let msg = isGroup
      ? `*✅ PAID — Support Group Request – Innerspark Africa*\n\n`
      : `*✅ PAID — Booking Request – Innerspark Africa*\n\n`;

    if (selectedSpecialist) {
      msg += `*Selected Therapist:* ${selectedSpecialist.name}\n\n`;
    }

    msg += `*Name:* ${formData.name}\n`;
    msg += `*Email:* ${formData.email}\n`;
    msg += `*Phone:* ${formData.phone}\n\n`;

    if (assessment) {
      msg += `*Assessment:* ${assessment.assessmentLabel} — ${assessment.severity}\n`;
      msg += `*Score:* ${assessment.score}/${assessment.maxScore}\n\n`;
    }

    if (!isGroup) {
      msg += `*Preferred Day:* ${formData.preferredDay || "N/A"}\n`;
      msg += `*Preferred Time:* ${formData.preferredTime || "N/A"}\n`;
    }

    msg += `*Payment Method:* ${formData.paymentMethod === "mobile_money" ? "Mobile Money" : "Visa/Card"}\n`;
    msg += `*Language:* ${formData.preferredLanguage || "N/A"}\n`;
    msg += `*Country:* ${formData.country || "N/A"}\n\n`;
    msg += `*Amount Paid:* UGX ${booking.amount}\n`;
    msg += `*Payment Ref:* ${ref}\n`;
    msg += `*Payment Status:* ✅ COMPLETED`;

    if (formData.notes) {
      msg += `\n\n*Notes:* ${formData.notes}`;
    }

    return msg;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  const displayRef = bookingData?.merchantReference || merchantReference;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Payment {status === "success" ? "Successful" : status === "failed" ? "Failed" : "Pending"} | Innerspark Africa</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            {status === "success" && (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-foreground">Payment Successful!</h1>
                <p className="text-muted-foreground mb-4 text-lg">
                  Thank you for your payment. Your booking has been confirmed and our team will reach out to you shortly via WhatsApp.
                </p>
                {receiptSent && bookingData?.formData.email && (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600 mb-6">
                    <Mail className="w-4 h-4" />
                    <span>Payment receipt sent to <strong>{bookingData.formData.email}</strong></span>
                  </div>
                )}
              </>
            )}

            {status === "failed" && (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-foreground">Payment Failed</h1>
                <p className="text-muted-foreground mb-8 text-lg">
                  Your payment could not be processed. Please try again or contact us via WhatsApp for assistance.
                </p>
              </>
            )}

            {status === "pending" && (
              <>
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-yellow-600" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-foreground">Payment Processing</h1>
                <p className="text-muted-foreground mb-8 text-lg">
                  Your payment is being processed. This may take a few moments. We'll confirm via WhatsApp once complete.
                </p>
              </>
            )}

            {displayRef && (
              <p className="text-sm text-muted-foreground mb-4">
                Reference: <strong>{displayRef}</strong>
              </p>
            )}

            <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold mb-3 text-foreground">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {status === "success" ? "Payment receipt sent to your email" : "You'll receive a payment confirmation"}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Our team will contact you on WhatsApp to confirm session details
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  You'll receive a session link before your appointment
                </li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              <a href="https://wa.me/256792085773" target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contact Us on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
