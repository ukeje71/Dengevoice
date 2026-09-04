"use client";

import { motion } from "framer-motion";
import { useLangStore } from "@/lib/store";
import { copy } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLangStore();
  const t = copy[lang];

  return (
    <motion.button
      onClick={toggleLang}
      whileTap={{ scale: 0.94 }}
      aria-label={`${t.langToggleLabel}: switch to ${lang === "en" ? "Igbo" : "English"}`}
      className="flex items-center gap-2 rounded-full border border-indigo/15 bg-white/70 px-4 py-2 text-sm font-medium text-indigo shadow-sm transition-colors hover:bg-white"
    >
      <span className={`transition-opacity ${lang === "en" ? "font-semibold" : "opacity-45"}`}>
        EN
      </span>
      <span className="opacity-30">/</span>
      <span className={`transition-opacity ${lang === "ig" ? "font-semibold" : "opacity-45"}`}>
        IG
      </span>
    </motion.button>
  );
}
