import type { GlobalLandingProps } from "@/components/seo/GlobalLandingPage";
// Plain JS data module shared with the build-time prerender script.
import { GLOBAL_LANDING_PAGES as RAW } from "../../scripts/global-landing-content.mjs";

/**
 * Country / segment landing page content.
 *
 * The content itself lives in scripts/global-landing-content.mjs so the exact
 * same copy can be written into the raw HTML at build time (see
 * scripts/prerender.mjs). Crawlers therefore see the same unique content a
 * visitor sees, not an empty shell.
 */
export const GLOBAL_LANDING_PAGES: Record<string, GlobalLandingProps> = RAW;
