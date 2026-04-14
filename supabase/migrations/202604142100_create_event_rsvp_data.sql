-- Create RSVP data table
-- Links events to their RSVP information and URLs

create table if not exists public.event_rsvp_data (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  club_name text not null,
  event_name text not null,
  event_date date not null,
  source_url text,
  rsvp_url text,
  rsvp_type text not null check (rsvp_type in ('no_registration_required', 'external_registration', 'calendar_rsvp')),
  cost text,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

-- Add unique constraint to prevent duplicate RSVP data for the same event
alter table public.event_rsvp_data
add constraint event_rsvp_data_event_id_unique unique (event_id);

-- Enable RLS
alter table public.event_rsvp_data enable row level security;

-- Allow authenticated users to read RSVP data
drop policy if exists "RSVP data is readable by authenticated users" on public.event_rsvp_data;
create policy "RSVP data is readable by authenticated users"
on public.event_rsvp_data
for select
using (auth.role() = 'authenticated');