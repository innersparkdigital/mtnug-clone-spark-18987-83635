import { useEffect, useMemo, useRef, useState } from "react";
import { PHONE_COUNTRIES, detectDefaultDial, splitE164, toE164 } from "@/lib/phoneCountries";

interface PhoneFieldProps {
  /** Full E.164 value, e.g. "+256792085773". */
  value: string;
  onChange: (e164: string) => void;
  id?: string;
  placeholder?: string;
  autoFocus?: boolean;
  compact?: boolean;
  disabled?: boolean;
  className?: string;
  /** Overrides page-based country detection. */
  defaultDial?: string;
  "aria-label"?: string;
}

/**
 * Country-code selector + local number input. Always reports the full
 * international (E.164) number to the parent so it is stored that way.
 */
export default function PhoneField({
  value,
  onChange,
  id,
  placeholder = "e.g. 792 085 773",
  autoFocus,
  compact,
  disabled,
  className = "",
  defaultDial,
  "aria-label": ariaLabel,
}: PhoneFieldProps) {
  const initial = useMemo(() => {
    if (value) return splitE164(value, defaultDial || detectDefaultDial());
    return { dial: defaultDial || detectDefaultDial(), local: "" };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [dial, setDial] = useState(initial.dial);
  const [local, setLocal] = useState(initial.local);
  const lastEmitted = useRef<string>(value);

  // Keep the parent in sync whenever either half changes.
  useEffect(() => {
    const next = toE164(dial, local);
    if (next !== lastEmitted.current) {
      lastEmitted.current = next;
      onChange(next);
    }
  }, [dial, local]); // eslint-disable-line react-hooks/exhaustive-deps

  // Allow the parent to reset the field (e.g. after a successful submit).
  useEffect(() => {
    if (!value && lastEmitted.current) {
      lastEmitted.current = "";
      setLocal("");
    }
  }, [value]);

  const pad = compact ? "px-2 py-1.5 text-xs" : "px-3 py-2.5 text-sm";
  const base = "bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60";

  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        aria-label="Country code"
        disabled={disabled}
        value={dial}
        onChange={(e) => setDial(e.target.value)}
        className={`${base} ${pad} shrink-0 max-w-[7.5rem]`}
      >
        {PHONE_COUNTRIES.map((c) => (
          <option key={c.iso} value={c.dial}>
            {c.flag} +{c.dial}
          </option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoFocus={autoFocus}
        disabled={disabled}
        aria-label={ariaLabel || "Phone number"}
        placeholder={placeholder}
        value={local}
        maxLength={18}
        onChange={(e) => setLocal(e.target.value.replace(/[^\d\s()-]/g, ""))}
        className={`${base} ${pad} flex-1 min-w-0`}
      />
    </div>
  );
}
