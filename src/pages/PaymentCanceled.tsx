import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { XCircle, ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PaymentCanceled = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Payment Canceled | Innerspark Africa</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-orange-600" />
            </div>

            <h1 className="text-3xl font-bold mb-4 text-foreground">
              Payment Canceled
            </h1>

            <p className="text-muted-foreground mb-8 text-lg">
              Your payment was not completed. No charges were made. You can try again or contact us for assistance.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/specialists">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Therapists
                </Button>
              </Link>
              <a href="https://wa.me/256792085773" target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Need Help? Chat Us
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

export default PaymentCanceled;
