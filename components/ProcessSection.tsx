"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLangStore } from "@/lib/store";
import { copy } from "@/lib/i18n";
import step1Img from "@/assets/woman.png";
import step2Img from "@/assets/Marketwoman.png";
import step3Img from "@/assets/two-women.png";
import step4Img from "@/assets/Farmer.png";

export default function ProcessSection() {
  const { lang } = useLangStore();
  const t = copy[lang];

  const stepBg = ["bg-marigold", "bg-brick", "bg-palm", "bg-indigo"] as const;
  // These 4 images are generic community photos, not literal screenshots of
  // "reviewing a transcript" etc.   your assets folder doesn't have app
  // screenshots, so these are stand-ins. Worth swapping for real in-app
  // screenshots once you have them; that'll sell the product much better
  // than stock-feeling photos here specifically.
  const steps = [
    { title: t.step1Title, body: t.step1Body, img: step1Img },
    { title: t.step2Title, body: t.step2Body, img: step2Img },
    { title: t.step3Title, body: t.step3Body, img: step3Img },
    { title: t.step4Title, body: t.step4Body, img: step4Img },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-16 max-w-lg text-center"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brick">
          {t.processEyebrow}
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-indigo sm:text-3xl">
          {t.processTitle}
        </h2>
        <p className="mt-3 text-ink/70">{t.processSubtitle}</p>
      </motion.div>

      <div className="space-y-16 sm:space-y-24">
        {steps.map((step, i) => {
          const reversed = i % 2 === 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <div className={reversed ? "md:order-2" : "md:order-1"}>
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full text-base font-bold text-paper ${stepBg[i]}`}
                >
                  {i + 1}
                </motion.span>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-indigo">
                  {step.title.replace(/^\d+\.\s*/, "")}
                </h3>
                <p className="mt-2 max-w-sm leading-relaxed text-ink/70">
                  {step.body}
                </p>
              </div>
              <div
                className={`group relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] ${reversed ? "md:order-1" : "md:order-2"}`}
              >
                <Image
                  src={step.img}
                  alt={step.title.replace(/^\d+\.\s*/, "")}
                  fill
                  loading="eager"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
