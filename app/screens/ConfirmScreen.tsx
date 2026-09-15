"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { copy } from "@/lib/i18n";
import { CATEGORIES } from "@/types/complaint";
import type { Category, Urgency } from "@/types/complaint";
import Header from "@/components/Header";
import ProgressSteps from "@/components/ProgressSteps";
import Loader from "@/components/Loader";

type LoadState = "structuring" | "ready" | "error";

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function ConfirmScreen() {
  const router = useRouter();
  const { lang, draft, setDraft, resetDraft } = useAppStore();
  const t = copy[lang];

  const [loadState, setLoadState] = useState<LoadState>(() =>
    draft.category ? "ready" : "structuring",
  );
  const [structureError, setStructureError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!draft.originalTranscript) {
      router.replace("/record");
      return;
    }
    if (draft.category) {
      // Already structured (e.g. navigated back here) — initial state
      // above already reflects "ready", nothing to do.
      return;
    }

    fetch("/api/structure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: draft.originalTranscript,
        primaryLanguage: draft.primaryLanguage,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Structuring failed");
        setDraft({
          translatedSummary: data.translatedSummary,
          originalSummary: data.originalSummary,
          category: data.category,
          location: data.location,
          urgency: data.urgency,
          desiredOutcome: data.desiredOutcome,
          incidentDate: new Date().toISOString(),
        });
        setLoadState("ready");
      })
      .catch((err) => {
        setStructureError(
          err instanceof Error ? err.message : "Structuring failed",
        );
        setDraft({ incidentDate: new Date().toISOString() });
        setLoadState("ready");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      const trackingId = data.trackingId;
      resetDraft();
      router.push(`/track?id=${trackingId}&justSubmitted=true`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Header />

      <div className="mx-auto max-w-lg px-6 pb-20 pt-10 sm:pt-16">
        <ProgressSteps current={3} />

        <AnimatePresence mode="wait">
          {loadState === "structuring" ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-10 rounded-[2.5rem] border border-indigo/10 bg-white/50 px-8"
            >
              <Loader message={t.confirmReviewing} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-8"
            >
              <h1 className="mb-1 text-balance font-[family-name:var(--font-display)] text-2xl font-semibold text-indigo">
                {t.confirmTitle}
              </h1>
              <p className="mb-6 text-sm text-ink/60">{t.confirmSubtitle}</p>

              {structureError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-6 overflow-hidden  rounded-sm border border-brick/30 bg-brick/10 p-3 text-sm text-brick"
                >
                  {t.confirmAutofillError}
                </motion.div>
              )}

              <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                className="rounded-[2.25rem] border border-indigo/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(247,239,221,0.7))] p-5 shadow-[0_24px_60px_rgba(34,48,74,0.08)] ring-1 ring-white/60 sm:p-8"
              >
                <Field variants={fieldVariants} label={t.confirmFieldSaid}>
                  <textarea
                    value={draft.originalTranscript ?? ""}
                    onChange={(e) =>
                      setDraft({ originalTranscript: e.target.value })
                    }
                    rows={4}
                    className={inputClass}
                  />
                </Field>

                {draft.primaryLanguage && draft.primaryLanguage !== "en" && (
                  <Field
                    variants={fieldVariants}
                    label={t.confirmFieldOriginalSummary}
                  >
                    <textarea
                      value={draft.originalSummary ?? ""}
                      onChange={(e) =>
                        setDraft({ originalSummary: e.target.value })
                      }
                      rows={3}
                      placeholder={t.confirmOriginalSummaryPlaceholder}
                      className={inputClass}
                    />
                  </Field>
                )}

                <Field
                  variants={fieldVariants}
                  label={t.confirmFieldEnglishSummary}
                >
                  <textarea
                    value={draft.translatedSummary ?? ""}
                    onChange={(e) =>
                      setDraft({ translatedSummary: e.target.value })
                    }
                    rows={3}
                    className={inputClass}
                  />
                </Field>

                <Field variants={fieldVariants} label={t.confirmFieldCategory}>
                  <select
                    value={draft.category ?? ""}
                    onChange={(e) =>
                      setDraft({ category: e.target.value as Category })
                    }
                    className={inputClass}
                  >
                    <option value="" disabled>
                      {t.confirmCategoryPlaceholder}
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field variants={fieldVariants} label={t.confirmFieldLocation}>
                  <input
                    type="text"
                    value={draft.location ?? ""}
                    onChange={(e) => setDraft({ location: e.target.value })}
                    placeholder={t.confirmLocationPlaceholder}
                    className={inputClass}
                  />
                </Field>

                <Field variants={fieldVariants} label={t.confirmFieldUrgency}>
                  <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(["low", "medium", "high", "emergency"] as Urgency[]).map(
                      (u) => {
                        const active = draft.urgency === u;
                        const activeClass = URGENCY_ACTIVE[u];
                        return (
                          <motion.button
                            key={u}
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            animate={{ scale: active ? 1.02 : 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 24,
                            }}
                            onClick={() => setDraft({ urgency: u })}
                            className={`rounded-2xl border px-3 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 sm:text-sm ${
                              active
                                ? `${activeClass} shadow-[0_10px_24px_rgba(34,48,74,0.12)]`
                                : "border-indigo/15 bg-white/80 text-indigo hover:border-indigo/35 hover:bg-indigo/5"
                            }`}
                          >
                            {t[URGENCY_LABEL_KEYS[u]] ?? u}
                          </motion.button>
                        );
                      },
                    )}
                  </div>
                </Field>

                <Field variants={fieldVariants} label={t.confirmFieldOutcome}>
                  <textarea
                    value={draft.desiredOutcome ?? ""}
                    onChange={(e) =>
                      setDraft({ desiredOutcome: e.target.value })
                    }
                    rows={2}
                    className={inputClass}
                  />
                </Field>

                <motion.div
                  variants={fieldVariants}
                  className={`mb-4 flex flex-col gap-3 rounded-[1.5rem] border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-300 sm:flex-row sm:items-center sm:justify-between ${
                    draft.isAnonymous
                      ? "border-palm/30 bg-gradient-to-r from-palm/12 via-white/70 to-white/90"
                      : "border-indigo/15 bg-white/80"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <motion.span
                      animate={{
                        backgroundColor: draft.isAnonymous
                          ? "#4F7942"
                          : "rgba(34, 48, 74, 0.08)",
                        color: draft.isAnonymous ? "#F7EFDD" : "#22304A",
                      }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-inner"
                    >
                      <svg
                        width="16"
                        height="16"
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
                    </motion.span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-indigo">
                        {t.confirmAnonTitle}
                      </p>
                      <p className="text-xs leading-relaxed text-ink/60">
                        {t.confirmAnonBody}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setDraft({ isAnonymous: !draft.isAnonymous })
                    }
                    aria-pressed={draft.isAnonymous}
                    aria-label={t.confirmAnonTitle}
                    className={`relative ml-auto h-8 w-14 shrink-0 rounded-full border transition-all duration-300 sm:ml-0 ${
                      draft.isAnonymous
                        ? "border-palm/60 bg-palm shadow-[0_8px_18px_rgba(79,121,66,0.25)]"
                        : "border-indigo/15 bg-indigo/10"
                    }`}
                  >
                    <motion.span
                      animate={{
                        x: draft.isAnonymous ? 28 : 4,
                        backgroundColor: draft.isAnonymous
                          ? "#fffdf7"
                          : "#ffffff",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_4px_10px_rgba(34,48,74,0.18)]"
                    />
                  </button>
                </motion.div>

                <AnimatePresence>
                  {!draft.isAnonymous && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-2 flex flex-col gap-3 overflow-hidden"
                    >
                      <input
                        type="text"
                        value={draft.contactName ?? ""}
                        onChange={(e) =>
                          setDraft({ contactName: e.target.value })
                        }
                        placeholder={t.confirmNamePlaceholder}
                        className={inputClass}
                      />
                      <input
                        type="tel"
                        value={draft.contactPhone ?? ""}
                        onChange={(e) =>
                          setDraft({ contactPhone: e.target.value })
                        }
                        placeholder={t.confirmPhonePlaceholder}
                        className={inputClass}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {submitError && (
                  <p className="mb-4 mt-2 text-sm text-brick">{submitError}</p>
                )}

                <motion.button
                  variants={fieldVariants}
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !draft.category}
                  whileTap={
                    !submitting && draft.category ? { scale: 0.97 } : undefined
                  }
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-marigold py-4 font-semibold text-indigo transition disabled:opacity-40"
                >
                  {submitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-4 w-4 rounded-full border-2 border-indigo/30 border-t-indigo"
                      />
                      {t.confirmSubmitting}
                    </>
                  ) : (
                    t.confirmSubmitBtn
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

const inputClass =
  "mb-6 w-full rounded-2xl border border-indigo/15 bg-white/80 px-4 py-3 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] outline-none transition-all duration-200 placeholder:text-ink/35 focus:border-indigo focus:bg-white focus:ring-4 focus:ring-indigo/10";

// Full literal class strings per urgency level. Higher urgency reads hotter
// (palm → indigo → marigold → brick), giving the selector a sense of weight.
// Must stay literal so Tailwind generates the CSS (CLAUDE.md gotcha #3).
const URGENCY_ACTIVE: Record<Urgency, string> = {
  low: "border-palm bg-palm text-paper",
  medium: "border-indigo bg-indigo text-paper",
  high: "border-marigold bg-marigold text-indigo",
  emergency: "border-brick bg-brick text-paper",
};

// Urgency labels resolve per-language via i18n key, keyed off the stable
// English enum value (CLAUDE.md gotcha #2 — never key logic off translated text).
const URGENCY_LABEL_KEYS: Record<Urgency, string> = {
  low: "confirmUrgencyLow",
  medium: "confirmUrgencyMedium",
  high: "confirmUrgencyHigh",
  emergency: "confirmUrgencyEmergency",
};

function Field({
  label,
  children,
  variants,
}: {
  label: string;
  children: React.ReactNode;
  variants: typeof fieldVariants;
}) {
  return (
    <motion.div variants={variants}>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo/80">
        {label}
      </label>
      {children}
    </motion.div>
  );
}
