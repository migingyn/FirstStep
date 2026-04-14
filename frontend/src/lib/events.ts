import { mockEvents, type Event } from '@/data/mockData'
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

export async function getEvents(limit?: number, offset?: number): Promise<Event[]> {
  let query = supabase
    .from('events')
    .select(`
      *,
      event_rsvp_data (
        rsvp_url,
        rsvp_type,
        cost,
        notes,
        source_url
      )
    `, { count: 'exact' })
    .order('event_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (limit) {
    query = query.limit(limit)
  }

  if (offset) {
    query = query.range(offset, offset + (limit || 50) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.warn('Falling back to bundled mock events because Supabase events could not be loaded.', error)
    return mockEvents
  }

  if (!data?.length) {
    console.warn('Supabase returned no events. Falling back to bundled mock events.')
    return mockEvents
  }

  return data.map(record => {
    const event = mapEventRecord(record)
    if (record.event_rsvp_data && record.event_rsvp_data.length > 0) {
      const rsvp = record.event_rsvp_data[0]
      event.rsvpData = {
        rsvpUrl: rsvp.rsvp_url,
        rsvpType: rsvp.rsvp_type,
        cost: rsvp.cost,
        notes: rsvp.notes,
        sourceUrl: rsvp.source_url,
      }
    }
    return event
  })
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const { data, error } = await supabase.from('events').select('*').eq('id', eventId).maybeSingle()

  if (error) {
    console.warn(`Falling back to bundled mock event for ${eventId}.`, error)
    return mockEvents.find((event) => event.id === eventId) ?? null
  }

  if (!data) {
    return mockEvents.find((event) => event.id === eventId) ?? null
  }

  return mapEventRecord(data)
}
