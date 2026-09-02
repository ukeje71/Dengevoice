"use client";

import { useLangStore } from "@/lib/store";
import { copy } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLangStore();
  const t = copy[lang];

  return (
    <button
      onClick={toggleLang}
      aria-label={`${t.langToggleLabel}: switch to ${lang === "en" ? "Igbo" : "English"}`}
      className="flex items-center gap-2 rounded-full border border-indigo/15 bg-white/70 px-4 py-2 text-sm font-medium text-indigo shadow-sm transition hover:bg-white"
    >
      <span className={lang === "en" ? "font-semibold" : "opacity-45"}>EN</span>
      <span className="opacity-30">/</span>
      <span className={lang === "ig" ? "font-semibold" : "opacity-45"}>IG</span>
    </button>
  );
}
