import { Component, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { failed: boolean; message: string }

const CHUNK_RELOAD_KEY = "isa_chunk_reload_at";

/**
 * Catches render/lazy-import failures so a route never collapses to a blank
 * white page. Stale-deploy chunk errors ("Failed to fetch dynamically imported
 * module") self-heal with a single reload; anything else shows a readable
 * message plus recovery links.
 */
export default class RouteErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return { failed: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const isChunkError = /dynamically imported module|Loading chunk|Importing a module script failed|ChunkLoadError/i.test(msg);
    if (!isChunkError) return;
    // Only auto-reload once per minute to avoid loops.
    const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
    if (Date.now() - last > 60_000) {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
      window.location.reload();
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-3">This page didn't finish loading</h1>
          <p className="text-muted-foreground mb-6">
            Your connection dropped or an update just went live. Reloading usually fixes it.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium"
            >
              Reload page
            </button>
            <a href="/book-therapist" className="px-5 py-2.5 rounded-md border border-border font-medium">
              Book a session
            </a>
            <a href="/" className="px-5 py-2.5 rounded-md border border-border font-medium">
              Go to homepage
            </a>
          </div>
        </div>
      </div>
    );
  }
}
