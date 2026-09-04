"use client";

import { motion } from "framer-motion";
import { useLangStore } from "@/lib/store";
import { copy } from "@/lib/i18n";

// Small step indicator reused across the record/confirm/track flow so
// people always know where they are. Pulls labels from the same step1-4
// copy used on the landing page's process section, for consistency.
export default function ProgressSteps({ current }: { current: 1 | 2 | 3 | 4 }) {
  const { lang } = useLangStore();
  const t = copy[lang];

  const labels = [
    t.step1Title.replace(/^\d+\.\s*/, ""),
    t.step2Title.replace(/^\d+\.\s*/, ""),
    t.step3Title.replace(/^\d+\.\s*/, ""),
    t.step4Title.replace(/^\d+\.\s*/, ""),
  ];

  return (
    <div className="mx-auto flex w-full max-w-sm items-center justify-between">
      {labels.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  scale: active ? 1.15 : 1,
                  backgroundColor: done || active ? "#22304A" : "#22304A0D",
                }}
                transition={{ duration: 0.3 }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F7EFDD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className={active ? "text-paper" : "text-indigo/40"}>{step}</span>
                )}
              </motion.div>
              <span
                className={`hidden text-[11px] font-medium sm:block ${
                  active ? "text-indigo" : "text-ink/40"
                }`}
              >
                {label}
              </span>
            </div>
            {step < 4 && (
              <div className="mx-2 h-px flex-1 bg-indigo/15">
                <motion.div
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                  className="h-px bg-indigo"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}