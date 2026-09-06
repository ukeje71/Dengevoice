import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CATEGORIES, DEFAULT_LANGUAGE, isSupportedLanguage, languageLabel } from "@/types/complaint";
import type { StructuredComplaint, LanguageCode } from "@/types/complaint";

async function callLLM(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set. Add it to .env.local.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Gemini sometimes wraps JSON in ```json ... ``` fences -- strip them
  // before parsing.
  return text.replace(/```json\s*|\s*```/g, "").trim();
}

function buildPrompt(transcript: string, language: LanguageCode): string {
  const langName = languageLabel(language);
  const isEnglish = language === "en";

  // The transcript is code-switched: the citizen's chosen language mixed with
  // English. Gemini both structures it AND produces two summaries -- one in
  // clean English (for official filing) and one in the citizen's own language
  // (so they can review their report comfortably).
  return `You are structuring a citizen complaint spoken in ${langName}-English code-switched speech.

Transcript (may mix ${langName} and English): """${transcript}"""

Return ONLY valid JSON with this exact shape, no other text, no markdown fences:
{
  "translatedSummary": "<clear, formal English summary of the complaint, 1-3 sentences, suitable for official filing>",
  "originalSummary": ${
    isEnglish
      ? `"<same English summary as translatedSummary>"`
      : `"<the same summary written in natural ${langName}, so a ${langName} speaker can review it comfortably>"`
  },
  "category": "<one of: ${CATEGORIES.join(", ")}>",
  "location": "<place mentioned, or empty string if none>",
  "urgency": "<one of: low, medium, high, emergency>",
  "desiredOutcome": "<what the citizen wants done, or empty string if unclear>"
}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const transcript = body?.transcript;

  if (!transcript || typeof transcript !== "string") {
    return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
  }

  const language: LanguageCode =
    typeof body?.primaryLanguage === "string" && isSupportedLanguage(body.primaryLanguage)
      ? body.primaryLanguage
      : DEFAULT_LANGUAGE;

  try {
    const raw = await callLLM(buildPrompt(transcript, language));
    const parsed = JSON.parse(raw) as StructuredComplaint;
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Structuring failed" },
      { status: 501 }
    );
  }
}
