create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  abbreviation text not null,
  description text not null,
  website text null,
  instagram text null,
  category text not null default 'General',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists clubs_set_updated_at on public.clubs;
create trigger clubs_set_updated_at
before update on public.clubs
for each row
execute function public.set_updated_at();

alter table public.clubs enable row level security;

drop policy if exists "Clubs are readable by authenticated users" on public.clubs;
create policy "Clubs are readable by authenticated users"
on public.clubs
for select
using (auth.role() = 'authenticated');
