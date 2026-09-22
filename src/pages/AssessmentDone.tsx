import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const BLUE = "#3B4FD4";
const NIGHT = "#1A1A2E";
const GREEN = "#2E7D5E";

export default function AssessmentDone() {
  return (
    <div className="min-h-screen grid place-items-center p-6" style={{ background: "linear-gradient(180deg,#F5F6FF,#fff)" }}>
      <Helmet>
        <title>Assessment submitted | InnerSpark</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="max-w-md w-full rounded-3xl border bg-white p-10 text-center shadow-sm" style={{ borderColor: "#E6E8FA" }}>
        <CheckCircle2 className="h-12 w-12 mx-auto mb-4" style={{ color: GREEN }} />
        <h1 className="text-2xl font-bold" style={{ color: NIGHT }}>Thank you</h1>
        <p className="text-sm mt-3 leading-relaxed" style={{ color: "#6B7280" }}>
          Your responses were submitted securely. Your organisation's HR team can download the development report.
          This is not a medical diagnosis.
        </p>
        <Link to="/" className="inline-block mt-6 text-sm font-semibold" style={{ color: BLUE }}>
          Back to InnerSpark
        </Link>
      </div>
    </div>
  );
}
