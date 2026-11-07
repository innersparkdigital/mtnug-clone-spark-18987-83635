import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Check, LifeBuoy, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import AmaniChat from "@/components/amani/AmaniChat";
import UrgentHelpModal from "@/components/amani/UrgentHelpModal";
import { recordAmaniEvent } from "@/lib/amaniApi";

const CAN = [
  "Listen and help you put feelings into words",
  "Share simple, general ideas for stress, worry and sleep",
  "Point you to a licensed counsellor when you want a person",
  "Be there at any hour, with no account needed",
];

const CANNOT = [
  "Diagnose or treat any condition",
  "Replace a therapist, doctor or counsellor",
  "Act as an emergency service",
  "Promise a perfect answer: it is an AI and can be wrong",
];

export default function TalkToAmani() {
  const [urgentOpen, setUrgentOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Talk to Amani: Your AI Wellness Companion | InnerSpark</title>
        <meta
          name="description"
          content="Talk to Amani, InnerSpark Africa's AI wellness companion, for simple ideas on stress and worry. Amani is not a therapist. Talk to a licensed counsellor any time."
        />
        <link rel="canonical" href="https://www.innersparkafrica.com/talk-to-amani/" />
        <meta property="og:title" content="Talk to Amani: Your AI Wellness Companion | InnerSpark" />
        <meta
          property="og:description"
          content="A calm place to talk things through, with a licensed counsellor one tap away."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/talk-to-amani/" />
        <meta property="og:image" content="https://www.innersparkafrica.com/og-image.jpg" />
      </Helmet>
      <Header />
      <main className="pt-20">
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">Talk to Amani, your wellness companion</h1>
            <p className="text-lg text-muted-foreground">
              A calm, private place to talk things through. No account needed. When you want a real person, a licensed
              counsellor is one tap away.
            </p>
          </div>
        </section>

        <section className="pb-10">
          <div className="container mx-auto max-w-3xl px-4">
            <AmaniChat variant="inline" orgKey="innerspark" />
          </div>
        </section>

        <section className="pb-12">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">What Amani can and cannot do</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="mb-3 text-lg font-semibold">Amani can</h3>
                <ul className="space-y-2 text-sm">
                  {CAN.map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="mb-3 text-lg font-semibold">Amani cannot</h3>
                <ul className="space-y-2 text-sm">
                  {CANNOT.map((t) => (
                    <li key={t} className="flex gap-2">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="rounded-2xl bg-primary/5 p-8 text-center">
              <h2 className="mb-2 text-2xl font-bold">Talk to a person</h2>
              <p className="mb-5 text-muted-foreground">
                A licensed counsellor can listen properly and plan support with you, by video or chat.
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link to="/teletherapy" onClick={() => recordAmaniEvent("innerspark", "next_step_clicked")}>
                  Talk to a counsellor
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto max-w-3xl px-4">
            <div role="note" className="flex flex-col items-start gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-950 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">In danger or need help right now?</h2>
                <p className="mt-1 text-sm">Do not wait. Use Urgent help to reach a real person straight away.</p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  recordAmaniEvent("innerspark", "urgent_help_opened");
                  setUrgentOpen(true);
                }}
                className="shrink-0 bg-red-600 text-white hover:bg-red-700"
              >
                <LifeBuoy className="mr-2 h-4 w-4" aria-hidden="true" /> Urgent help
              </Button>
            </div>
          </div>
        </section>
      </main>
      <UrgentHelpModal open={urgentOpen} onOpenChange={setUrgentOpen} />
      <Footer />
    </>
  );
}
