"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLangStore } from "@/lib/store";
import { copy } from "@/lib/i18n";
import Header from "@/components/Header";
import TrustPanel from "@/components/TrustPanel";
import CategoriesSection from "@/components/CategoriesSection";
import CtaBanner from "@/components/CtaBanner";
import ProcessSection from "@/components/ProcessSection";
import FeatureBand from "@/components/FeatureBand";
import Footer from "@/components/Footer";
import heroImg from "@/assets/Marketwoman1.png";

export default function LandingPage() {
  const { lang } = useLangStore();
  const t = copy[lang];

  return (
    <main className="min-h-screen text-ink max-w-screen">
      <Header />

      {/* Hero   preserved exactly as before, now with a background photo */}
      <section className="relative overflow-hidden">
        {/* Background photo   kept subtle behind a paper-tinted gradient so
            hero text stays fully legible over any photo. */}
        <Image
          src={heroImg}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-paper/15 via-paper/60 to-paper" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-6 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-6 md:pb-24 md:pt-14">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.09, delayChildren: 0.05 },
              },
            }}
          >
            <motion.span
              variants={heroItem}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo/80 backdrop-blur-sm"
            >
              {t.heroKicker}
            </motion.span>
            <motion.h1
              variants={heroItem}
              className="text-balance font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] text-indigo sm:text-5xl md:text-[3.25rem]"
            >
              {t.heroTitle}
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="mt-5 max-w-md text-lg leading-relaxed text-ink/80"
            >
              {t.heroSubtitle}
            </motion.p>

            <motion.div
              variants={heroItem}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/record"
                className="group flex items-center gap-3 rounded-full bg-marigold py-3 pl-4 pr-6 shadow-lg shadow-marigold/30 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo transition-transform duration-300 group-hover:scale-110">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F7EFDD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </span>
                <span className="font-semibold text-indigo">{t.ctaStart}</span>
              </Link>
              <Link
                href="/record?mode=text"
                className="text-sm font-medium text-ink/60 underline underline-offset-4 transition-colors hover:text-ink"
              >
                {t.ctaTypeInstead}
              </Link>
            </motion.div>
          </motion.div>

          {/* Decorative voice-wave graphic   visual anchor, animated as if
              actively recording */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative hidden aspect-square items-center justify-center rounded-[2.5rem]  md:flex"
          >
            <div className="absolute inset-0 rounded-[2.5rem]" />
            <VoiceWave />
          </motion.div>
        </div>
      </section>

      {/* Storytelling / demo section */}
      <section className="border-y border-indigo/10 bg-indigo py-16 text-paper sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-marigold"
          >
            {t.storyEyebrow}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8"
          >
            <div className="rounded-2xl bg-paper/[0.07] p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-paper/60">
                {t.storyBeforeLabel}
              </p>
              {/* TODO: replace with a real example of mixed Igbo-English
                  speech   this is the app's core value prop and needs to
                  sound authentic to actual speakers. */}
              <p className="font-[family-name:var(--font-display)] text-lg italic leading-snug text-paper/95">
                &ldquo; There is armed robbery happening right now at the market
                in Ariaria, Aba. I need police to come immediately, people are
                in danger &rdquo;
              </p>
            </div>

            <div className="flex justify-center">
              <motion.svg
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-8 w-8 rotate-90 text-marigold md:rotate-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </motion.svg>
            </div>

            <div className="rounded-2xl border border-marigold/30 bg-paper p-6 text-ink">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo/60">
                {t.storyAfterLabel}
              </p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink/50">Category</dt>
                  <dd className="font-medium text-indigo">Security/Crime</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink/50">Location</dt>
                  <dd className="font-medium text-indigo">Ariaria, Aba</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink/50">Emergency</dt>
                  <dd className="font-medium text-brick">High</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </div>
      </section>

      <TrustPanel />
      <CategoriesSection />
      <CtaBanner />
      <ProcessSection />
      <FeatureBand />
      <Footer />
    </main>
  );
}

const heroItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function VoiceWave() {
  const heights = [18, 34, 52, 70, 46, 60, 30, 44, 24, 38];
  return (
    <div className="flex h-40 items-end gap-1.5 sm:h-56 sm:gap-2">
      {heights.map((h, i) => (
        <motion.span
          key={i}
          style={{ height: `${h}%`, transformOrigin: "bottom" }}
          animate={{ scaleY: [1, 1.6, 0.65, 1.35, 0.9, 1] }}
          transition={{
            duration: 1.1 + (i % 4) * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
          className={`w-2.5 rounded-full sm:w-3 ${
            i % 3 === 0
              ? "bg-marigold"
              : i % 3 === 1
                ? "bg-brick"
                : "bg-indigo/70"
          }`}
        />
      ))}
    </div>
  );
}
