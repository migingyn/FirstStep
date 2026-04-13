create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  description text not null,
  event_date date not null,
  start_time text not null,
  end_time text null,
  location text not null,
  category text not null,
  tags text[] not null default '{}'::text[],
  confidence_tags text[] not null default '{}'::text[],
  organizer text not null,
  image_url text null,
  why_recommended text null,
  external_rsvp_url text null,
  rsvp_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.events enable row level security;

drop policy if exists "Events are readable by authenticated users" on public.events;
create policy "Events are readable by authenticated users"
on public.events
for select
using (auth.role() = 'authenticated');
