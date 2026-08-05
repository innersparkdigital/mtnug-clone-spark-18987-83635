import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BookingFormModal from "@/components/BookingFormModal";

const BOOK_TEXT = /\b(book (a |your )?(session|therapist|appointment)|get started now|start booking|book now)\b/i;

/**
 * Site-wide booking entry point.
 * Any link to /book-therapist (or element marked with data-book-session)
 * opens the "Find your therapist" intake modal instead of navigating away.
 */
const GlobalBookingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const openFromEvent = () => setIsOpen(true);
    window.addEventListener("innerspark:open-booking", openFromEvent);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest<HTMLElement>("a, button, [data-book-session]");
      if (!el) return;

      // Never hijack the intake modal's own controls
      if (el.closest("[role='dialog']")) return;
      if (el.hasAttribute("data-no-booking-modal")) return;

      const anchor = el as HTMLAnchorElement;
      const href = anchor.getAttribute?.("href") || "";
      const isBookingLink = /^\/book-therapist(\?|#|$)/.test(href);
      const isMarked = el.hasAttribute("data-book-session");
      const isBookingText =
        !href && el.tagName === "BUTTON" && BOOK_TEXT.test((el.textContent || "").trim());

      if (!isBookingLink && !isMarked && !isBookingText) return;

      e.preventDefault();
      e.stopPropagation();
      setIsOpen(true);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("innerspark:open-booking", openFromEvent);
    };
  }, []);

  // Close on route change so the modal never lingers
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return <BookingFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} formType="book" />;
};

export default GlobalBookingModal;