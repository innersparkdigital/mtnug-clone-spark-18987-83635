import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Calendar, MessageSquare, Download, Sparkles } from "lucide-react";
import { trackGadsThankYouConversion, ThankYouConversionType } from "@/lib/gadsTracking";

interface ThankYouContent {
  title: string;
  message: string;
  nextSteps: string[];
  primaryCta: { label: string; to: string; external?: boolean };
  secondaryCta?: { label: string; to: string; external?: boolean };
}

const CONTENT: Record<ThankYouConversionType, ThankYouContent> = {
  booking: {
    title: "Booking Confirmed!",
    message: "Thank you! Your therapy booking request has been received successfully.",
    nextSteps: [
      "Our team will contact you on WhatsApp within 24 hours to confirm your session.",
      "You'll receive a session link before your appointment.",
      "A payment receipt has been emailed to you (if applicable).",
    ],
    primaryCta: { label: "Explore Services", to: "/services" },
    secondaryCta: { label: "Back to Home", to: "/" },
  },
  contact: {
    title: "Message Received!",
    message: "Thank you! Your message has been successfully submitted.",
    nextSteps: [
      "Our team will respond to your inquiry within 24 hours.",
      "Check your email for a confirmation message.",
      "For urgent matters, reach us on WhatsApp.",
    ],
    primaryCta: { label: "Explore Services", to: "/services" },
    secondaryCta: { label: "Back to Home", to: "/" },
  },
  corporate: {
    title: "Inquiry Submitted!",
    message: "Thank you! Your corporate wellbeing inquiry has been received.",
    nextSteps: [
      "Our corporate team will reach out within 1 business day.",
      "We'll prepare a tailored proposal for your organization.",
      "Expect a discovery call to understand your needs.",
    ],
    primaryCta: { label: "Learn More About Business", to: "/for-business" },
    secondaryCta: { label: "Back to Home", to: "/" },
  },
  referral: {
    title: "Referral Submitted!",
    message: "Thank you! Your patient referral has been recorded.",
    nextSteps: [
      "Our team will contact the patient shortly.",
      "You can track this referral from your doctor dashboard.",
      "Commission will be calculated once the patient completes a session.",
    ],
    primaryCta: { label: "Submit Another Referral", to: "/for-professionals" },
    secondaryCta: { label: "Back to Home", to: "/" },
  },
  newsletter: {
    title: "You're Subscribed!",
    message: "Thank you for subscribing to our mental wellness newsletter.",
    nextSteps: [
      "Check your inbox for a welcome email.",
      "You'll receive expert tips and resources weekly.",
      "Unsubscribe anytime from any email.",
    ],
    primaryCta: { label: "Read Our Blog", to: "/blog" },
    secondaryCta: { label: "Back to Home", to: "/" },
  },
  download: {
    title: "Thanks for Your Interest!",
    message: "Thank you! Your app download request has been received.",
    nextSteps: [
      "Download links are on their way to your inbox.",
      "The app is also available on Google Play.",
      "Get started with your wellness journey today.",
    ],
    primaryCta: {
      label: "Get on Google Play",
      to: "https://play.google.com/store/apps/details?id=com.innersparkafrica.app",
      external: true,
    },
    secondaryCta: { label: "Back to Home", to: "/" },
  },
};

const ICON: Record<ThankYouConversionType, React.ElementType> = {
  booking: Calendar,
  contact: MessageSquare,
  corporate: Sparkles,
  referral: CheckCircle2,
  newsletter: MessageSquare,
  download: Download,
};

interface Props {
  type: ThankYouConversionType;
}

const ThankYou = ({ type }: Props) => {
  const content = CONTENT[type];
  const Icon = ICON[type];
  const path = `/thank-you-${type}`;

  useEffect(() => {
    // Fire Google Ads + GA4 conversion exactly once per page load
    trackGadsThankYouConversion(type);
  }, [type]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{content.title} | Innerspark Africa</title>
        <meta name="description" content={content.message} />
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href={`https://www.innersparkafrica.com${path}`} />
      </Helmet>

      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon className="w-10 h-10 text-primary" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {content.title}
            </h1>

            <p className="text-muted-foreground mb-8 text-lg">
              {content.message}
            </p>

            <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold mb-3 text-foreground">What happens next?</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {content.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              {content.primaryCta.external ? (
                <a href={content.primaryCta.to} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">{content.primaryCta.label}</Button>
                </a>
              ) : (
                <Link to={content.primaryCta.to}>
                  <Button className="gap-2">{content.primaryCta.label}</Button>
                </Link>
              )}
              {content.secondaryCta && (
                <Link to={content.secondaryCta.to}>
                  <Button variant="outline" className="gap-2">
                    <Home className="w-4 h-4" />
                    {content.secondaryCta.label}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYou;