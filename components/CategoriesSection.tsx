"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useLangStore } from "@/lib/store";
import { copy } from "@/lib/i18n";
import { CATEGORIES } from "@/types/complaint";

// No exact "Power/Electricity" photo in the assets folder — using
// Marketsquare as a general civic/infrastructure stand-in. Swap this one
// first if you get a proper power/electricity photo later.
import catPowerImg from "@/assets/Marketsquare.png";
import catWaterImg from "@/assets/Communittytap.png";
import catRoadsImg from "@/assets/Badroad.png";
import catHealthImg from "@/assets/Healthfacility.png";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function CategoriesSection() {
  const { lang } = useLangStore();
  const t = copy[lang];
  const [showAll, setShowAll] = useState(false);

  const featured = [
    { title: t.catPowerTitle, desc: t.catPowerDesc, img: catPowerImg },
    { title: t.catWaterTitle, desc: t.catWaterDesc, img: catWaterImg },
    { title: t.catRoadsTitle, desc: t.catRoadsDesc, img: catRoadsImg },
    { title: t.catHealthTitle, desc: t.catHealthDesc, img: catHealthImg },
  ];
  const featuredNames = new Set(featured.map((f) => f.title));
  // Remaining categories shown as a simple expandable list — these don't
  // have translated copy yet (see types/complaint.ts CATEGORIES), so they
  // render as plain labels rather than full description cards.
  const remaining = CATEGORIES.filter((c) => !featuredNames.has(c));

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 max-w-xl"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brick">
          {t.categoriesEyebrow}
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-indigo sm:text-3xl">
          {t.categoriesTitle}
        </h2>
        <p className="mt-3 text-ink/70">{t.categoriesSubtitle}</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {featured.map((cat) => (
          <motion.div
            key={cat.title}
            variants={item}
            whileHover={{ y: -4 }}
            className="group rounded-2xl border border-indigo/10 bg-white/40 p-4 transition-shadow hover:shadow-lg hover:shadow-indigo/5"
          >
            <div className="relative mb-4  w-full overflow-hidden rounded-sm h-70">
              <Image
                src={cat.img}
                alt={cat.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <h3 className="font-semibold text-indigo">{cat.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink/65">
              {cat.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <button
        onClick={() => setShowAll((v) => !v)}
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo underline underline-offset-4"
      >
        {t.viewAllCategories}
        <motion.svg
          animate={{ rotate: showAll ? 90 : 0 }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-5 flex flex-wrap gap-2">
              {remaining.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-indigo/15 bg-white/50 px-3 py-1.5 text-sm text-ink/75"
                >
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
