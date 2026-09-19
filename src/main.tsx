import { createRoot } from "react-dom/client";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("InnerSpark app root was not found.");

// Replace build-time SEO markup immediately so refreshes never flash a plain
// homepage/article framework while the route's interactive bundle loads.
if (root.querySelector("[data-prerendered-seo='true']")) {
  const loading = document.createElement("div");
  loading.className = "min-h-screen bg-[#F7F3EA] flex items-center justify-center px-6";
  loading.setAttribute("role", "status");
  loading.setAttribute("aria-live", "polite");

  const card = document.createElement("div");
  card.className = "w-full max-w-sm rounded-3xl border border-[#D9D0BF] bg-white p-8 text-center shadow-sm";

  const mark = document.createElement("div");
  mark.className = "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4A90A4] text-xl font-bold text-white";
  mark.textContent = "I";

  const title = document.createElement("p");
  title.className = "text-lg font-semibold text-[#111827]";
  title.textContent = window.location.pathname === "/amani-ai" || window.location.pathname === "/amani-ai/"
    ? "Opening Amani…"
    : "Opening InnerSpark Africa…";

  const note = document.createElement("p");
  note.className = "mt-2 text-sm text-[#4B5563]";
  note.textContent = "Your page will be ready in a moment.";

  card.append(mark, title, note);
  loading.append(card);
  root.replaceChildren(loading);
}

import("./App.tsx").then(({ default: App }) => {
  createRoot(root).render(<App />);
});
