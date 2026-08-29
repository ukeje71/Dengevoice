"use client";

import { useLangStore } from "@/lib/store";
import { copy } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";

export default function LandingPage() {
  const { lang } = useLangStore();
  const t = copy[lang];

  const steps = [
    { title: t.step1Title, body: t.step1Body },
    { title: t.step2Title, body: t.step2Body },
    { title: t.step3Title, body: t.step3Body },
    { title: t.step4Title, body: t.step4Body },
  ];

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* Top bar */}
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <span className="text-lg font-bold tracking-tight text-indigo">
          {t.appName}
        </span>
        <LanguageToggle />
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-10 text-center">
        <h1 className="text-4xl font-bold leading-tight text-indigo sm:text-5xl">
          {t.heroTitle}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/80">
          {t.heroSubtitle}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3">
          <a
            href="/record"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-marigold shadow-lg shadow-marigold/30 transition hover:scale-105"
            aria-label={t.ctaStart}
          >
            {/* mic icon */}
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22304A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </a>
          <span className="text-sm font-medium text-indigo">{t.ctaStart}</span>
          <a
            href="/record?mode=text"
            className="text-sm text-ink/60 underline underline-offset-2"
          >
            {t.ctaTypeInstead}
          </a>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-indigo/70">
          {t.stepsTitle}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-2xl border border-indigo/10 bg-white/50 p-5"
            >
              <p className="mb-1 font-semibold text-indigo">{step.title}</p>
              <p className="text-sm text-ink/75">{step.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
