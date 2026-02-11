import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface RelatedArticle {
  slug: string;
  title: string;
  category: string;
}

const allArticles: RelatedArticle[] = [
  { slug: "how-to-find-a-therapist", title: "How to Find a Therapist: Complete Guide", category: "Finding Help" },
  { slug: "signs-of-depression", title: "10 Warning Signs of Depression You Shouldn't Ignore", category: "Depression" },
  { slug: "anxiety-symptoms", title: "Anxiety Symptoms: How to Recognize Anxiety Disorder", category: "Anxiety" },
  { slug: "how-to-manage-anxiety", title: "How to Manage Anxiety: Expert-Backed Strategies", category: "Anxiety" },
  { slug: "what-is-mental-health", title: "What Is Mental Health? Conditions & Warning Signs", category: "Mental Health" },
  { slug: "how-to-deal-with-depression", title: "How to Deal With Depression: Strategies That Help", category: "Depression" },
  { slug: "how-to-stop-a-panic-attack", title: "How to Stop a Panic Attack: Fast Techniques", category: "Panic" },
  { slug: "how-to-handle-stress", title: "How to Handle Stress: Practical Ways to Regain Control", category: "Stress" },
];

interface RelatedArticlesProps {
  currentSlug: string;
  maxArticles?: number;
}

const RelatedArticles = ({ currentSlug, maxArticles = 3 }: RelatedArticlesProps) => {
  const related = allArticles
    .filter(a => a.slug !== currentSlug)
    .slice(0, maxArticles);

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {related.map((article) => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              className="group block p-6 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {article.category}
              </span>
              <h3 className="text-lg font-semibold text-foreground mt-2 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <span className="inline-flex items-center text-sm text-primary mt-3 font-medium">
                Read More <ArrowRight className="h-3 w-3 ml-1" />
              </span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            View All Articles <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;
