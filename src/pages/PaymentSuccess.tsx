import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, MessageSquare, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Payment Successful | Innerspark Africa</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold mb-4 text-foreground">
              Payment Successful!
            </h1>

            <p className="text-muted-foreground mb-8 text-lg">
              Thank you for your payment. Your therapy session booking has been confirmed. Our team will reach out to you shortly via WhatsApp to finalize your appointment details.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold mb-3 text-foreground">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  You'll receive a payment confirmation via email
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
