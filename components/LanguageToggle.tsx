"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLangStore, UI_LANGUAGES } from "@/lib/store";
import { copy } from "@/lib/i18n";

// Language picker in the header. Switches the ENTIRE app UI language (landing,
// record, confirm, track) between all supported languages. Options are keyed
// by stable language code, never by translated text (CLAUDE.md gotcha #1).
export default function LanguageToggle() {
  const { lang, setLang } = useLangStore();
  const t = copy[lang];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = UI_LANGUAGES.find((l) => l.code === lang) ?? UI_LANGUAGES[0];

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.94 }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.langToggleLabel}
        className="flex items-center gap-1.5 rounded-full border border-indigo/15 bg-white/70 px-3.5 py-2 text-sm font-medium text-indigo shadow-sm transition-colors hover:bg-white"
      >
        {/* Globe glyph keeps the control recognizable as a language switcher
            even when the current label is in an unfamiliar script. */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="max-w-[6rem] truncate">{current.native}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-indigo/10 bg-paper/95 py-1 shadow-lg backdrop-blur-md"
          >
            {UI_LANGUAGES.map((l) => {
              const active = l.code === lang;
              return (
                <li key={l.code} role="option" aria-selected={active}>
                  <button
                    onClick={() => {
                      setLang(l.code);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                      active
                        ? "bg-indigo/5 font-semibold text-indigo"
                        : "text-ink/70 hover:bg-indigo/5 hover:text-indigo"
                    }`}
                  >
                    {l.native}
                    {active && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
