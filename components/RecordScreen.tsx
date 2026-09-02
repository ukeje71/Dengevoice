"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useAppStore } from "@/lib/store";
import { copy } from "@/lib/i18n";

type Mode = "voice" | "text";
type RecordingState = "idle" | "recording" | "processing" | "error";

export default function RecordScreen({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const { lang, setDraft } = useAppStore();
  const t = copy[lang];

  const [mode, setMode] = useState<Mode>(initialMode);
  const [state, setState] = useState<RecordingState>("idle");
  const [typedText, setTypedText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => handleRecordingStop(stream);

      mediaRecorderRef.current = recorder;
      recorder.start();
      setState("recording");
    } catch {
      setErrorMsg(
        "Couldn't access your microphone. Check browser permissions, or use 'Type instead' below."
      );
      setState("error");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setState("processing");
  }

  async function handleRecordingStop(stream: MediaStream) {
    stream.getTracks().forEach((track) => track.stop());
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    await submitAudio(audioBlob);
  }

  async function submitAudio(audioBlob: Blob) {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "complaint.webm");

      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Transcription failed");

      setDraft({ originalTranscript: data.transcript });
      router.push("/confirm");
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong transcribing your recording. Try 'Type instead' below."
      );
      setState("error");
    }
  }

  function submitTyped() {
    if (!typedText.trim()) return;
    setDraft({ originalTranscript: typedText.trim() });
    router.push("/confirm");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-16 text-ink">
      <p className="mb-8 max-w-xs text-center text-lg font-medium text-indigo">
        {t.heroSubtitle}
      </p>

      {mode === "voice" && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={state === "recording" ? stopRecording : startRecording}
            disabled={state === "processing"}
            aria-label={state === "recording" ? "Stop recording" : t.ctaStart}
            className={clsx(
              "flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition",
              state === "recording"
                ? "animate-pulse bg-brick shadow-brick/40"
                : "bg-marigold shadow-marigold/30 hover:scale-105",
              state === "processing" && "opacity-60"
            )}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22304A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>

          <p className="text-sm font-medium text-indigo">
            {state === "idle" && t.ctaStart}
            {state === "recording" && "Recording... tap to stop"}
            {state === "processing" && "Processing..."}
            {state === "error" && "Try again"}
          </p>

          {errorMsg && (
            <p className="max-w-xs text-center text-sm text-brick">{errorMsg}</p>
          )}

          <button
            onClick={() => setMode("text")}
            className="mt-2 text-sm text-ink/60 underline underline-offset-2"
          >
            {t.ctaTypeInstead}
          </button>
        </div>
      )}

      {mode === "text" && (
        <div className="flex w-full max-w-md flex-col gap-3">
          <textarea
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Describe what happened, where, and when..."
            rows={6}
            className="rounded-2xl border border-indigo/20 bg-white/70 p-4 text-ink outline-none focus:border-indigo"
          />
          <button
            onClick={submitTyped}
            disabled={!typedText.trim()}
            className="rounded-full bg-marigold px-6 py-3 font-semibold text-indigo disabled:opacity-40"
          >
            Continue
          </button>
          <button
            onClick={() => setMode("voice")}
            className="text-sm text-ink/60 underline underline-offset-2"
          >
            Use voice instead
          </button>
        </div>
      )}
    </main>
  );
}
