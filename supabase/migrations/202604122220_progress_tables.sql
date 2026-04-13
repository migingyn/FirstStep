create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  status text not null check (status in ('pending', 'going', 'maybe', 'not-going')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, event_id)
);

create table if not exists public.saved_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, event_id)
);

create table if not exists public.dismissed_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, event_id)
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  map_visited boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists event_rsvps_set_updated_at on public.event_rsvps;
create trigger event_rsvps_set_updated_at
before update on public.event_rsvps
for each row
execute function public.set_updated_at();

drop trigger if exists user_progress_set_updated_at on public.user_progress;
create trigger user_progress_set_updated_at
before update on public.user_progress
for each row
execute function public.set_updated_at();

alter table public.event_rsvps enable row level security;
alter table public.saved_events enable row level security;
alter table public.dismissed_events enable row level security;
alter table public.user_progress enable row level security;

drop policy if exists "Users can read their own RSVPs" on public.event_rsvps;
create policy "Users can read their own RSVPs"
on public.event_rsvps
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own RSVPs" on public.event_rsvps;
create policy "Users can insert their own RSVPs"
on public.event_rsvps
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own RSVPs" on public.event_rsvps;
create policy "Users can update their own RSVPs"
on public.event_rsvps
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own RSVPs" on public.event_rsvps;
create policy "Users can delete their own RSVPs"
on public.event_rsvps
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their own saved events" on public.saved_events;
create policy "Users can read their own saved events"
on public.saved_events
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own saved events" on public.saved_events;
create policy "Users can insert their own saved events"
on public.saved_events
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own saved events" on public.saved_events;
create policy "Users can delete their own saved events"
on public.saved_events
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their own dismissed events" on public.dismissed_events;
create policy "Users can read their own dismissed events"
on public.dismissed_events
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own dismissed events" on public.dismissed_events;
create policy "Users can insert their own dismissed events"
on public.dismissed_events
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own dismissed events" on public.dismissed_events;
create policy "Users can delete their own dismissed events"
on public.dismissed_events
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their own user progress" on public.user_progress;
create policy "Users can read their own user progress"
on public.user_progress
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own user progress" on public.user_progress;
create policy "Users can insert their own user progress"
on public.user_progress
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own user progress" on public.user_progress;
create policy "Users can update their own user progress"
on public.user_progress
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
