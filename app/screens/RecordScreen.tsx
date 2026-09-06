"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useAppStore } from "@/lib/store";
import { copy } from "@/lib/i18n";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/types/complaint";
import type { LanguageCode } from "@/types/complaint";
import Header from "@/components/Header";
import ProgressSteps from "@/components/ProgressSteps";

type Mode = "voice" | "text";
type RecordingState = "idle" | "recording" | "processing" | "error";

export default function RecordScreen({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const { lang, draft, setDraft } = useAppStore();
  const t = copy[lang];

  const [mode, setMode] = useState<Mode>(initialMode);
  const [state, setState] = useState<RecordingState>("idle");
  const [typedText, setTypedText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Spoken-input language (what the citizen speaks), distinct from the UI
  // display language. Defaults to Igbo; persisted onto the draft so the
  // confirm screen can pass it to the structuring step.
  const [language, setLanguage] = useState<LanguageCode>(
    (draft.primaryLanguage as LanguageCode) ?? DEFAULT_LANGUAGE,
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  function selectLanguage(code: LanguageCode) {
    setLanguage(code);
    setDraft({ primaryLanguage: code });
  }

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
      setErrorMsg(t.recordMicError);
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
      formData.append("language", language);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Transcription failed");

      setDraft({
        originalTranscript: data.transcript,
        primaryLanguage: language,
      });
      router.push("/confirm");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : t.recordTranscribeError,
      );
      setState("error");
    }
  }

  function submitTyped() {
    if (!typedText.trim()) return;
    setDraft({
      originalTranscript: typedText.trim(),
      primaryLanguage: language,
    });
    router.push("/confirm");
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Header />

      <div className="mx-auto flex max-w-lg flex-col items-center px-6 pb-20 pt-10 sm:pt-16">
        <ProgressSteps current={1} />

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-balance text-center font-[family-name:var(--font-display)] text-2xl font-semibold text-indigo sm:text-3xl"
        >
          {t.recordTitle}
        </motion.h1>

        <LanguageSelector t={t} language={language} onSelect={selectLanguage} />

        <AnimatePresence mode="wait">
          {mode === "voice" ? (
            <motion.div
              key="voice"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="mt-8 w-full"
            >
              <VoiceCard
                t={t}
                state={state}
                errorMsg={errorMsg}
                onStart={startRecording}
                onStop={stopRecording}
                onSwitchToText={() => setMode("text")}
              />
            </motion.div>
          ) : (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="mt-8 w-full"
            >
              <TextCard
                t={t}
                value={typedText}
                onChange={setTypedText}
                onSubmit={submitTyped}
                onSwitchToVoice={() => setMode("voice")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// ---------- Language selector ----------
// Lets the citizen pick the language they'll speak. All five are first-class
// inputs now; Igbo stays the default selection. Keyed by stable language code,
// never by translated text (CLAUDE.md gotcha #1).
function LanguageSelector({
  t,
  language,
  onSelect,
}: {
  t: Record<string, string>;
  language: LanguageCode;
  onSelect: (code: LanguageCode) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="mt-8 w-full"
    >
      <p className="mb-3 text-center text-sm font-semibold text-indigo">
        {t.recordLanguageLabel}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {SUPPORTED_LANGUAGES.map((l) => {
          const active = l.code === language;
          return (
            <motion.button
              key={l.code}
              type="button"
              onClick={() => onSelect(l.code)}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: active ? 1.03 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={clsx(
                "relative rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-indigo bg-indigo text-paper"
                  : "border-indigo/20 bg-white/60 text-indigo hover:border-indigo/40",
              )}
            >
              {l.native}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ---------- Voice recording card ----------
function VoiceCard({
  t,
  state,
  errorMsg,
  onStart,
  onStop,
  onSwitchToText,
}: {
  t: Record<string, string>;
  state: RecordingState;
  errorMsg: string | null;
  onStart: () => void;
  onStop: () => void;
  onSwitchToText: () => void;
}) {
  const recording = state === "recording";
  const processing = state === "processing";

  return (
    <div className="woven-texture relative overflow-hidden rounded-[2.5rem] border border-indigo/10 bg-white/50 px-8 py-12 text-center shadow-sm">
      <p className="mx-auto max-w-xs text-sm leading-relaxed text-ink/70">
        {t.recordVoiceHint}
      </p>

      <div className="relative mx-auto mt-10 flex h-32 w-32 items-center justify-center">
        {/* Pulse rings   only while actively recording */}
        <AnimatePresence>
          {recording &&
            [0, 1].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full bg-brick/40"
              />
            ))}
        </AnimatePresence>

        {/* Processing ring   a spinning arc while we wait on Sahara, so the
            button clearly reads as "working" rather than just dimmed. */}
        {processing && (
          <motion.span
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-marigold/25 border-t-marigold"
          />
        )}

        <motion.button
          onClick={recording ? onStop : onStart}
          disabled={processing}
          whileTap={{ scale: 0.94 }}
          animate={recording ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={
            recording
              ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
          }
          aria-label={recording ? "Stop recording" : t.ctaStart}
          className={clsx(
            "relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-colors duration-300",
            recording
              ? "bg-brick shadow-brick/40"
              : "bg-marigold shadow-marigold/30 hover:scale-105",
            processing && "opacity-70",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {recording ? (
              // Morph the mic into a stop-square while recording, so the
              // affordance to stop is unmistakable.
              <motion.span
                key="stop"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-6 w-6 rounded-md bg-paper"
              />
            ) : (
              <motion.svg
                key="mic"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                width="30"
                height="30"
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
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Live-look waveform bars while recording   height reserved always so
          the layout doesn't jump when recording starts/stops. */}
      <div className="mt-6 flex h-8 items-end justify-center gap-1">
        <AnimatePresence>
          {recording &&
            [16, 28, 40, 24, 32, 20, 36, 22].map((h, i) => (
              <motion.span
                key={i}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [1, 1.5, 0.6, 1.2, 1], opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                style={{ height: `${h}px`, transformOrigin: "bottom" }}
                transition={{
                  scaleY: {
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.06,
                  },
                  opacity: { duration: 0.2 },
                }}
                className={`w-1.5 rounded-full ${i % 2 === 0 ? "bg-brick" : "bg-marigold"}`}
              />
            ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 h-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={state}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium text-indigo"
          >
            {state === "idle" && t.ctaStart}
            {state === "recording" && t.recordListening}
            {state === "processing" && t.recordProcessing}
            {state === "error" && t.recordTryAgain}
          </motion.p>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="mx-auto mt-3 max-w-xs rounded-xl border border-brick/30 bg-brick/10 px-3 py-2 text-xs text-brick">
              {errorMsg}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onSwitchToText}
        className="mt-6 text-sm font-medium text-ink/60 underline underline-offset-2 transition hover:text-ink"
      >
        {t.ctaTypeInstead}
      </button>
    </div>
  );
}

// ---------- Text entry card ----------
function TextCard({
  t,
  value,
  onChange,
  onSubmit,
  onSwitchToVoice,
}: {
  t: Record<string, string>;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onSwitchToVoice: () => void;
}) {
  return (
    <div className="rounded-[2.5rem] border border-indigo/10 bg-white/50 p-8 shadow-sm">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.recordTypedPlaceholder}
        rows={6}
        autoFocus
        className="w-full resize-none rounded-2xl border border-indigo/15 bg-white/80 p-4 text-ink outline-none transition-all duration-200 focus:border-indigo focus:ring-4 focus:ring-indigo/10"
      />
      <div className="mt-1 flex items-center justify-end gap-1 text-right text-xs text-ink/40">
        <motion.span
          key={value.length > 0 ? "has-text" : "empty"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={value.trim() ? "text-palm" : ""}
        >
          {value.length}
        </motion.span>
        {t.recordCharacters}
      </div>

      <motion.button
        onClick={onSubmit}
        disabled={!value.trim()}
        whileTap={value.trim() ? { scale: 0.97 } : undefined}
        whileHover={value.trim() ? { scale: 1.02 } : undefined}
        className="mt-4 w-full rounded-full bg-marigold px-6 py-3 font-semibold text-indigo transition-opacity disabled:opacity-40"
      >
        {t.recordContinueBtn}
      </motion.button>

      <button
        onClick={onSwitchToVoice}
        className="mt-4 block w-full text-center text-sm font-medium text-ink/60 underline underline-offset-2 transition hover:text-ink"
      >
        {t.recordUseVoiceLink}
      </button>
    </div>
  );
}
