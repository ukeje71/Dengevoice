export type Urgency = "low" | "medium" | "high" | "emergency";

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
  translatedSummary: string; // English narrative summary
  category: Category | null;
  location: string;
  urgency: Urgency;
  desiredOutcome: string;
}

// The full complaint object as it moves through the app
export interface Complaint extends StructuredComplaint {
  originalTranscript: string;
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
