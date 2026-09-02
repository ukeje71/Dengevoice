"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { CATEGORIES } from "@/types/complaint";
import type { Category, Urgency } from "@/types/complaint";

type LoadState = "structuring" | "ready" | "error";

export default function ConfirmScreen() {
  const router = useRouter();
  const { draft, setDraft, resetDraft } = useAppStore();

  const [loadState, setLoadState] = useState<LoadState>("structuring");
  const [structureError, setStructureError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // On first load, if we have a transcript but no structured fields yet,
  // call /api/structure to auto-fill category/location/urgency/summary.
  useEffect(() => {
    if (!draft.originalTranscript) {
      router.replace("/record");
      return;
    }
    if (draft.category) {
      setLoadState("ready");
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
        // LLM step not wired up yet -- let the citizen fill the form
        // manually instead of blocking them entirely.
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

  if (loadState === "structuring") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper text-ink">
        <p className="text-indigo">Reviewing your report...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg bg-paper px-6 py-10 text-ink">
      <h1 className="mb-1 text-xl font-bold text-indigo">Review your report</h1>
      <p className="mb-6 text-sm text-ink/60">
        Check that we understood you correctly, then confirm the details below.
      </p>

      {structureError && (
        <div className="mb-6 rounded-xl border border-brick/30 bg-brick/10 p-3 text-sm text-brick">
          Auto-fill isn&apos;t available right now ({structureError}). Please fill the
          fields below manually.
        </div>
      )}

      {/* Original transcript -- editable */}
      <label className="mb-1 block text-sm font-semibold text-indigo">
        What you said
      </label>
      <textarea
        value={draft.originalTranscript ?? ""}
        onChange={(e) => setDraft({ originalTranscript: e.target.value })}
        rows={4}
        className="mb-6 w-full rounded-2xl border border-indigo/20 bg-white/70 p-3 text-ink outline-none focus:border-indigo"
      />

      {/* English summary */}
      <label className="mb-1 block text-sm font-semibold text-indigo">Summary</label>
      <textarea
        value={draft.translatedSummary ?? ""}
        onChange={(e) => setDraft({ translatedSummary: e.target.value })}
        rows={3}
        className="mb-6 w-full rounded-2xl border border-indigo/20 bg-white/70 p-3 text-ink outline-none focus:border-indigo"
      />

      {/* Category */}
      <label className="mb-1 block text-sm font-semibold text-indigo">Category</label>
      <select
        value={draft.category ?? ""}
        onChange={(e) => setDraft({ category: e.target.value as Category })}
        className="mb-6 w-full rounded-2xl border border-indigo/20 bg-white/70 p-3 text-ink outline-none focus:border-indigo"
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

      {/* Location */}
      <label className="mb-1 block text-sm font-semibold text-indigo">Location</label>
      <input
        type="text"
        value={draft.location ?? ""}
        onChange={(e) => setDraft({ location: e.target.value })}
        placeholder="e.g. Aba, Abia State"
        className="mb-6 w-full rounded-2xl border border-indigo/20 bg-white/70 p-3 text-ink outline-none focus:border-indigo"
      />

      {/* Urgency */}
      <label className="mb-1 block text-sm font-semibold text-indigo">Urgency</label>
      <div className="mb-6 flex gap-2">
        {(["low", "medium", "high", "emergency"] as Urgency[]).map((u) => (
          <button
            key={u}
            onClick={() => setDraft({ urgency: u })}
            className={`flex-1 rounded-full border px-3 py-2 text-sm capitalize ${
              draft.urgency === u
                ? "border-indigo bg-indigo text-paper"
                : "border-indigo/20 bg-white/70 text-indigo"
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      {/* Desired outcome */}
      <label className="mb-1 block text-sm font-semibold text-indigo">
        What would you like to happen?
      </label>
      <textarea
        value={draft.desiredOutcome ?? ""}
        onChange={(e) => setDraft({ desiredOutcome: e.target.value })}
        rows={2}
        className="mb-6 w-full rounded-2xl border border-indigo/20 bg-white/70 p-3 text-ink outline-none focus:border-indigo"
      />

      {/* Anonymity toggle */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-indigo/20 bg-white/70 p-4">
        <div>
          <p className="font-semibold text-indigo">Submit anonymously</p>
          <p className="text-xs text-ink/60">
            Your name and contact won&apos;t be attached to this report.
          </p>
        </div>
        <button
          onClick={() => setDraft({ isAnonymous: !draft.isAnonymous })}
          className={`h-7 w-12 rounded-full transition ${
            draft.isAnonymous ? "bg-palm" : "bg-ink/20"
          }`}
        >
          <span
            className={`block h-5 w-5 translate-y-1 rounded-full bg-white transition ${
              draft.isAnonymous ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {!draft.isAnonymous && (
        <div className="mb-6 flex flex-col gap-3">
          <input
            type="text"
            value={draft.contactName ?? ""}
            onChange={(e) => setDraft({ contactName: e.target.value })}
            placeholder="Your name"
            className="w-full rounded-2xl border border-indigo/20 bg-white/70 p-3 text-ink outline-none focus:border-indigo"
          />
          <input
            type="tel"
            value={draft.contactPhone ?? ""}
            onChange={(e) => setDraft({ contactPhone: e.target.value })}
            placeholder="Phone number"
            className="w-full rounded-2xl border border-indigo/20 bg-white/70 p-3 text-ink outline-none focus:border-indigo"
          />
        </div>
      )}

      {submitError && (
        <p className="mb-4 text-sm text-brick">{submitError}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting || !draft.category}
        className="w-full rounded-full bg-marigold py-4 font-semibold text-indigo disabled:opacity-40"
      >
        {submitting ? "Submitting..." : "Submit report"}
      </button>
    </main>
  );
}
