"use client";

import { motion } from "framer-motion";
import { useLangStore } from "@/lib/store";
import { copy } from "@/lib/i18n";

// Visualizes where a complaint sits in its lifecycle (received -> under
// review -> in progress -> resolved). "closed" is treated as reaching the
// final stage too, but its real label still shows above in TrackScreen —
// this component only draws the stage positions.
// Stage list keys off stable English enum values; the displayed label is
// looked up per-language via the i18n key (CLAUDE.md gotcha #2).
const STAGES = ["received", "under_review", "in_progress", "resolved"] as const;
const STAGE_LABEL_KEYS: Record<string, string> = {
  received: "statusReceived",
  under_review: "statusUnderReview",
  in_progress: "statusInProgress",
  resolved: "statusResolved",
};

export default function StatusStepper({ status }: { status: string }) {
  const { lang } = useLangStore();
  const t = copy[lang];
  const isTerminal = status === "resolved" || status === "closed";
  let activeIndex = STAGES.indexOf(status as (typeof STAGES)[number]);
  if (activeIndex === -1) activeIndex = isTerminal ? STAGES.length - 1 : 0;

  return (
    <div className="flex w-full items-start">
      {STAGES.map((stage, i) => {
        const complete = i < activeIndex || (i === activeIndex && isTerminal);
        const current = i === activeIndex && !isTerminal;
        return (
          <div key={stage} className="flex flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative flex h-6 w-6 items-center justify-center">
                {current && (
                  <motion.span
                    animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-marigold"
                  />
                )}
                <span
                  className={`relative flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                    complete
                      ? "bg-indigo text-paper"
                      : current
                        ? "bg-marigold text-indigo"
                        : "bg-indigo/10 text-indigo/40"
                  }`}
                >
                  {complete ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
              </div>
              <span className="hidden text-center text-[10px] font-medium text-ink/60 sm:block">
                {t[STAGE_LABEL_KEYS[stage]] ?? stage}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div className="mx-1.5 mt-3 h-0.5 flex-1 bg-indigo/15">
                <motion.div
                  animate={{ width: i < activeIndex ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                  className="h-0.5 bg-indigo"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}