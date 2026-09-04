@AGENTS.md

# DengeVoice — Project Brief for Claude Code

Read this fully before making changes. This project has an active deadline
and several past bugs that are easy to reintroduce if you don't know the
history below.

## What this is

**DengeVoice** — a voice-first citizen complaint app for the **Sahara
CodeSwitch Africa Challenge 2026** (a hackathon run by Intron), competing
solo in the **Legal & Public Services** track with **Igbo-English**
code-switching as the language pair.

Built by: Ukeje Chinaza Isaac ("Kreativ-jae"), self-taught frontend dev
based in Aba, Abia State, Nigeria.

**Deadline: 15 September 2026, 11:59pm WAT.** Submission portal:
https://sahara-challenge.vercel.app/ (login with registered email + access
token emailed to the participant). Only ONE submission is allowed per
access token — do not submit until everything is genuinely final.

### Core concept

Citizen speaks a complaint naturally, mixing Igbo and English → Sahara
transcribes it (original mixed-language text, not translated) → Gemini
translates to English + extracts structured fields (category, location,
urgency, desired outcome) → citizen reviews/edits both the raw transcript
AND the structured form side-by-side → submits → gets a tracking ID →
can check status later. Anonymity toggle sits right before submit.

### Judging criteria (know these — they drive priority)

- Code-Switching Benchmark Quality — **30%** (the single biggest factor)
- Product Quality & Fit — 25%
- Real-World Impact — 20%
- Technical Execution — 15%
- Ethics/Safety/Inclusion — 10%

## Tech stack

Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4
(CSS-based `@theme inline` config, not a JS config file), Zustand (client
state), Supabase (Postgres — storage + tracking IDs), Sahara API (ASR),
Google Gemini API (`gemini-3.6-flash` — translation + structuring),
Framer Motion (animations).

### Environment variables (names only — never paste actual values into
chat/commits; rotate immediately if a real key is ever exposed anywhere)

```
SAHARA_API_KEY=
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=      <- NOTE: no NEXT_PUBLIC_ prefix, ever.
                                    That prefix bundles it into browser JS,
                                    which would expose the DB master key.
                                    This was a real bug once — don't
                                    reintroduce it.
```

## Architecture / user flow

1. `/` (`components/LandingPage.tsx`) — marketing/landing page
2. `/record` (`components/RecordScreen.tsx`) — voice or text complaint entry
   → `POST /api/transcribe` (Sahara)
3. `/confirm` (`components/ConfirmScreen.tsx`) — review transcript +
   structured fields → `POST /api/structure` (Gemini) runs automatically
   on load if fields aren't filled yet → user edits → submit →
   `POST /api/complaints` (Supabase insert, generates `DGV-XXXX-XXXX`
   tracking ID)
4. `/track` (`components/TrackScreen.tsx`) — look up a report by tracking
   ID → `GET /api/complaints/[trackingId]`

Shared UI across all screens: `components/Header.tsx` (nav + language
toggle), `components/ProgressSteps.tsx` (4-step flow indicator — Speak /
Review / Confirm / Track), `components/Loader.tsx` (shared loading
animation, use this instead of writing new spinners).

## Design system

Palette (Uli-art/Akwete-textile inspired — defined in `app/globals.css`
via `@theme inline`, use as Tailwind classes like `bg-indigo`,
`text-marigold`, never hex codes inline):

```
paper    #F7EFDD   — background
indigo   #22304A   — primary/headings
marigold #E8A33D   — primary CTA color
brick    #C1502E   — errors/alerts/secondary accent
palm     #4F7942   — success/positive states
ink      #2B211B   — body text
```

Fonts: `Fraunces` (warm editorial serif, headlines only — use
`font-[family-name:var(--font-display)]`) + `Geist` (body text, default).

Cards generally use `rounded-[2.5rem]` with `border border-indigo/10
bg-white/50`. The `.woven-texture` utility class (in `globals.css`) adds a
subtle geometric background texture — used sparingly, not on every card.

## i18n (English/Igbo)

`lib/i18n.ts` holds all UI copy as `copy.en` / `copy.ig` objects with
matching keys. **Igbo strings are currently placeholders in some places
and Gemini-machine-translated in others** — none of it has had native
speaker review yet. Treat any Igbo copy as provisional.

`scripts/translate-igbo.mjs` regenerates the `ig` block via Gemini:
```
node --env-file=.env.local scripts/translate-igbo.mjs
```
This OVERWRITES `lib/i18n.ts` entirely on success. If you add new English
copy keys, add them to BOTH `lib/i18n.ts` (as `en` value + `ig` TODO
placeholder) AND the `en` source object inside `translate-igbo.mjs`, or
they'll silently disappear next time the script runs. There's a habit
established in this project of checking these two files stay in sync —
keep doing that.

Category names (`types/complaint.ts` → `CATEGORIES`, 13 total) are the
single source of truth for the complaint category enum — never hardcode a
duplicate list elsewhere. If you need translated display copy for a
category, keep the ENGLISH enum value as a separate stable field (see
`CategoriesSection.tsx`'s `raw` field pattern) rather than matching on
translated text — matching UI logic against translated strings has caused
real bugs here before (see gotchas below).

## Known gotchas — please don't reintroduce these

1. **Never key a React list item by translated text.** `key={t.someTitle}`
   breaks when the language toggles (the key changes, React remounts the
   whole node, which caused a real "images go blank on language switch"
   bug in `CategoriesSection.tsx`). Always key by a stable,
   language-independent id.
2. **Never filter/compare against translated strings for logic.** Same
   root cause as above — a "view all categories" list was comparing
   translated titles against the English `CATEGORIES` enum and broke in
   Igbo mode. Compare against raw English enum values or stable ids, only
   use translated strings for display.
3. **Tailwind can't resolve dynamically-built class names** like
   `` `bg-${variable}` ``. It needs literal class strings present
   somewhere in the source to generate the CSS. Use a lookup array/map of
   full literal class names instead.
4. **`next/font/google`'s Fraunces**: `axes` and `weight` props conflict —
   don't set both. Omit `weight` entirely when using `axes` for variable
   font behavior.
5. **`next/image` with `fill`** requires the parent element to have
   `position: relative` and a defined size (aspect-ratio class or fixed
   height) — otherwise it silently renders nothing.
6. **Don't call `setState` synchronously in a `useEffect` body directly**
   — `eslint-plugin-react-hooks`'s newer `set-state-in-effect` rule flags
   this (cascading render risk). Prefer computing initial state via a
   lazy `useState(() => ...)` initializer, or defer the call with
   `queueMicrotask(...)` if it must happen in an effect.
7. **Sahara's upload endpoint rejects files without a real extension** —
   `MediaRecorder` produces `audio/webm` with no filename extension by
   default; the filename sent to Sahara must end in `.webm` (or whatever
   the actual format is) or it's rejected as an invalid file type.
8. **Gemini model names get deprecated/restricted without much warning.**
   This project has already moved through `gemini-1.5-flash` (retired) →
   `gemini-2.5-flash` (new-account restricted) → `gemini-3.6-flash`
   (current, working). If Gemini calls start failing with a model-not-
   found or access error, check for a newer model name before assuming
   it's a code bug.
9. **API keys have been accidentally pasted in chat/exposed before** —
   always rotate immediately if this happens, and double check
   `SUPABASE_SERVICE_ROLE_KEY` never gets a `NEXT_PUBLIC_` prefix.

## Current status (as of last handoff)

- Landing page, Record, Confirm, and Track screens are all built and
  visually consistent (Header, ProgressSteps, brand colors/fonts,
  Framer Motion animations throughout).
- Full pipeline (record → Sahara transcribe → Gemini structure → confirm
  → Supabase submit → track lookup) has been confirmed working
  end-to-end.
- Landing page images are wired to real assets in `/assets` — see git
  history/prior component versions if a mapping is unclear.
- **Benchmarking has NOT been run yet** — this is the single biggest gap
  against the judging criteria (30% weight) and is the current priority.
  See below.

## THE IMMEDIATE TASK: benchmarking

`benchmark/run_benchmark.py` is written and ready but has **not been run
yet**. This is the top priority — walk the user through running it
step by step, since they're not a Python developer by background:

1. Confirm Python 3 is installed (`python3 --version`).
2. Install dependencies:
   ```
   pip install datasets soundfile jiwer openai-whisper google-generativeai requests --break-system-packages
   ```
   Whisper also needs `ffmpeg` on the system (`brew install ffmpeg` /
   `apt install ffmpeg` / see ffmpeg.org for Windows). Check this
   explicitly — it's a common silent-failure point.
3. Load the API keys into the Python process's environment (this is
   separate from Next.js's `.env.local` loading — Python doesn't read it
   automatically):
   ```
   export $(grep -v '^#' .env.local | xargs)
   ```
4. Run a SMALL test first: `python benchmark/run_benchmark.py --n 5`
   before committing to a bigger run — Whisper is slow on CPU and it's
   better to catch a config problem on 5 clips than 15.
5. The script pulls Igbo clips from `intronhealth/AfriSwitch` (CC BY 4.0
   licensed, streamed — does not download the full 54-hour dataset), runs
   each through Sahara + Gemini + Whisper, scores each against the
   dataset's ground-truth transcript with WER, and writes
   `benchmark_results.csv`.
6. **Known unknown:** the exact ground-truth transcript column name in
   the AfriSwitch dataset wasn't confirmed before this script was
   written (the mobile Hugging Face preview only showed audio/language/
   filename columns). `find_transcript_field()` in the script tries
   `transcription`, `transcript`, `text`, `sentence` in that order — if
   none match, it'll error and print the actual available fields. Fix
   the field name in that function based on what it prints.
7. Once results look right, fill in `benchmark/BENCHMARK_REPORT_TEMPLATE.md`
   — it already has the model comparison table structure, methodology,
   and a citation to the AfriSwitch paper's own reported Igbo baseline
   (~69% mean WER across systems, for context) pre-written. Only the
   `[X]%` numeric blanks and qualitative observations need filling in
   from the actual run.
8. Export the completed report to PDF (max 3 pages — this is a hard
   submission requirement), host it somewhere with public view access
   (Google Drive "anyone with the link"), and that link goes in the
   submission form's "Benchmark Report Link" field.

## Submission form — exact fields (from the live portal)

The form at sahara-challenge.vercel.app has these fields, in order. Word
counts shown are the form's own soft limits:

**Solution Description**
1. A short description of the problem your app addresses (~50 words)
2. Target user(s) and potential number of users impacted (~50 words)
3. How your app solves the user problem (~50 words)
4. Does your solution support code-switching? (Yes/No dropdown — answer
   Yes)
5. Does your solution use the Sahara APIs? (Yes/No dropdown — answer Yes)
6. How is the solution agentic? What downstream task does the
   code-switched transcript enable? (~50 words — answer: transcript →
   structured, trackable civic complaint report, not just raw text)
7. High-level technical overview: at least 3 architecture choices +
   tradeoffs considered (~250 words)
8. Ethics/Inclusion: privacy, consent, safety, security, responsible data
   use (~100 words) — DengeVoice's real answers here: anonymous
   submission option, no contact info required unless the user opts in,
   check what actually happens to raw audio after transcription (verify
   in `app/api/transcribe/route.ts` / `app/api/complaints/route.ts`
   before writing this — don't claim a privacy behavior without
   confirming it in the actual code first)

**Demo**
- Demo Video URL — YouTube, public or unlisted, max 5 minutes, MUST
  visibly show code-switching (code-mixing) happening, not just talk
  about it

**Benchmark Report**
- Benchmark Report Link — hosted PDF, max 3 pages, "anyone with the link
  can view"
- Benchmark Audios Link (optional) — Hugging Face link to consented,
  de-identified code-switched audio samples used for benchmarking, with
  metadata (duration, language, etc.). Since `AfriSwitch` is already a
  public CC BY 4.0 dataset, using clips from it directly satisfies
  "consented" — just attribute the source dataset, no separate consent
  process needed for those specific clips.

## Remaining priority order

1. **Run the benchmark, fill in the report** (biggest score weight, zero
   progress as of this handoff)
2. Write the ethics/inclusion note (quick — substance already exists in
   the product)
3. Fill in the rest of the submission form's text fields
4. Record the demo video (must show code-switching on screen)
5. Test the actual submission portal login with the real access token
   well before the deadline, not at the last minute

## Working style preferences (the person you're working with)

- Wants direct, honest feedback — no sugarcoating, will explicitly ask
  for brutal honesty
- Prefers structured responses (tables, bullets, clear summaries)
- Often communicates via voice dictation — messages may have transcription
  artifacts/typos, read for intent
- For code changes, wants actual runnable code, not just descriptions —
  verify things compile/lint before presenting them as done
