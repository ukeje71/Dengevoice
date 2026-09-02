"use client";

import { useState, useEffect } from "react";

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
    if (initialId) lookup(initialId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  return (
    <main className="mx-auto min-h-screen max-w-md bg-paper px-6 py-16 text-ink">
      <h1 className="mb-2 text-xl font-bold text-indigo">Track your report</h1>

      {justSubmitted && initialId && (
        <div className="mb-6 rounded-2xl border border-palm/30 bg-palm/10 p-4">
          <p className="text-sm font-semibold text-palm">Report submitted</p>
          <p className="mt-1 text-sm text-ink/70">
            Save this tracking ID to check your report&apos;s status anytime:
          </p>
          <p className="mt-2 text-2xl font-bold tracking-wide text-indigo">
            {initialId}
          </p>
        </div>
      )}

      <label className="mb-1 block text-sm font-semibold text-indigo">
        Tracking ID
      </label>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value.toUpperCase())}
          placeholder="DGV-XXXX-XXXX"
          className="flex-1 rounded-2xl border border-indigo/20 bg-white/70 p-3 text-ink outline-none focus:border-indigo"
        />
        <button
          onClick={() => lookup(id)}
          disabled={state === "loading"}
          className="rounded-2xl bg-marigold px-5 font-semibold text-indigo disabled:opacity-40"
        >
          Check
        </button>
      </div>

      {state === "loading" && <p className="text-sm text-ink/60">Looking it up...</p>}
      {state === "not_found" && (
        <p className="text-sm text-brick">
          We couldn&apos;t find a report with that tracking ID. Double-check and try again.
        </p>
      )}
      {state === "error" && (
        <p className="text-sm text-brick">
          Something went wrong looking that up. Try again in a moment.
        </p>
      )}
      {state === "found" && data && (
        <div className="rounded-2xl border border-indigo/20 bg-white/70 p-5">
          <p className="text-xs uppercase tracking-wide text-ink/50">Status</p>
          <p className="mb-3 text-lg font-bold text-indigo">
            {STATUS_LABELS[data.status] ?? data.status}
          </p>
          <p className="text-xs uppercase tracking-wide text-ink/50">Category</p>
          <p className="mb-3 text-ink">{data.category}</p>
          <p className="text-xs uppercase tracking-wide text-ink/50">Submitted</p>
          <p className="text-ink">
            {new Date(data.created_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </main>
  );
}
