import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CATEGORIES } from "@/types/complaint";
import type { StructuredComplaint } from "@/types/complaint";

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

function buildPrompt(transcript: string): string {
  return `You are structuring a citizen complaint spoken in Igbo-English code-switched speech.

Transcript (may mix Igbo and English): """${transcript}"""

Return ONLY valid JSON with this exact shape, no other text, no markdown fences:
{
  "translatedSummary": "<English summary of the complaint, 1-3 sentences>",
  "category": "<one of: ${CATEGORIES.join(", ")}>",
  "location": "<place mentioned, or empty string if none>",
  "urgency": "<one of: low, medium, high, emergency>",
  "desiredOutcome": "<what the citizen wants done, or empty string if unclear>"
}`;
}

export async function POST(req: NextRequest) {
  const { transcript } = await req.json();

  if (!transcript || typeof transcript !== "string") {
    return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
  }

  try {
    const raw = await callLLM(buildPrompt(transcript));
    const parsed = JSON.parse(raw) as StructuredComplaint;
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Structuring failed" },
      { status: 501 }
    );
  }
}
