"use client";

import { motion, type Variants } from "framer-motion";
import { useLangStore } from "@/lib/store";
import { copy } from "@/lib/i18n";

// "Why report here" trust panel. Directly answers the real friction that
// keeps people from reporting in person — language barrier, travel, fear of
// being judged, fear of being identified, and reports being ignored. This is
// an additive positioning angle, not a pivot: DengeVoice stays a general
// civic complaint platform (see CategoriesSection for the full 13 categories).
//
// Follows the FeatureBand pattern (inline SVG icons + staggered reveal) but
// keeps its own paper-toned look so it reads as a distinct section.

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// Icon set keyed by stable index (never by translated title). Each point
// pairs a literal accent-color class — no dynamically-built class names, so
// Tailwind can see every class at build time (see CLAUDE.md gotcha #3).
function ChatIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
function ReceiptIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 3v18l2.5-1.5L10 21l2-1.5L14 21l2.5-1.5L19 21V3z" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

export default function TrustPanel() {
  const { lang } = useLangStore();
  const t = copy[lang];

  // `id` is a stable, language-independent key. Title/body are display-only.
  const points = [
    {
      id: "language",
      icon: <ChatIcon />,
      accent: "bg-marigold text-indigo",
      title: t.trust1Title,
      body: t.trust1Body,
    },
    {
      id: "travel",
      icon: <HomeIcon />,
      accent: "bg-palm text-paper",
      title: t.trust2Title,
      body: t.trust2Body,
    },
    {
      id: "judgment",
      icon: <HeartIcon />,
      accent: "bg-brick text-paper",
      title: t.trust3Title,
      body: t.trust3Body,
    },
    {
      id: "anonymous",
      icon: <LockIcon />,
      accent: "bg-indigo text-paper",
      title: t.trust4Title,
      body: t.trust4Body,
    },
    {
      id: "record",
      icon: <ReceiptIcon />,
      accent: "bg-marigold text-indigo",
      title: t.trust5Title,
      body: t.trust5Body,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brick">
          {t.trustEyebrow}
        </p>
        <h2 className="text-balance font-[family-name:var(--font-display)] text-2xl font-semibold text-indigo sm:text-3xl">
          {t.trustTitle}
        </h2>
        <p className="mt-3 text-ink/70">{t.trustSubtitle}</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {points.map((p, i) => (
          <motion.div
            key={p.id}
            variants={item}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            // Last card spans two columns on the 3-up grid so the row of 5
            // stays visually balanced instead of leaving an awkward gap.
            className={`woven-texture group relative overflow-hidden rounded-[2rem] border border-indigo/10 bg-white/50 p-6 transition-shadow hover:shadow-lg hover:shadow-indigo/5 ${
              i === 4 ? "lg:col-span-1" : ""
            }`}
          >
            <span
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${p.accent} transition-transform duration-300 group-hover:scale-110`}
            >
              {p.icon}
            </span>
            <h3 className="font-semibold text-indigo">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
