import { create } from "zustand";
import type { Lang } from "./i18n";
import type { Complaint } from "@/types/complaint";

type AppStore = {
  lang: Lang;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;

  // In-progress complaint   filled in as the citizen moves through
  // record -> confirm -> submit. Reset after a successful submit.
  draft: Partial<Complaint>;
  setDraft: (patch: Partial<Complaint>) => void;
  resetDraft: () => void;
};

const emptyDraft: Partial<Complaint> = {
  isAnonymous: false,
  urgency: "medium",
  primaryLanguage: "ig",
};

// UI display languages, in header/dropdown order. Same set as the spoken-input
// languages (SUPPORTED_LANGUAGES), but typed as the i18n `Lang` union so the
// display layer and copy object stay in lockstep.
export const UI_LANGUAGES: { code: Lang; native: string }[] = [
  { code: "en", native: "English" },
  { code: "ig", native: "Igbo" },
  { code: "yo", native: "Yorùbá" },
  { code: "ha", native: "Hausa" },
  { code: "pcm", native: "Naijá" },
];

export const useAppStore = create<AppStore>((set) => ({
  lang: "en",
  // Cycles through the UI languages in order. Kept for the old binary
  // callers; the header now uses setLang for direct selection.
  toggleLang: () =>
    set((state) => {
      const i = UI_LANGUAGES.findIndex((l) => l.code === state.lang);
      const next = UI_LANGUAGES[(i + 1) % UI_LANGUAGES.length];
      return { lang: next.code };
    }),
  setLang: (lang) => set({ lang }),

  draft: emptyDraft,
  setDraft: (patch) =>
    set((state) => ({ draft: { ...state.draft, ...patch } })),
  resetDraft: () => set({ draft: emptyDraft }),
}));

// Backward-compatible alias -- LanguageToggle.tsx and LandingPage.tsx
// already import this name from earlier in the project.
export const useLangStore = useAppStore;
