"use client";

import { useLangStore } from "@/lib/store";
import { copy } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, toggle } = useLangStore();
  const t = copy[lang];

  return (
    <button
      onClick={toggle}
      aria-label={`${t.langToggleLabel}: switch to ${lang === "en" ? "Igbo" : "English"}`}
      className="flex items-center gap-2 rounded-full border border-indigo/20 bg-white/60 px-4 py-2 text-sm font-medium text-indigo transition hover:bg-white"
    >
      <span className={lang === "en" ? "font-semibold" : "opacity-50"}>EN</span>
      <span className="opacity-40">/</span>
      <span className={lang === "ig" ? "font-semibold" : "opacity-50"}>IG</span>
    </button>
  );
}
