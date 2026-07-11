import { getEncouragement, getGreeting } from "@/lib/clientEncouragements";

interface Props {
  fullName: string;
  therapistName: string;
}

const GreetingBlock = ({ fullName, therapistName }: Props) => {
  const greeting = getGreeting(fullName);
  const line = getEncouragement();
  return (
    <div className="fade-in-calm">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">Your space</div>
      <h1 className="text-3xl sm:text-4xl font-semibold mt-1 leading-tight tracking-tight">
        {greeting}
      </h1>
      <p className="text-base text-muted-foreground mt-3 max-w-xl leading-relaxed">
        {line}
      </p>
      <p className="text-xs text-muted-foreground/80 mt-3">
        Put together by {therapistName}.
      </p>
    </div>
  );
};

export default GreetingBlock;