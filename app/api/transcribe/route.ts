import { NextRequest, NextResponse } from "next/server";
import type { TranscribeResult } from "@/types/complaint";

const UPLOAD_URL = "https://infer.voice.intron.io/file/v1/upload";
const STATUS_URL = (fileId: string) =>
  `https://infer.voice.intron.io/file/v1/status/${fileId}`;

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 30; // ~60 seconds max wait

export async function POST(req: NextRequest) {
  const apiKey = process.env.SAHARA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "SAHARA_API_KEY not set. Add it to .env.local." },
      { status: 501 }
    );
  }

  const formData = await req.formData();
  const audioFile = formData.get("audio");

  if (!audioFile || !(audioFile instanceof Blob)) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  // --- Step 1: upload the audio file ---
  // MediaRecorder in the browser produces audio/webm -- the filename here
  // needs a real extension or Sahara rejects it as an invalid file type.
  const filename = `complaint-${Date.now()}.webm`;
  const uploadForm = new FormData();
  uploadForm.append("audio_file_blob", audioFile, filename);
  uploadForm.append("audio_file_name", filename);
  uploadForm.append("use_language_asr_input", "ig"); // Igbo-English code-switching
  uploadForm.append("use_category", "file_category_legal");

  const uploadRes = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: uploadForm,
  });

  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    return NextResponse.json(
      { error: `Sahara upload failed: ${uploadRes.status} ${text}` },
      { status: 502 }
    );
  }

  const uploadData = await uploadRes.json();

  // TODO: confirm this field name against the "Response on upload" sample
  // in the docs -- guessing data.file_id based on the status-endpoint
  // pattern (/file/v1/status/{file_id}). Adjust if the docs show a
  // different key (e.g. data.audio_file_id, data.id).
  console.log("Sahara upload response:", JSON.stringify(uploadData));
  const fileId: string | undefined = uploadData?.data?.file_id;

  if (!fileId) {
    return NextResponse.json(
      {
        error:
          "Upload succeeded but no file_id found in response. Check the server console log for the raw upload response shape, and update route.ts to match the real field name.",
        rawResponse: uploadData,
      },
      { status: 502 }
    );
  }

  // --- Step 2: poll for transcription status ---
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const statusRes = await fetch(STATUS_URL(fileId), {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!statusRes.ok) continue; // transient error, retry

    const statusData = await statusRes.json();
    const processingStatus = statusData?.data?.processing_status;

    if (processingStatus === "FILE_TRANSCRIBED") {
      const result: TranscribeResult = {
        transcript: statusData.data.audio_transcript ?? "",
      };
      return NextResponse.json(result);
    }

    // Any other status (e.g. FILE_PROCESSING) -- keep polling.
    // TODO: if Sahara has an explicit failure status, check for it here
    // and return an error immediately instead of polling to the timeout.
  }

  return NextResponse.json(
    { error: "Transcription timed out. Try recording a shorter clip, or try again." },
    { status: 504 }
  );
}
