"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLangStore } from "@/lib/store";
import { copy } from "@/lib/i18n";

export default function Footer() {
  const { lang } = useLangStore();
  const t = copy[lang];
  const [email, setEmail] = useState("");

  // TODO: not wired to anything yet — there's no backend endpoint or
  // Supabase table for newsletter signups. Hook this up (or remove it)
  // before launch; right now submitting just clears the field.
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="border-t border-indigo/10 bg-indigo/[0.03]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start justify-between gap-8 border-b border-indigo/10 pb-10 sm:flex-row sm:items-center"
        >
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg text-indigo">
              {t.footerSubscribeTitle}
            </p>
            <p className="mt-1 max-w-sm text-sm text-ink/60">
              {t.footerSubscribeBody}
            </p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-sm items-center gap-2 sm:w-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.footerSubscribePlaceholder}
              className="w-full rounded-full border border-indigo/15 bg-white/70 px-4 py-2.5 text-sm text-ink outline-none focus:border-indigo/40"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-marigold px-5 py-2.5 text-sm font-semibold text-indigo transition hover:scale-[1.03]"
            >
              {t.footerSubscribeButton}
            </button>
          </form>
        </motion.div>

        <div className="pt-8 text-center">
          <p className="font-[family-name:var(--font-display)] text-base text-indigo">
            {t.footerLine}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink/60">
            {t.footerPrivacy}
          </p>
          <p className="mt-6 text-xs text-ink/40">
            © {new Date().getFullYear()} {t.footerRights}
          </p>
        </div>
      </div>
    </footer>
  );
}
