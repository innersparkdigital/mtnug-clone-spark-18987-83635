/**
 * The reusable structural building blocks of an InnerSpark blog post.
 *
 * Every post — hand-written React posts and CMS posts alike — renders through
 * these so the visual language (info box, crisis box, numbered steps, check
 * grid, FAQ) is identical everywhere. Benchmarked on the
 * "Depression in Uganda" article.
 */
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Lightbulb } from "lucide-react";

/** Light box with a left accent border — the "What you'll learn" / key-point box. */
export const InfoCallout = ({ label, children }: { label?: string; children: ReactNode }) => (
  <div className="bg-accent/50 border-l-4 border-primary p-6 rounded-r-lg my-8">
    <p className="text-foreground font-medium text-lg mb-0">
      {label && <strong>{label} </strong>}
      {children}
    </p>
  </div>
);

/** The standard "What you'll learn" summary box that opens every article. */
export const WhatYouLearn = ({ children }: { children: ReactNode }) => (
  <div className="bg-accent/50 border-l-4 border-primary p-6 rounded-r-lg my-8">
    <p className="text-foreground font-medium text-lg mb-0 flex gap-3">
      <Lightbulb className="h-6 w-6 text-primary shrink-0 mt-0.5" aria-hidden="true" />
      <span>
        <strong>What you'll learn: </strong>
        {children}
      </span>
    </p>
  </div>
);

/**
 * Crisis / safety box for any post touching depression, self-harm, trauma or
 * crisis. Always points to real help.
 */
export const CrisisCallout = ({ children }: { children?: ReactNode }) => (
  <div className="bg-destructive/5 border-l-4 border-destructive p-6 rounded-r-lg my-8">
    <p className="text-foreground font-medium text-lg mb-0 flex gap-3">
      <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
      <span>
        <strong>If you are in crisis right now: </strong>
        {children || (
          <>
            Please use our{" "}
            <Link to="/emergency-support" className="text-primary underline underline-offset-4 font-semibold">
              emergency support page
            </Link>{" "}
            or go to Butabika National Referral Mental Hospital in Kampala. You deserve immediate help — you do not
            have to wait for an appointment.
          </>
        )}
      </span>
    </p>
  </div>
);

/** A sequence of steps as numbered circular badges inside a soft card. */
export const NumberedSteps = ({ title, items }: { title?: string; items: ReactNode[] }) => (
  <div className="bg-secondary p-6 rounded-xl my-8">
    {title && <h4 className="text-xl font-semibold text-foreground mb-4">{title}</h4>}
    <ul className="list-none space-y-3 pl-0">
      {items.map((it, j) => (
        <li key={j} className="flex items-start gap-3">
          <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
            {j + 1}
          </span>
          <span className="text-muted-foreground">{it}</span>
        </li>
      ))}
    </ul>
  </div>
);

/** Two-column card grid with checkmarks — benefits / what's included. */
export const CheckGrid = ({ items }: { items: ReactNode[] }) => (
  <div className="grid md:grid-cols-2 gap-4 my-8">
    {items.map((it, j) => (
      <div key={j} className="bg-accent/30 p-4 rounded-lg flex items-start gap-3">
        <span className="text-primary text-xl leading-none" aria-hidden="true">
          ✓
        </span>
        <span className="text-foreground">{it}</span>
      </div>
    ))}
  </div>
);

/** Closing FAQ section — visually distinct Q&A cards. */
export const FaqSection = ({ items }: { items: { q: string; a: ReactNode }[] }) => {
  if (!items.length) return null;
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {items.map((f, i) => (
          <details key={i} className="bg-accent/30 p-6 rounded-xl group" open={i === 0}>
            <summary className="text-xl font-semibold text-foreground cursor-pointer list-none flex items-start justify-between gap-4">
              <span>{f.q}</span>
              <span className="text-primary shrink-0 transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="text-muted-foreground mt-3 leading-relaxed">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
};

/** Inline booking handoff, used near the top of every article. */
export const BookHandoff = () => (
  <p className="text-muted-foreground mb-6 leading-relaxed">
    If you would rather talk to someone than read on,{" "}
    <Link to="/book-therapist" className="text-primary font-semibold underline underline-offset-4">
      book a session with a licensed Ugandan therapist
    </Link>{" "}
    — video, voice or chat from UGX 30,000, bookable in about two minutes.
  </p>
);

/** Topics that must carry the crisis/safety box. */
const CRISIS_TERMS = [
  "depress",
  "suicid",
  "self-harm",
  "self harm",
  "trauma",
  "ptsd",
  "crisis",
  "grief",
  "abuse",
  "panic",
];

export const needsCrisisCallout = (...text: (string | null | undefined)[]) => {
  const haystack = text.filter(Boolean).join(" ").toLowerCase();
  return CRISIS_TERMS.some((t) => haystack.includes(t));
};
