import { supabase } from '@/lib/supabase'

export type RsvpStatus = 'going' | 'pending' | 'maybe' | 'not-going'

export interface ProgressState {
  rsvpedEvents: string[]
  rsvpStatuses: Record<string, RsvpStatus>
  savedEvents: string[]
  dismissedEvents: string[]
  mapVisited: boolean
}

interface EventRsvpRecord {
  event_id: string
  status: RsvpStatus
}

interface SavedEventRecord {
  event_id: string
}

interface DismissedEventRecord {
  event_id: string
}

interface UserProgressRecord {
  user_id: string
  map_visited: boolean
}

export function getEmptyProgressState(): ProgressState {
  return {
    rsvpedEvents: [],
    rsvpStatuses: {},
    savedEvents: [],
    dismissedEvents: [],
    mapVisited: false,
  }
}

export function hasProgressData(state: ProgressState) {
  return (
    state.rsvpedEvents.length > 0 ||
    Object.keys(state.rsvpStatuses).length > 0 ||
    state.savedEvents.length > 0 ||
    state.dismissedEvents.length > 0 ||
    state.mapVisited
  )
}

function dedupe(ids: string[]) {
  return Array.from(new Set(ids))
}

export function applyLocalRsvpTransition(
  currentState: ProgressState,
  eventId: string,
  status: RsvpStatus,
): ProgressState {
  const newStatuses = { ...currentState.rsvpStatuses, [eventId]: status }
  const newRsvped = Object.entries(newStatuses)
    .filter(([, currentStatus]) => currentStatus === 'going')
    .map(([currentEventId]) => currentEventId)

  let newSaved = [...currentState.savedEvents]
  let newDismissed = [...currentState.dismissedEvents]

  if (status === 'pending' || status === 'maybe' || status === 'going') {
    if (!newSaved.includes(eventId)) {
      newSaved.push(eventId)
    }
    newDismissed = newDismissed.filter((currentEventId) => currentEventId !== eventId)
  } else if (status === 'not-going') {
    newSaved = newSaved.filter((currentEventId) => currentEventId !== eventId)
    if (!newDismissed.includes(eventId)) {
      newDismissed.push(eventId)
    }
  }

  return {
    ...currentState,
    rsvpStatuses: newStatuses,
    rsvpedEvents: newRsvped,
    savedEvents: newSaved,
    dismissedEvents: newDismissed,
  }
}

export function applyLocalToggleSave(currentState: ProgressState, eventId: string): ProgressState {
  const isSaved = currentState.savedEvents.includes(eventId)

  return {
    ...currentState,
    savedEvents: isSaved
      ? currentState.savedEvents.filter((currentEventId) => currentEventId !== eventId)
      : [...currentState.savedEvents, eventId],
  }
}

export async function ensureUserProgress(userId: string) {
  const { error } = await supabase.from('user_progress').upsert(
    {
      user_id: userId,
      map_visited: false,
    },
    { onConflict: 'user_id' },
  )

  if (error) {
    throw error
  }
}

export async function fetchProgressState(userId: string): Promise<ProgressState> {
  await ensureUserProgress(userId)

  const [{ data: rsvps, error: rsvpError }, { data: saved, error: savedError }, { data: dismissed, error: dismissedError }, { data: userProgress, error: progressError }] =
    await Promise.all([
      supabase.from('event_rsvps').select('event_id, status').eq('user_id', userId),
      supabase.from('saved_events').select('event_id').eq('user_id', userId),
      supabase.from('dismissed_events').select('event_id').eq('user_id', userId),
      supabase.from('user_progress').select('user_id, map_visited').eq('user_id', userId).maybeSingle(),
    ])

  if (rsvpError) {
    throw rsvpError
  }

  if (savedError) {
    throw savedError
  }

  if (dismissedError) {
    throw dismissedError
  }

  if (progressError) {
    throw progressError
  }

  const rsvpStatuses = Object.fromEntries(
    ((rsvps ?? []) as EventRsvpRecord[]).map((record) => [record.event_id, record.status]),
  ) as Record<string, RsvpStatus>
  const savedIds = dedupe(((saved ?? []) as SavedEventRecord[]).map((record) => record.event_id))
  const derivedSavedIds = dedupe([
    ...savedIds,
    ...Object.entries(rsvpStatuses)
      .filter(([, status]) => status === 'pending' || status === 'maybe')
      .map(([eventId]) => eventId),
  ])

  return {
    rsvpedEvents: Object.entries(rsvpStatuses)
      .filter(([, status]) => status === 'going')
      .map(([eventId]) => eventId),
    rsvpStatuses,
    savedEvents: derivedSavedIds,
    dismissedEvents: dedupe(
      ((dismissed ?? []) as DismissedEventRecord[]).map((record) => record.event_id),
    ),
    mapVisited: Boolean((userProgress as UserProgressRecord | null)?.map_visited),
  }
}

export async function applyEventRsvpStatus(eventId: string, status: RsvpStatus) {
  const { error } = await supabase.rpc('apply_event_rsvp_status', {
    p_event_id: eventId,
    p_status: status,
  })

  if (error) {
    throw error
  }
}

export async function persistSavedEvent(userId: string, eventId: string, shouldSave: boolean) {
  if (shouldSave) {
    const { error } = await supabase
      .from('saved_events')
      .upsert({ user_id: userId, event_id: eventId }, { onConflict: 'user_id,event_id' })

    if (error) {
      throw error
    }

    return
  }

  const { error } = await supabase
    .from('saved_events')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId)

  if (error) {
    throw error
  }
}

export async function persistMapVisited(userId: string) {
  const { error } = await supabase
    .from('user_progress')
    .update({
      map_visited: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    throw error
  }
}
