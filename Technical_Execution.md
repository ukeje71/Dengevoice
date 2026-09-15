# DengeVoice — Technical Execution

**Live product:** https://dengevoice.vercel.app
**Benchmark repo:** https://huggingface.co/datasets/ukeje71/Dengevoice

## Architecture Overview

DengeVoice is a Next.js (TypeScript) application with a voice-first complaint
flow: **Record → Review/Confirm → Track**. The frontend is built with
Zustand for state management and Framer Motion for interaction feedback;
Tailwind CSS handles styling.

## ASR Integration

Voice input is transcribed via **Sahara's ASR API** (Intron), called from a
server-side Next.js API route (`app/api/transcribe/route.ts`). The
integration explicitly passes a `use_language_asr_input` parameter on every
request — required both by Sahara's platform update (effective 14 Sept
2026) and by DengeVoice's own multilingual design, since the app supports
four Nigerian languages (Igbo, Yoruba, Hausa, Pidgin) code-switched with
English, and silently defaulting to English would misrepresent what the
user actually said.

Upload and transcription follow an async poll pattern: the audio file is
uploaded, a `file_id` is returned, and the client polls a status endpoint
until `FILE_TRANSCRIBED`, then reads the resulting transcript.

## AI-Assisted Structuring

Once a transcript is captured, a second step (`/api/structure`) uses an LLM
to turn free-form spoken complaint text into structured fields — category,
location, urgency, desired outcome — which the user then reviews and can
edit before submission. This is deliberately a **human-in-the-loop** design:
the structuring step never submits on the user's behalf without their
confirmation, and every AI-populated field remains directly editable.

## Engineering Decisions Worth Noting

- **Edit-over-rerecord:** if ASR mis-transcribes, the user corrects the text
  directly on the confirmation screen rather than being forced to
  re-record — reduces friction and respects that voice input, especially
  across code-switched speech, will not always be perfect.
- **Text fallback everywhere:** a "type instead" option is available on
  every voice-input screen, so users are never blocked by connectivity,
  noise, or a personal preference for typing.
- **Optional anonymity:** a toggle lets users submit without contact
  details, addressing a real barrier — fear of retaliation — for
  civic reporting in some contexts.

## Benchmarking Methodology

Choosing Sahara as the production ASR engine was validated, not assumed.
A separate benchmark pipeline (Python, run in Google Colab) tested Sahara
against two open alternatives — Meta's MMS and NCAIR/NITDA's
language-specific Whisper fine-tunes — across 30 code-switched audio clips
per language, spanning all four of DengeVoice's core languages. Scoring
used Word Error Rate and Character Error Rate via `jiwer`, with identical
text normalization applied to every engine's output for a fair comparison.

**Result:** Sahara achieved the lowest WER in all four languages tested.
Full methodology, per-language error analysis, and reproducible scripts are
published at the Hugging Face link above.

## Stack Summary

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS, Framer Motion, Zustand |
| ASR | Sahara API (Intron) |
| Structuring | LLM-based field extraction |
| Benchmarking | Python, Hugging Face `transformers`, `jiwer`, Google Colab |
| Deployment | Vercel |
