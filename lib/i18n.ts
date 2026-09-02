// Landing page copy in both languages.
// The "ig" (Igbo) strings below are PLACEHOLDERS — mark clearly so nothing
// inaccurate ships. Run `node --env-file=.env.local scripts/translate-igbo.mjs`
// to generate real Gemini-translated copy, then have a native Igbo speaker
// review it before this goes live. Do not trust auto-translated Igbo for a
// civic tool people will actually rely on.

export type Lang = "en" | "ig";

export const copy: Record<Lang, Record<string, string>> = {
  en: {
    appName: "DengeVoice",

    navHome: "Home",
    navReport: "Report",
    navTrack: "Track",

    heroTitle: "Report a problem. In your own words.",
    heroSubtitle:
      "Speak your complaint the way you naturally talk — mixing Igbo and English is fine. DengeVoice turns it into a clear report and sends it to the right office.",
    ctaStart: "Start a report",
    ctaTypeInstead: "Type instead",

    storyEyebrow: "How it actually sounds",
    storyBeforeLabel: "You say it your way",
    storyAfterLabel: "We send a clear report",

    categoriesEyebrow: "What you can report",
    categoriesTitle: "Real issues, taken seriously",
    categoriesSubtitle:
      "From power outages to healthcare access — every category is routed to the office that can actually act on it.",
    catPowerTitle: "Power & Electricity",
    catPowerDesc: "Outages, faulty transformers, unsafe wiring in your area.",
    catWaterTitle: "Water Supply",
    catWaterDesc: "No water, contaminated supply, broken boreholes and taps.",
    catRoadsTitle: "Roads & Infrastructure",
    catRoadsDesc: "Potholes, collapsed bridges, unsafe public spaces.",
    catHealthTitle: "Healthcare Access",
    catHealthDesc: "Clinic shortages, denied care, facility conditions.",
    viewAllCategories: "View all 13 categories",

    ctaBannerEyebrow: "Your voice, your language",
    ctaBannerTitle: "Don't let a report go unheard because of how you speak it.",
    ctaBannerBody:
      "No forms to fill in English you're not comfortable with. No typing required. Just speak, and DengeVoice handles the rest.",

    processEyebrow: "Process",
    processTitle: "How DengeVoice works",
    processSubtitle:
      "Four simple steps from your voice to a report that reaches the right people.",
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

    featureBandTitle: "Built to remove every barrier to being heard",
    feature1Title: "Speak naturally",
    feature1Body:
      "Mixing Igbo and English is fine — no need to translate yourself first.",
    feature2Title: "Track every step",
    feature2Body:
      "A tracking ID means you always know where your report stands.",
    feature3Title: "Your privacy, protected",
    feature3Body:
      "Report anonymously any time — your identity stays private if you choose.",

    footerLine: "Built for communities. Your report, your words, taken seriously.",
    footerPrivacy: "Reports can be sent anonymously — your identity is protected.",
    footerSubscribeTitle: "Stay informed",
    footerSubscribeBody: "Get updates on how community reports are being resolved.",
    footerSubscribePlaceholder: "Enter your email",
    footerSubscribeButton: "Sign up",
    footerRights: "DengeVoice. Built for the Sahara CodeSwitch Africa Challenge.",

    langToggleLabel: "Language",
  },
  ig: {
    appName: "DengeVoice",

    navHome: "[TODO: Igbo]",
    navReport: "[TODO: Igbo]",
    navTrack: "[TODO: Igbo]",

    heroTitle: "[TODO: native Igbo — Kọọ nsogbu. N'olu gị.]",
    heroSubtitle:
      "[TODO: native Igbo translation of the subtitle — do not ship auto-translated text]",
    ctaStart: "[TODO: Igbo — Start a report]",
    ctaTypeInstead: "[TODO: Igbo — Type instead]",

    storyEyebrow: "[TODO: Igbo]",
    storyBeforeLabel: "[TODO: Igbo]",
    storyAfterLabel: "[TODO: Igbo]",

    categoriesEyebrow: "[TODO: Igbo]",
    categoriesTitle: "[TODO: Igbo]",
    categoriesSubtitle: "[TODO: Igbo]",
    catPowerTitle: "[TODO: Igbo]",
    catPowerDesc: "[TODO: Igbo]",
    catWaterTitle: "[TODO: Igbo]",
    catWaterDesc: "[TODO: Igbo]",
    catRoadsTitle: "[TODO: Igbo]",
    catRoadsDesc: "[TODO: Igbo]",
    catHealthTitle: "[TODO: Igbo]",
    catHealthDesc: "[TODO: Igbo]",
    viewAllCategories: "[TODO: Igbo]",

    ctaBannerEyebrow: "[TODO: Igbo]",
    ctaBannerTitle: "[TODO: Igbo]",
    ctaBannerBody: "[TODO: Igbo]",

    processEyebrow: "[TODO: Igbo]",
    processTitle: "[TODO: Igbo]",
    processSubtitle: "[TODO: Igbo]",
    step1Title: "[TODO] 1.",
    step1Body: "[TODO: Igbo]",
    step2Title: "[TODO] 2.",
    step2Body: "[TODO: Igbo]",
    step3Title: "[TODO] 3.",
    step3Body: "[TODO: Igbo]",
    step4Title: "[TODO] 4.",
    step4Body: "[TODO: Igbo]",

    featureBandTitle: "[TODO: Igbo]",
    feature1Title: "[TODO: Igbo]",
    feature1Body: "[TODO: Igbo]",
    feature2Title: "[TODO: Igbo]",
    feature2Body: "[TODO: Igbo]",
    feature3Title: "[TODO: Igbo]",
    feature3Body: "[TODO: Igbo]",

    footerLine: "[TODO: Igbo]",
    footerPrivacy: "[TODO: Igbo]",
    footerSubscribeTitle: "[TODO: Igbo]",
    footerSubscribeBody: "[TODO: Igbo]",
    footerSubscribePlaceholder: "[TODO: Igbo]",
    footerSubscribeButton: "[TODO: Igbo]",
    footerRights: "DengeVoice. Built for the Sahara CodeSwitch Africa Challenge.",

    langToggleLabel: "Asụsụ",
  },
};