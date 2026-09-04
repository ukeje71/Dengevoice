"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Branded 404. Renders inside the root layout, so fonts/colors are already
// available. Kept self-contained (no Header) since a missing route has no
// language context to speak of — copy stays in English here.
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Decorative waveform that trails off — a voice that didn't land
            anywhere, echoing the app's core metaphor. */}
        <div className="mx-auto mb-8 flex h-16 items-end justify-center gap-1.5">
          {[28, 46, 64, 40, 22, 14, 8, 5].map((h, i) => (
            <motion.span
              key={i}
              initial={{ scaleY: 0.3, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 - i * 0.1 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              style={{ height: `${h}px`, transformOrigin: "bottom" }}
              className={`w-2 rounded-full ${
                i % 3 === 0
                  ? "bg-marigold"
                  : i % 3 === 1
                    ? "bg-brick"
                    : "bg-indigo/60"
              }`}
            />
          ))}
        </div>

        <p className="font-[family-name:var(--font-display)] text-6xl font-semibold text-indigo">
          404
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-indigo">
          This page went quiet
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-ink/70">
          We couldn&apos;t find what you were looking for. Let&apos;s get you
          back to somewhere useful.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-marigold px-6 py-3 font-semibold text-indigo shadow-lg shadow-marigold/30 transition hover:scale-[1.03]"
          >
            Back home
          </Link>
          <Link
            href="/record"
            className="rounded-full border border-indigo/20 px-6 py-3 font-semibold text-indigo transition hover:bg-indigo/5"
          >
            Start a report
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
