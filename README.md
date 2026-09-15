# DengeVoice

DengeVoice is a voice-first civic complaint app designed for the Sahara CodeSwitch Africa Challenge 2026. It helps citizens report issues in natural, code-switched speech such as Igbo-English, then transforms that speech into a structured and trackable complaint that can be reviewed and submitted with minimal friction.

The product sits in the Legal & Public Services track and is built to solve a real operational problem: people often know what is wrong in their communities, but formal complaint systems are too rigid, text-heavy, and inaccessible for everyday spoken usage in multilingual contexts.

## Why this project matters

In many communities, citizens do not speak in a single language or in perfect formal English. They naturally mix languages, especially across English and Nigerian languages such as Igbo. Traditional complaint flows often fail because:

- they expect typed, polished submissions
- they assume a single dominant language
- they do not handle spoken, informal, multilingual input well
- they make reporting feel too bureaucratic for everyday citizens

DengeVoice turns voice and code-switching into a usable civic workflow: speak your complaint, review the transcript, let AI structure the report, and submit a complaint that can be tracked later.

## What the app does

- Records a complaint via microphone or typed entry
- Accepts natural spoken code-switched input in supported languages
- Uses Sahara ASR to transcribe the original mixed-language audio
- Uses Gemini to translate, extract structured information, and infer fields such as category, location, urgency, and desired outcome
- Lets the citizen review and edit the transcript and structured form side by side
- Stores the saved complaint in Supabase with a unique tracking ID
- Allows later lookup by tracking ID to view complaint status
- Includes an anonymity option before submission

## Challenge fit

This project is built specifically for the Sahara challenge’s core focus on code-switching and real-world speech understanding. It demonstrates that a voice-first system can work in multilingual African environments, not just in English-only or single-language contexts.

The app is designed around a realistic civic workflow:

1. citizen speaks a complaint naturally
2. speech is transcribed without forcing a clean language boundary
3. the system extracts usable data from the complaint
4. the complaint becomes trackable and reviewable

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Zustand for client state
- Supabase for persistence and tracking IDs
- Sahara API for ASR transcription
- Google Gemini API for translation and structured extraction
- Framer Motion for UI motion and micro-interactions

## Project structure

```bash
app/
  api/
    complaints/
      route.ts
      [trackingId]/route.ts
    structure/route.ts
    transcribe/route.ts
  confirm/page.tsx
  record/page.tsx
  track/page.tsx

components/
  Header.tsx
  LanguageToggle.tsx
  Loader.tsx
  ProgressSteps.tsx
  ...

lib/
  i18n.ts
  store.ts
  supabase.ts

types/
  complaint.ts

scripts/
  translate-igbo.mjs
```

## User flow

### 1. Record a complaint

The user lands on the voice/text entry screen and can:

- record audio
- type a complaint when mic access is unavailable
- choose the spoken language

### 2. Transcription step

The app sends the audio to the Sahara API and receives the raw transcript in the original language mix.

### 3. Structured review

The app sends the transcript to Gemini, which:

- translates summary content to English
- extracts complaint fields
- infers category, urgency, location, and desired outcome

The citizen can adjust every field before submitting.

### 4. Submission and tracking

The complaint is inserted into Supabase with a generated ID such as `DGV-XXXX-XXXX`, and the user can later retrieve the complaint by tracking code.

## Environment variables

Create a `.env.local` file in the project root with the following values:

```bash
SAHARA_API_KEY=
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Important notes:

- never expose your service role key in browser code
- do not use a `NEXT_PUBLIC_` prefix for `SUPABASE_SERVICE_ROLE_KEY`
- keep actual keys out of git history, chat logs, and screenshots

## Local development

### Install dependencies

```bash
npm install
```

### Run the application

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Supabase setup

The app expects a `complaints` table in Supabase.

Example SQL:

```sql
create extension if not exists pgcrypto;

create table if not exists complaints (
  id uuid primary key default gen_random_uuid(),
  tracking_id text unique not null,
  original_transcript text not null,
  translated_summary text,
  category text not null,
  location text,
  urgency text not null,
  desired_outcome text,
  incident_date timestamptz not null,
  is_anonymous boolean not null default false,
  contact_name text,
  contact_phone text,
  status text not null default 'received',
  created_at timestamptz not null default now()
);
```

If the project is paused or the table does not exist, submissions will fail even when the app code is correct.

## Benchmarking and evaluation

This app is designed with the challenge benchmark in mind. The project includes benchmark tooling for evaluating speech and language quality.

Typical workflow:

```bash
python3 --version
pip install datasets soundfile jiwer openai-whisper google-generativeai requests --break-system-packages
```

Also ensure `ffmpeg` is installed on the machine because Whisper depends on it for audio processing.

Then run a small benchmark to validate the pipeline before larger runs:

```bash
python benchmark/run_benchmark.py --n 5
```

The benchmark is intended to check how well the app handles real mixed-language speech and how the transcription pipeline performs against ground-truth references.

## Key product principles

- multilingual by default
- voice-first instead of keyboard-first
- structured civic data extraction rather than raw text dumping
- privacy-aware reporting with optional anonymity
- trackable complaints for public service accountability

## Screens and experience

The app includes:

- landing page with product messaging and challenge positioning
- complaint recording flow
- review/edit confirmation step
- tracking page for submitted complaint lookup
- language-aware UI and progression through the complaint workflow

## Notes for contributors

This project was intentionally built to be fast to understand and easy to iterate on. A few important conventions are worth keeping in mind:

- use stable IDs instead of translated text for UI logic
- avoid dynamic Tailwind class names that are not statically present
- respect the app’s language architecture and keep English and Igbo copy in sync
- keep the complaint schema consistent with the Supabase table
- do not expose service-role secrets in any frontend or documentation artifacts

## License

This project is a hackathon submission repository and is intended for challenge use. Please check the project license or repository hosting rules before external reuse or commercial distribution.

## Acknowledgements

- Sahara API for speech transcription
- Google Gemini for structured extraction and summarization
- Supabase for data storage and retrieval
- Intron for the Sahara CodeSwitch Africa Challenge framework

## Summary

DengeVoice shows that civic reporting can be made more natural, more inclusive, and more useful in multilingual African contexts. The app turns human speech into a structured complaint that can be reviewed, saved, and tracked, which makes it a strong fit for the Sahara challenge’s focus on real-world code-switching and accessible public-service technology.
