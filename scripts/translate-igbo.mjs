// One-time script: calls Gemini to translate the app's English UI copy into
// every other supported language (Igbo, Yoruba, Hausa, Nigerian Pidgin), then
// writes the result straight into lib/i18n.ts.
//
// This is NOT called at runtime / per page load -- it's run manually, once,
// whenever the English copy changes. The output is still machine-translated:
// flag it for native-speaker review before this ships to real users.
//
// (The filename says "igbo" for historical reasons -- it now does all five
//  languages. Kept the name so existing docs/commands still point at it.)
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

// Languages to generate, keyed by the same stable codes used across the app
// (types/complaint.ts SUPPORTED_LANGUAGES / lib/i18n.ts Lang). English is the
// source and is written verbatim, so it's not in this list.
const TARGET_LANGUAGES = [
  { code: "ig", name: "Igbo" },
  { code: "yo", name: "Yoruba" },
  { code: "ha", name: "Hausa" },
  { code: "pcm", name: "Nigerian Pidgin (Naijá)" },
];

// Source of truth -- English copy. Keep this in sync with lib/i18n.ts's
// `en` block if you edit copy there.
const en = {
  appName: "DengeVoice",

  navHome: "Home",
  navReport: "Report",
  navTrack: "Track",

  heroTitle: "Report it in your own words. Not theirs.",
  heroSubtitle:
    "You shouldn't have to speak perfect English, travel to a station, or risk being brushed aside to be heard. Speak naturally in your own language and DengeVoice turns it into a clear report for the right office.",
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
    "Speak the way you actually speak. No formal English required, no interpreter needed.",
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
    "Speak your own language, mix in English freely   no need to translate yourself first.",
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
    "Tap the mic and speak naturally   mixing your language with English is completely fine.",
  recordListening: "Listening… tap to stop",
  recordProcessing: "Turning your words into a report…",
  recordUseVoiceLink: "Use voice instead",
  recordContinueBtn: "Continue",
  recordTypedPlaceholder: "Describe what happened, where, and when…",
  recordLanguageLabel: "What language will you speak?",
  recordMicError:
    "Couldn't access your microphone. Check browser permissions, or use 'Type instead' below.",
  recordMicUnsupported:
    "Your browser blocked recording here — this page needs a secure (https) or localhost address. If you opened the app over a network link, use 'Type instead' below.",
  recordTranscribeError:
    "Something went wrong transcribing your recording. Try 'Type instead' below.",
  recordTryAgain: "Try again",
  recordCharacters: "characters",

  // ----- Confirm screen -----
  confirmTitle: "Does this look right?",
  confirmSubtitle:
    "We've turned what you said into a report. Read it over, fix anything that's off, and send it when you're happy.",
  confirmReviewing: "Reviewing your report…",
  confirmAutofillError:
    "Auto-fill isn't available right now. Please fill the fields below manually.",
  confirmFieldSaid: "What you said",
  confirmFieldOriginalSummary: "Summary in your language",
  confirmOriginalSummaryPlaceholder:
    "A summary in your own language, so you can check it reads right.",
  confirmFieldEnglishSummary: "English summary",
  confirmFieldCategory: "Category",
  confirmCategoryPlaceholder: "Select a category",
  confirmFieldLocation: "Location",
  confirmLocationPlaceholder: "e.g. Aba, Abia State",
  confirmFieldUrgency: "Urgency",
  confirmUrgencyLow: "Low",
  confirmUrgencyMedium: "Medium",
  confirmUrgencyHigh: "High",
  confirmUrgencyEmergency: "Emergency",
  confirmFieldOutcome: "What would you like to happen?",
  confirmAnonTitle: "Submit anonymously",
  confirmAnonBody: "Your name and contact won't be attached to this report.",
  confirmNamePlaceholder: "Your name",
  confirmPhonePlaceholder: "Phone number",
  confirmSubmitBtn: "Submit report",
  confirmSubmitting: "Submitting…",
  confirmSubmitError: "Submission failed",

  // ----- Track screen -----
  trackTitle: "Track your report",
  trackSubmittedTitle: "Report submitted",
  trackSubmittedBody:
    "Save this tracking ID to check your report's status anytime:",
  trackCopy: "Copy",
  trackCopied: "Copied",
  trackCopyId: "Copy ID",
  trackIdLabel: "Tracking ID",
  trackCheckBtn: "Check",
  trackLookingUp: "Looking it up…",
  trackNotFound:
    "We couldn't find a report with that tracking ID. Double-check and try again.",
  trackError: "Something went wrong looking that up. Try again in a moment.",
  trackCategoryLabel: "Category",
  trackSubmittedLabel: "Submitted",
  trackReportAnother: "Report another issue",
  trackIdCopiedToast: "Tracking ID copied",

  // ----- Status labels (report lifecycle) -----
  statusReceived: "Received",
  statusUnderReview: "Under review",
  statusInProgress: "In progress",
  statusResolved: "Resolved",
  statusClosed: "Closed",
};

function buildPrompt(langName) {
  return `Translate the following JSON object's values from English to ${langName}.
This is UI copy for a civic complaint-reporting app aimed at everyday ${langName} speakers
(including people with low literacy), so keep it plain, warm, and natural spoken ${langName} --
not formal/academic ${langName}, not a literal word-for-word translation.

Keep every key exactly the same. Do NOT translate the brand name "DengeVoice" or the
tracking-ID format "DGV-XXXX-XXXX". Return ONLY a valid JSON object, no markdown fences,
no commentary, no preamble.

${JSON.stringify(en, null, 2)}`;
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

async function translateTo(langName) {
  const result = await model.generateContent(buildPrompt(langName));
  const raw = result.response.text().trim();
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
  return { raw, parsed: JSON.parse(cleaned) };
}

// The Gemini endpoint occasionally drops a connection ("fetch failed") or
// returns non-JSON. Retry a few times with a short backoff before giving up,
// so one network blip doesn't waste the whole run.
async function translateWithRetry(langName, attempts = 4) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await translateTo(langName);
    } catch (err) {
      lastErr = err;
      if (i < attempts) {
        const waitMs = 1500 * i;
        process.stdout.write(`retry ${i}/${attempts - 1} in ${waitMs}ms… `);
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }
  throw lastErr;
}

// Generate every target language. Done sequentially (not Promise.all) to stay
// gentle on rate limits and make a single failure easy to pin to a language.
const generated = {};
for (const { code, name } of TARGET_LANGUAGES) {
  process.stdout.write(`Translating -> ${name} (${code})… `);
  try {
    const { parsed } = await translateWithRetry(name);
    // Keep brand name / attribution untranslated.
    parsed.appName = "DengeVoice";
    parsed.footerRights = en.footerRights;
    generated[code] = parsed;
    console.log("done");
  } catch (err) {
    console.error(`\nFailed on ${name}: ${err.message}`);
    process.exit(1);
  }
}

// Assemble copy object: English source first, then each generated language.
const allLangs = { en, ...generated };
const langBlocks = Object.entries(allLangs)
  .map(
    ([code, obj]) =>
      `  ${code}: ${JSON.stringify(obj, null, 4).replace(/\n/g, "\n  ")},`
  )
  .join("\n");

const codeUnion = ["en", ...TARGET_LANGUAGES.map((l) => l.code)]
  .map((c) => `"${c}"`)
  .join(" | ");

const fileContent = `// App UI copy in every supported language.
// Non-English strings were generated by Gemini via scripts/translate-igbo.mjs
//   machine-translated, NOT yet reviewed by a native speaker. Have someone
// fluent check each language before it ships to real users, then remove this note.

export type Lang = ${codeUnion};

export const copy: Record<Lang, Record<string, string>> = {
${langBlocks}
};
`;

const outPath = path.join(__dirname, "..", "lib", "i18n.ts");
writeFileSync(outPath, fileContent, "utf-8");

console.log("\n✅ lib/i18n.ts updated with Gemini-generated copy for:", Object.keys(allLangs).join(", "));
console.log("⚠️  Still needs native-speaker review before shipping.");
