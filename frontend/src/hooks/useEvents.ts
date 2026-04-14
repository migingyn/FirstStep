import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { getEventById, getEvents } from '@/lib/events'
import type { Event } from '@/data/mockData'

export function useEventsQuery() {
  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: () => getEvents(),
  })
}

export function usePaginatedEvents(pageSize: number = 12) {
  return useInfiniteQuery<Event[]>({
    queryKey: ['events', 'paginated', pageSize],
    queryFn: ({ pageParam = 0 }) => getEvents(pageSize, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than pageSize, we've reached the end
      if (lastPage.length < pageSize) {
        return undefined
      }
      // Otherwise, return the offset for the next page
      return allPages.length * pageSize
    },
    initialPageParam: 0,
  })
}

export function useEventQuery(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEventById(eventId ?? ''),
    enabled: Boolean(eventId),
  })
}
