"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
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
  const { draft, setDraft, resetDraft } = useAppStore();

  const [loadState, setLoadState] = useState<LoadState>(() =>
    draft.category ? "ready" : "structuring"
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
      body: JSON.stringify({ transcript: draft.originalTranscript }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Structuring failed");
        setDraft({
          translatedSummary: data.translatedSummary,
          category: data.category,
          location: data.location,
          urgency: data.urgency,
          desiredOutcome: data.desiredOutcome,
          incidentDate: new Date().toISOString(),
        });
        setLoadState("ready");
      })
      .catch((err) => {
        setStructureError(err instanceof Error ? err.message : "Structuring failed");
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
              <Loader message="Reviewing your report…" />
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
                Does this look right?
              </h1>
              <p className="mb-6 text-sm text-ink/60">
                We&apos;ve turned what you said into a report. Read it over, fix
                anything that&apos;s off, and send it when you&apos;re happy.
              </p>

              {structureError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-6 overflow-hidden rounded-2xl border border-brick/30 bg-brick/10 p-3 text-sm text-brick"
                >
                  Auto-fill isn&apos;t available right now ({structureError}). Please
                  fill the fields below manually.
                </motion.div>
              )}

              <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                className="rounded-[2.5rem] border border-indigo/10 bg-white/50 p-6 sm:p-8"
              >
                <Field variants={fieldVariants} label="What you said">
                  <textarea
                    value={draft.originalTranscript ?? ""}
                    onChange={(e) => setDraft({ originalTranscript: e.target.value })}
                    rows={4}
                    className={inputClass}
                  />
                </Field>

                <Field variants={fieldVariants} label="Summary">
                  <textarea
                    value={draft.translatedSummary ?? ""}
                    onChange={(e) => setDraft({ translatedSummary: e.target.value })}
                    rows={3}
                    className={inputClass}
                  />
                </Field>

                <Field variants={fieldVariants} label="Category">
                  <select
                    value={draft.category ?? ""}
                    onChange={(e) => setDraft({ category: e.target.value as Category })}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field variants={fieldVariants} label="Location">
                  <input
                    type="text"
                    value={draft.location ?? ""}
                    onChange={(e) => setDraft({ location: e.target.value })}
                    placeholder="e.g. Aba, Abia State"
                    className={inputClass}
                  />
                </Field>

                <Field variants={fieldVariants} label="Urgency">
                  <div className="mb-6 grid grid-cols-4 gap-2">
                    {(["low", "medium", "high", "emergency"] as Urgency[]).map((u) => {
                      const active = draft.urgency === u;
                      // Literal class strings per level (no dynamically-built
                      // class names — Tailwind must see them at build time).
                      const activeClass = URGENCY_ACTIVE[u];
                      return (
                        <motion.button
                          key={u}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          animate={{ scale: active ? 1.04 : 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          onClick={() => setDraft({ urgency: u })}
                          className={`rounded-full border px-2 py-2 text-xs font-medium capitalize transition-colors sm:text-sm ${
                            active
                              ? activeClass
                              : "border-indigo/20 bg-white/70 text-indigo hover:border-indigo/40"
                          }`}
                        >
                          {u}
                        </motion.button>
                      );
                    })}
                  </div>
                </Field>

                <Field variants={fieldVariants} label="What would you like to happen?">
                  <textarea
                    value={draft.desiredOutcome ?? ""}
                    onChange={(e) => setDraft({ desiredOutcome: e.target.value })}
                    rows={2}
                    className={inputClass}
                  />
                </Field>

                <motion.div
                  variants={fieldVariants}
                  className={`mb-4 flex items-center justify-between rounded-2xl border p-4 transition-colors duration-300 ${
                    draft.isAnonymous
                      ? "border-palm/40 bg-palm/10"
                      : "border-indigo/20 bg-white/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <motion.span
                      animate={{
                        backgroundColor: draft.isAnonymous ? "#4F7942" : "#22304A1A",
                        color: draft.isAnonymous ? "#F7EFDD" : "#22304A",
                      }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="11" width="16" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    </motion.span>
                    <div>
                      <p className="font-semibold text-indigo">Submit anonymously</p>
                      <p className="text-xs text-ink/60">
                        Your name and contact won&apos;t be attached to this report.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraft({ isAnonymous: !draft.isAnonymous })}
                    aria-pressed={draft.isAnonymous}
                    aria-label="Submit anonymously"
                    className={`h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
                      draft.isAnonymous ? "bg-palm" : "bg-ink/20"
                    }`}
                  >
                    <motion.span
                      animate={{ x: draft.isAnonymous ? 24 : 4 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="block h-5 w-5 translate-y-1 rounded-full bg-white shadow-sm"
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
                        onChange={(e) => setDraft({ contactName: e.target.value })}
                        placeholder="Your name"
                        className={inputClass}
                      />
                      <input
                        type="tel"
                        value={draft.contactPhone ?? ""}
                        onChange={(e) => setDraft({ contactPhone: e.target.value })}
                        placeholder="Phone number"
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
                  whileTap={!submitting && draft.category ? { scale: 0.97 } : undefined}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-marigold py-4 font-semibold text-indigo transition disabled:opacity-40"
                >
                  {submitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 rounded-full border-2 border-indigo/30 border-t-indigo"
                      />
                      Submitting…
                    </>
                  ) : (
                    "Submit report"
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
  "mb-6 w-full rounded-2xl border border-indigo/20 bg-white/70 p-3 text-ink outline-none transition-all duration-200 focus:border-indigo focus:ring-4 focus:ring-indigo/10";

// Full literal class strings per urgency level. Higher urgency reads hotter
// (palm → indigo → marigold → brick), giving the selector a sense of weight.
// Must stay literal so Tailwind generates the CSS (CLAUDE.md gotcha #3).
const URGENCY_ACTIVE: Record<Urgency, string> = {
  low: "border-palm bg-palm text-paper",
  medium: "border-indigo bg-indigo text-paper",
  high: "border-marigold bg-marigold text-indigo",
  emergency: "border-brick bg-brick text-paper",
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
      <label className="mb-1 block text-sm font-semibold text-indigo">{label}</label>
      {children}
    </motion.div>
  );
}