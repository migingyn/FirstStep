import { useQuery } from '@tanstack/react-query'
import { getEventById, getEvents } from '@/lib/events'

export function useEventsQuery() {
  return useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })
}

export function useEventQuery(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEventById(eventId ?? ''),
    enabled: Boolean(eventId),
  })
}
