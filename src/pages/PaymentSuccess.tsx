import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, MessageSquare, Home, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type PaymentStatus = "loading" | "success" | "failed" | "pending";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const merchantReference = searchParams.get("merchant_reference");

  useEffect(() => {
    if (orderTrackingId) {
      checkPesaPalStatus(orderTrackingId);
    } else {
      // Direct visit or WhatsApp-only flow
      setStatus("success");
    }
  }, [orderTrackingId]);

  const checkPesaPalStatus = async (trackingId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("check-pesapal-status", {
        body: { orderTrackingId: trackingId },
      });

      if (error) {
        setStatus("pending");
        return;
      }

      // PesaPal status codes: 0=INVALID, 1=COMPLETED, 2=FAILED, 3=REVERSED
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
                <p className="text-muted-foreground mb-8 text-lg">
                  Thank you for your payment. Your therapy session booking has been confirmed. Our team will reach out to you shortly via WhatsApp to finalize your appointment details.
                </p>
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

            {merchantReference && (
              <p className="text-sm text-muted-foreground mb-4">
                Reference: <strong>{merchantReference}</strong>
              </p>
            )}

            <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold mb-3 text-foreground">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  You'll receive a payment confirmation
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
