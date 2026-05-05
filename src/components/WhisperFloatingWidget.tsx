import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { Link } from "react-router-dom";

const WhisperFloatingWidget = () => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
      className="fixed bottom-44 right-6 z-50 flex flex-col items-end gap-2 sm:bottom-44"
    >
      {/* Teaser bubble */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.4 }}
        className="hidden sm:block"
      >
        <Link
          to="/whisper"
          className="flex items-center gap-2 bg-background border border-border rounded-2xl rounded-br-sm pl-3 pr-4 py-2 shadow-lg hover:shadow-xl text-left max-w-[260px]"
          aria-label="Send an anonymous Whisper"
        >
          <span className="text-xs leading-snug">
            <span className="font-semibold text-foreground">Too heavy to type? 🤍</span>
            <span className="block text-muted-foreground">Whisper it. A real therapist replies in 24h — free & anonymous.</span>
          </span>
        </Link>
      </motion.div>

      {/* Mic button — Amani-style */}
      <Link
        to="/whisper"
        aria-label="Send an anonymous Whisper"
        className="relative group"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
          {/* Pulsing ring */}
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl ring-4 ring-background">
            <Mic className="w-6 h-6 text-primary-foreground" />
          </span>
          {/* Online dot */}
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 ring-2 ring-background" />
          {/* Free badge */}
          <span className="absolute -top-1 -left-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-900 text-[9px] font-bold shadow-md">
            FREE
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default WhisperFloatingWidget;