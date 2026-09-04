"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLangStore } from "@/lib/store";
import { copy } from "@/lib/i18n";
import panelImg from "@/assets/Paneldiscussion.png";

export default function CtaBanner() {
  const { lang } = useLangStore();
  const t = copy[lang];

  return (
    <section className="relative overflow-hidden py-20 text-paper sm:py-28">
      {/* Background photo */}
      <Image
        src={panelImg}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      {/* Overlay   keeps text legible over the photo, brand-tinted rather
          than plain black so it still reads as DengeVoice. */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo/90 via-indigo/80 to-indigo/50" />

      {/* Ambient blob accents   purely decorative motion */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-marigold/10 blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brick/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-lg"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-marigold">
            {t.ctaBannerEyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight sm:text-4xl">
            {t.ctaBannerTitle}
          </h2>
          <p className="mt-4 max-w-md text-paper/85">{t.ctaBannerBody}</p>
          <Link
            href="/record"
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-marigold px-6 py-3 font-semibold text-indigo shadow-lg shadow-marigold/20 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            {t.ctaStart}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}