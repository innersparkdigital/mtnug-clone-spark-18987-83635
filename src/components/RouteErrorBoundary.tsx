import { Component, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { failed: boolean; message: string; isChunkError: boolean }

const CHUNK_RELOAD_KEY = "isa_chunk_reload_once";

/**
 * Catches render/lazy-import failures so a route never collapses to a blank
 * white page. Stale-deploy chunk errors used to auto-reload — that caused the
 * "page keeps refreshing" loop when users returned after a deploy or switched
 * browsers with a half-cached bundle. We now auto-reload AT MOST once per
 * browser tab session, then show a calm recovery screen.
 */
export default class RouteErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, message: "", isChunkError: false };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error);
    const isChunkError =
      /dynamically imported module|Loading chunk|Importing a module script failed|ChunkLoadError|Failed to fetch/i.test(
        message,
      );
    return { failed: true, message, isChunkError };
  }

  componentDidCatch(error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const isChunkError =
      /dynamically imported module|Loading chunk|Importing a module script failed|ChunkLoadError|Failed to fetch/i.test(
        msg,
      );
    if (!isChunkError) return;

    // Hard cap: one silent reload per tab lifetime. Never loop.
    try {
      if (sessionStorage.getItem(CHUNK_RELOAD_KEY) === "1") return;
      sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
      // Cache-bust so the browser picks up the latest assets once.
      const url = new URL(window.location.href);
      url.searchParams.set("_r", String(Date.now()));
      window.location.replace(url.toString());
    } catch {
      /* sessionStorage blocked — fall through to recovery UI */
    }
  }

  private hardReload = () => {
    try {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("_r");
    url.searchParams.set("_r", String(Date.now()));
    window.location.replace(url.toString());
  };

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">This page didn't finish loading</h1>
          <p className="text-muted-foreground">
            {this.state.isChunkError
              ? "A site update just finished loading, or your connection dropped mid-load. One refresh usually fixes it — the page will not keep refreshing on its own."
              : "Something went wrong on this page. You can reload once or go back home."}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={this.hardReload}
              className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium"
            >
              Reload once
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
