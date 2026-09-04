import { UserCheck } from "lucide-react";

interface ArticleBylineProps {
  /** Named author. Defaults to the InnerSpark clinical editorial team. */
  author?: string;
  /** Optional clinical reviewer — only use a real, internally verified person. */
  reviewer?: { name: string; credential?: string };
  className?: string;
}

/**
 * Visible authorship / clinical-review signal for editorial pages (YMYL trust).
 * Never state a reviewer unless that review genuinely happened.
 */
export default function ArticleByline({ author, reviewer, className }: ArticleBylineProps) {
  return (
    <span className={`flex items-center gap-2 ${className || ""}`}>
      <UserCheck className="h-5 w-5" aria-hidden="true" />
      <span>
        By {author || "InnerSpark Africa Clinical Team"}
        {reviewer && (
          <>
            {" "}&middot; Reviewed by {reviewer.name}
            {reviewer.credential ? `, ${reviewer.credential}` : ""}
          </>
        )}
      </span>
    </span>
  );
}
