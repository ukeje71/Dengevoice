// Landing page copy in both languages.
// The "ig" (Igbo) strings below are PLACEHOLDERS — mark clearly so nothing
// inaccurate ships. Have a native Igbo speaker review/replace these before
// this goes live. Do not trust auto-translated Igbo for a civic tool people
// will actually rely on.

export type Lang = "en" | "ig";

export const copy: Record<Lang, Record<string, string>> = {
  en: {
    appName: "DengeVoice",
    heroTitle: "Report a problem. In your own words.",
    heroSubtitle:
      "Speak your complaint the way you naturally talk — mixing Igbo and English is fine. DengeVoice turns it into a clear report and sends it to the right office.",
    ctaStart: "Start a report",
    ctaTypeInstead: "Type instead",
    stepsTitle: "How it works",
    step1Title: "1. Speak",
    step1Body: "Tap the mic and describe what happened, where, and when.",
    step2Title: "2. Review",
    step2Body:
      "See what we heard, in your own words. Fix anything that wasn't caught right.",
    step3Title: "3. Confirm details",
    step3Body:
      "We fill in the category, location, and urgency for you — just confirm.",
    step4Title: "4. Track it",
    step4Body:
      "Get a tracking ID and see updates on how your report is being handled.",
    langToggleLabel: "Language",
  },
  ig: {
    appName: "DengeVoice",
    heroTitle: "[TODO: native Igbo — Kọọ nsogbu. N'olu gị.]",
    heroSubtitle:
      "[TODO: native Igbo translation of the subtitle — do not ship auto-translated text]",
    ctaStart: "[TODO: Igbo — Start a report]",
    ctaTypeInstead: "[TODO: Igbo — Type instead]",
    stepsTitle: "[TODO: Igbo — How it works]",
    step1Title: "[TODO] 1.",
    step1Body: "[TODO: Igbo]",
    step2Title: "[TODO] 2.",
    step2Body: "[TODO: Igbo]",
    step3Title: "[TODO] 3.",
    step3Body: "[TODO: Igbo]",
    step4Title: "[TODO] 4.",
    step4Body: "[TODO: Igbo]",
    langToggleLabel: "Asụsụ",
  },
};
