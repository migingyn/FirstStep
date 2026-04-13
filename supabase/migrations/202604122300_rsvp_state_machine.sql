create or replace function public.apply_event_rsvp_status(
  p_event_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_status not in ('pending', 'going', 'maybe', 'not-going') then
    raise exception 'Unsupported RSVP status: %', p_status;
  end if;

  insert into public.event_rsvps (
    user_id,
    event_id,
    status
  )
  values (
    current_user_id,
    p_event_id,
    p_status
  )
  on conflict (user_id, event_id) do update
  set
    status = excluded.status,
    updated_at = timezone('utc', now());

  if p_status in ('pending', 'going', 'maybe') then
    insert into public.saved_events (
      user_id,
      event_id
    )
    values (
      current_user_id,
      p_event_id
    )
    on conflict (user_id, event_id) do nothing;
  end if;

  if p_status in ('pending', 'going', 'maybe') then
    delete from public.dismissed_events
    where user_id = current_user_id
      and event_id = p_event_id;
  end if;

  if p_status = 'not-going' then
    delete from public.saved_events
    where user_id = current_user_id
      and event_id = p_event_id;

    insert into public.dismissed_events (
      user_id,
      event_id
    )
    values (
      current_user_id,
      p_event_id
    )
    on conflict (user_id, event_id) do nothing;
  end if;
end;
$$;
