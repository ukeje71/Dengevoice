import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Complaint, SubmitResult } from "@/types/complaint";

function generateTrackingId(): string {
  // Human-readable, easy to read back over voice: DGV-XXXX-XXXX
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  const part = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `DGV-${part()}-${part()}`;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Complaint;

  if (!body.originalTranscript || !body.category) {
    return NextResponse.json(
      { error: "Missing required complaint fields" },
      { status: 400 }
    );
  }

  const trackingId = generateTrackingId();

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("complaints").insert({
      tracking_id: trackingId,
      original_transcript: body.originalTranscript,
      translated_summary: body.translatedSummary,
      category: body.category,
      location: body.location,
      urgency: body.urgency,
      desired_outcome: body.desiredOutcome,
      incident_date: body.incidentDate,
      is_anonymous: body.isAnonymous,
      contact_name: body.isAnonymous ? null : body.contactName,
      contact_phone: body.isAnonymous ? null : body.contactPhone,
    });

    if (error) throw error;

    const result: SubmitResult = { trackingId };
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to save complaint. Check your Supabase env vars and that the 'complaints' table exists (see lib/supabase.ts).",
      },
      { status: 501 }
    );
  }
}
