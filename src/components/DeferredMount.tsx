import { ReactNode, useEffect, useState } from "react";

interface DeferredMountProps {
  children: ReactNode;
  /** Fallback delay (ms) when requestIdleCallback is unavailable. */
  delay?: number;
}

/**
 * Mounts children only after the page has finished loading and the browser is
 * idle (or the visitor interacts). Keeps non-critical widgets — chat, floating
 * CTAs — out of the render-critical path so FCP/LCP stay fast on mobile.
 */
const DeferredMount = ({ children, delay = 2000 }: DeferredMountProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let idleHandle: number | undefined;
    let timer: number | undefined;
    const reveal = () => setShow(true);

    const schedule = () => {
      const w = window as any;
      if (typeof w.requestIdleCallback === "function") {
        idleHandle = w.requestIdleCallback(reveal, { timeout: delay + 2000 });
      } else {
        timer = window.setTimeout(reveal, delay);
      }
    };

    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, reveal, { passive: true, once: true }));

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, reveal));
      if (idleHandle !== undefined) (window as any).cancelIdleCallback?.(idleHandle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [delay]);

  return show ? <>{children}</> : null;
};

export default DeferredMount;
