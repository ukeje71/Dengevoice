export type Urgency = "low" | "medium" | "high" | "emergency";

// Spoken-input languages the citizen can pick before recording. This is the
// language the AUDIO is in (passed to Sahara ASR). These now mirror the app's
// UI display languages (`Lang` in lib/i18n) one-to-one -- the citizen can both
// speak AND read the whole app in any of them.
//
// Igbo remains the project's primary / benchmarked pair; the others are fully
// wired first-class inputs. Transcription accuracy per language is what the
// benchmark measures -- see benchmark/ and the report against AfriSwitch's
// ~69% WER baseline.
export const SUPPORTED_LANGUAGES = [
  { code: "ig", label: "Igbo", native: "Igbo", status: "primary" },
  { code: "en", label: "English", native: "English", status: "primary" },
  { code: "pcm", label: "Nigerian Pidgin", native: "Naijá", status: "primary" },
  { code: "yo", label: "Yoruba", native: "Yorùbá", status: "primary" },
  { code: "ha", label: "Hausa", native: "Hausa", status: "primary" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "ig";

export function isSupportedLanguage(code: string): code is LanguageCode {
  return SUPPORTED_LANGUAGES.some((l) => l.code === code);
}

// English name for a language code, for prompt-building / display.
export function languageLabel(code: LanguageCode): string {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.label ?? code;
}

export const CATEGORIES = [
  "Power/Electricity",
  "Water Supply",
  "Roads & Infrastructure",
  "Security/Crime",
  "Land Disputes",
  "Court Delays/Judicial Issues",
  "Corruption/Abuse of Office",
  "Healthcare Access",
  "Education/School Issues",
  "Waste Management/Sanitation",
  "Market/Trade Disputes",
  "Environmental Issues",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

// What comes back from /api/transcribe
export interface TranscribeResult {
  transcript: string; // in the citizen's original spoken mix, not translated
}

// What comes back from /api/structure
export interface StructuredComplaint {
  translatedSummary: string; // English narrative summary (for official filing)
  originalSummary?: string; // summary in the citizen's own language, so a
  // non-English speaker can review their report comfortably. Empty/omitted
  // when the input was already English.
  category: Category | null;
  location: string;
  urgency: Urgency;
  desiredOutcome: string;
}

// The full complaint object as it moves through the app
export interface Complaint extends StructuredComplaint {
  originalTranscript: string;
  primaryLanguage: LanguageCode; // language the citizen spoke/typed in
  isAnonymous: boolean;
  contactName?: string;
  contactPhone?: string;
  incidentDate: string; // ISO date, defaults to "now"
}

// What we get back after submitting
export interface SubmitResult {
  trackingId: string;
}

export type ComplaintStatus =
  | "received"
  | "under_review"
  | "in_progress"
  | "resolved"
  | "closed";
