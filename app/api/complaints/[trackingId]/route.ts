import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  const { trackingId } = await params;

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("complaints")
      .select("tracking_id, category, status, created_at")
      .eq("tracking_id", trackingId.toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Tracking ID not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Lookup failed" },
      { status: 501 }
    );
  }
}
