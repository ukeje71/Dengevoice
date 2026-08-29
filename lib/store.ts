import { create } from "zustand";
import type { Lang } from "./i18n";

type LangStore = {
  lang: Lang;
  toggle: () => void;
  setLang: (lang: Lang) => void;
};

export const useLangStore = create<LangStore>((set) => ({
  lang: "en",
  toggle: () =>
    set((state) => ({ lang: state.lang === "en" ? "ig" : "en" })),
  setLang: (lang) => set({ lang }),
}));
