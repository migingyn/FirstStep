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

  return {
    rsvpedEvents: Object.entries(rsvpStatuses)
      .filter(([, status]) => status === 'going')
      .map(([eventId]) => eventId),
    rsvpStatuses,
    savedEvents: dedupe(((saved ?? []) as SavedEventRecord[]).map((record) => record.event_id)),
    dismissedEvents: dedupe(
      ((dismissed ?? []) as DismissedEventRecord[]).map((record) => record.event_id),
    ),
    mapVisited: Boolean((userProgress as UserProgressRecord | null)?.map_visited),
  }
}
