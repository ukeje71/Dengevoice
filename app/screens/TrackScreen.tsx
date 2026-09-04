"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import ProgressSteps from "@/components/ProgressSteps";
import Loader from "@/components/Loader";
import StatusStepper from "@/components/Statusstepper";

type LookupState = "idle" | "loading" | "found" | "not_found" | "error";

interface StatusData {
  tracking_id: string;
  category: string;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  received: "Received",
  under_review: "Under review",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

export default function TrackScreen({
  initialId,
  justSubmitted,
}: {
  initialId?: string;
  justSubmitted?: boolean;
}) {
  const [id, setId] = useState(initialId ?? "");
  const [state, setState] = useState<LookupState>("idle");
  const [data, setData] = useState<StatusData | null>(null);
  const [copied, setCopied] = useState(false);

  async function lookup(trackingId: string) {
    if (!trackingId.trim()) return;
    setState("loading");
    try {
      const res = await fetch(`/api/complaints/${trackingId.trim()}`);
      if (res.status === 404) {
        setState("not_found");
        return;
      }
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
      setState("found");
    } catch {
      setState("error");
    }
  }

  useEffect(() => {
    // Deferred to a microtask so the lookup's setState calls don't run
    // synchronously within the effect body itself.
    if (initialId) queueMicrotask(() => lookup(initialId));
  }, [initialId]);

  function copyId(value: string) {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Header />

      <div className="mx-auto max-w-md px-6 pb-20 pt-10 sm:pt-16">
        <ProgressSteps current={4} />

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 text-balance text-center font-[family-name:var(--font-display)] text-2xl font-semibold text-indigo"
        >
          Track your report
        </motion.h1>

        <AnimatePresence>
          {justSubmitted && initialId && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mt-6 rounded-[2rem] border border-palm/30 bg-palm/10 p-5"
            >
              <div className="flex items-center gap-2">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-palm"
                >
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F7EFDD"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.polyline
                      points="20 6 9 17 4 12"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
                    />
                  </motion.svg>
                </motion.span>
                <p className="text-sm font-semibold text-palm">Report submitted</p>
              </div>
              <p className="mt-2 text-sm text-ink/70">
                Save this tracking ID to check your report&apos;s status anytime:
              </p>
              <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-white/60 px-3 py-2">
                <p className="text-lg font-bold tracking-wide text-indigo">{initialId}</p>
                <motion.button
                  onClick={() => copyId(initialId)}
                  whileTap={{ scale: 0.94 }}
                  className="shrink-0 rounded-full border border-indigo/20 px-3 py-1 text-xs font-semibold text-indigo transition-colors hover:bg-indigo/5"
                >
                  {copied ? "Copied" : "Copy"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8 rounded-[2.5rem] border border-indigo/10 bg-white/50 p-6 sm:p-8"
        >
          <label className="mb-1 block text-sm font-semibold text-indigo">
            Tracking ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && lookup(id)}
              placeholder="DGV-XXXX-XXXX"
              className="flex-1 rounded-2xl border border-indigo/20 bg-white/70 p-3 text-ink outline-none transition focus:border-indigo"
            />
            <motion.button
              onClick={() => lookup(id)}
              disabled={state === "loading" || !id.trim()}
              whileTap={{ scale: 0.96 }}
              whileHover={id.trim() ? { scale: 1.03 } : undefined}
              className="rounded-2xl bg-marigold px-5 font-semibold text-indigo transition-opacity disabled:opacity-40"
            >
              Check
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {state === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader message="Looking it up…" />
              </motion.div>
            )}

            {state === "not_found" && (
              <motion.p
                key="not-found"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 rounded-xl border border-brick/30 bg-brick/10 px-3 py-2 text-sm text-brick"
              >
                We couldn&apos;t find a report with that tracking ID. Double-check and
                try again.
              </motion.p>
            )}

            {state === "error" && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 rounded-xl border border-brick/30 bg-brick/10 px-3 py-2 text-sm text-brick"
              >
                Something went wrong looking that up. Try again in a moment.
              </motion.p>
            )}

            {state === "found" && data && (
              <motion.div
                key="found"
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08, delayChildren: 0.1 },
                  },
                }}
                className="mt-6 overflow-hidden rounded-2xl border border-indigo/20 bg-white/70 p-5"
              >
                <motion.div
                  variants={foundItem}
                  className="flex items-center justify-between"
                >
                  <p className="text-xs uppercase tracking-wide text-ink/50">
                    {data.tracking_id}
                  </p>
                  <motion.button
                    onClick={() => copyId(data.tracking_id)}
                    whileTap={{ scale: 0.94 }}
                    className="text-xs font-semibold text-indigo underline underline-offset-2 transition-colors hover:text-brick"
                  >
                    {copied ? "Copied" : "Copy ID"}
                  </motion.button>
                </motion.div>

                <motion.p
                  variants={foundItem}
                  className="mb-4 mt-1 text-lg font-bold text-indigo"
                >
                  {STATUS_LABELS[data.status] ?? data.status}
                </motion.p>

                <motion.div variants={foundItem}>
                  <StatusStepper status={data.status} />
                </motion.div>

                <motion.div
                  variants={foundItem}
                  className="mt-6 grid grid-cols-2 gap-4 border-t border-indigo/10 pt-4"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink/50">Category</p>
                    <p className="text-sm text-ink">{data.category}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink/50">Submitted</p>
                    <p className="text-sm text-ink">
                      {new Date(data.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={foundItem}>
                  <Link
                    href="/record"
                    className="mt-6 block w-full rounded-full border border-indigo/20 py-3 text-center text-sm font-semibold text-indigo transition-colors hover:bg-indigo/5"
                  >
                    Report another issue
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Copy confirmation toast   extends the inline "Copied" label with a
          floating confirmation so the action feels acknowledged even when the
          button itself is scrolled out of view. */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit items-center gap-2 rounded-full bg-indigo px-4 py-2.5 text-sm font-medium text-paper shadow-lg"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-palm">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F7EFDD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            Tracking ID copied
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const foundItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};