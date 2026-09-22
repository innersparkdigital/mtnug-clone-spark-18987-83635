import { getEncouragement, getGreeting } from "@/lib/clientEncouragements";

interface Props {
  fullName: string;
  therapistName: string;
}

const GreetingBlock = ({ fullName, therapistName }: Props) => {
  const greeting = getGreeting(fullName);
  const line = getEncouragement();
  const first = fullName?.trim()?.split(/\s+/)[0] || "";
  const initial = (first || "I").charAt(0).toUpperCase();

  return (
    <div className="fade-in-calm relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/[0.07] via-background to-amber-500/[0.06] p-5 sm:p-7">
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
      <div className="relative flex items-start gap-4">
        <div
          className="hidden sm:grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-bold text-primary-foreground shadow-sm"
          style={{ background: "linear-gradient(145deg, hsl(var(--primary)), hsl(173 45% 42%))" }}
          aria-hidden
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">Your private space</div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mt-1.5 leading-tight tracking-tight text-foreground">
            {greeting}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-xl leading-relaxed">
            {line}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Guided by {therapistName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreetingBlock;
