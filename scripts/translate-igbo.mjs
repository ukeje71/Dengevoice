// One-time script: calls Gemini to translate the landing page's English
// copy into Igbo, then writes the result straight into lib/i18n.ts.
//
// This is NOT called at runtime / per page load   it's run manually,
// once, whenever the English copy changes. The output is still
// machine-translated: flag it for native-speaker review before this
// ships to real users.
//
// Usage:
//   node --env-file=.env.local scripts/translate-igbo.mjs

import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "Missing GEMINI_API_KEY. Run this with: node --env-file=.env.local scripts/translate-igbo.mjs"
  );
  process.exit(1);
}

// Source of truth   English copy. Keep this in sync with lib/i18n.ts's
// `en` block if you edit copy there.
const en = {
  appName: "DengeVoice",

  navHome: "Home",
  navReport: "Report",
  navTrack: "Track",

  heroTitle: "Report it in your own words. Not theirs.",
  heroSubtitle:
    "You shouldn't have to speak perfect English, travel to a station, or risk being brushed aside to be heard. Speak naturally   Igbo, English, or a mix   and DengeVoice turns it into a clear report for the right office.",
  heroKicker: "The dignified way to report",
  ctaStart: "Start a report",
  ctaTypeInstead: "Type instead",

  storyEyebrow: "How it actually sounds",
  storyBeforeLabel: "You say it your way",
  storyAfterLabel: "We send a clear report",

  trustEyebrow: "Why report here",
  trustTitle: "Reporting shouldn't cost you your dignity",
  trustSubtitle:
    "Too many people stay silent   afraid of being mocked for how they speak, dismissed at the counter, or identified and targeted later. DengeVoice removes every one of those reasons.",
  trust1Title: "No language barrier",
  trust1Body:
    "Speak the way you actually speak   Igbo, English, or both. No formal English required, no interpreter needed.",
  trust2Title: "No travel required",
  trust2Body:
    "Report from wherever you are. No queue at a station, no waiting for hours to be attended to.",
  trust3Title: "No fear of judgment",
  trust3Body:
    "No one to mock how you sound, wave you off, or make you feel small for speaking up.",
  trust4Title: "Confidential & anonymous",
  trust4Body:
    "Report without giving your name. Your identity stays private, so there's no fear of being targeted for speaking out.",
  trust5Title: "A permanent record",
  trust5Body:
    "Every report gets a tracking ID   proof it exists and can be followed up, unlike a verbal complaint that's easily ignored.",

  categoriesEyebrow: "What you can report",
  categoriesTitle: "Real issues, taken seriously",
  categoriesSubtitle:
    "From power outages to healthcare access   every category is routed to the office that can actually act on it.",
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
  ctaBannerTitle:
    "If going to the station feels like too much, start here instead.",
  ctaBannerBody:
    "No forms in English you're not comfortable with. No queue, no cross-examination, no one making you feel small. Just speak, stay anonymous if you want, and DengeVoice carries it to the right office.",

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
    "We fill in the category, location, and urgency for you   just confirm.",
  step4Title: "4. Track it",
  step4Body:
    "Get a tracking ID and see updates on how your report is being handled.",

  featureBandTitle: "Built to remove every barrier to being heard",
  feature1Title: "Speak naturally",
  feature1Body:
    "Mixing Igbo and English is fine   no need to translate yourself first.",
  feature2Title: "Track every step",
  feature2Body:
    "A tracking ID means you always know where your report stands.",
  feature3Title: "Your privacy, protected",
  feature3Body:
    "Report anonymously any time   your identity stays private if you choose.",

  footerLine: "Built for communities. Your report, your words, taken seriously.",
  footerPrivacy: "Reports can be sent anonymously   your identity is protected.",
  footerSubscribeTitle: "Stay informed",
  footerSubscribeBody: "Get updates on how community reports are being resolved.",
  footerSubscribePlaceholder: "Enter your email",
  footerSubscribeButton: "Sign up",
  footerRights: "DengeVoice. Built for the Sahara CodeSwitch Africa Challenge.",

  langToggleLabel: "Language",

  recordTitle: "Tell us what happened",
  recordVoiceHint:
    "Tap the mic and speak naturally   mixing Igbo and English is completely fine.",
  recordListening: "Listening… tap to stop",
  recordProcessing: "Turning your words into a report…",
  recordUseVoiceLink: "Use voice instead",
  recordContinueBtn: "Continue",
  recordTypedPlaceholder: "Describe what happened, where, and when…",
};

const prompt = `Translate the following JSON object's values from English to Igbo.
This is UI copy for a civic complaint-reporting app aimed at everyday Igbo speakers
(including people with low literacy), so keep it plain, warm, and natural spoken Igbo  
not formal/academic Igbo, not a literal word-for-word translation.

Keep every key exactly the same. Return ONLY a valid JSON object, no markdown fences,
no commentary, no preamble.

${JSON.stringify(en, null, 2)}`;

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

const result = await model.generateContent(prompt);
const raw = result.response.text().trim();
const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");

let ig;
try {
  ig = JSON.parse(cleaned);
} catch {
  console.error("Gemini didn't return valid JSON. Raw response:\n", raw);
  process.exit(1);
}

// Keep app name and rights line untranslated (brand name / attribution).
ig.appName = "DengeVoice";
ig.footerRights = en.footerRights;
ig.langToggleLabel = ig.langToggleLabel || "Asụsụ";

const fileContent = `// Landing page copy in both languages.
// The "ig" (Igbo) strings were generated by Gemini via scripts/translate-igbo.mjs
//   machine-translated, NOT yet reviewed by a native speaker. Have someone
// fluent check this before it ships to real users, then you can remove this note.

export type Lang = "en" | "ig";

export const copy: Record<Lang, Record<string, string>> = {
  en: ${JSON.stringify(en, null, 4).replace(/\n/g, "\n  ")},
  ig: ${JSON.stringify(ig, null, 4).replace(/\n/g, "\n  ")},
};
`;

const outPath = path.join(__dirname, "..", "lib", "i18n.ts");
writeFileSync(outPath, fileContent, "utf-8");

console.log("✅ lib/i18n.ts updated with Gemini-generated Igbo copy.");
console.log("⚠️  Still needs native-speaker review before shipping.");
