import { createClient } from "@supabase/supabase-js";

// Server-only client -- uses the service role key. Never import this file
// from a "use client" component; it must only run in API routes/server code.
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local."
    );
  }

  return createClient(url, key);
}

/*
TODO: create this table in your Supabase project (SQL editor):

create table complaints (
  id uuid primary key default gen_random_uuid(),
  tracking_id text unique not null,
  original_transcript text not null,
  translated_summary text not null,
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
*/
