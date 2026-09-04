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
};

export const useAppStore = create<AppStore>((set) => ({
  lang: "en",
  toggleLang: () =>
    set((state) => ({ lang: state.lang === "en" ? "ig" : "en" })),
  setLang: (lang) => set({ lang }),

  draft: emptyDraft,
  setDraft: (patch) =>
    set((state) => ({ draft: { ...state.draft, ...patch } })),
  resetDraft: () => set({ draft: emptyDraft }),
}));

// Backward-compatible alias -- LanguageToggle.tsx and LandingPage.tsx
// already import this name from earlier in the project.
export const useLangStore = useAppStore;
