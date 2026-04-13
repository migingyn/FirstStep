import type { Event } from '@/data/mockData'
import { supabase } from '@/lib/supabase'

interface EventRecord {
  id: string
  title: string
  summary: string
  description: string
  event_date: string
  start_time: string
  end_time: string | null
  location: string
  category: string
  tags: string[]
  confidence_tags: string[]
  organizer: string
  image_url: string | null
  why_recommended: string | null
  external_rsvp_url: string | null
  rsvp_count: number
}

function formatEventTime(startTime: string, endTime: string | null) {
  return endTime ? `${startTime} – ${endTime}` : startTime
}

export function mapEventRecord(record: EventRecord): Event {
  return {
    id: record.id,
    title: record.title,
    summary: record.summary,
    description: record.description,
    date: record.event_date,
    time: formatEventTime(record.start_time, record.end_time),
    location: record.location,
    category: record.category,
    tags: record.tags,
    confidenceTags: record.confidence_tags,
    imageUrl: record.image_url ?? '',
    rsvpCount: record.rsvp_count,
    organizer: record.organizer,
    whyRecommended: record.why_recommended ?? undefined,
    externalRsvpUrl: record.external_rsvp_url,
  }
}

export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map(mapEventRecord)
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const { data, error } = await supabase.from('events').select('*').eq('id', eventId).maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapEventRecord(data) : null
}
