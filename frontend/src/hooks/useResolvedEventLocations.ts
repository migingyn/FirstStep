import { useEffect, useMemo, useState } from 'react'
import type { Event } from '@/data/mockData'
import type { ArcGISMapRuntime } from '@/lib/arcgis'
import { resolveLocation, type ResolvedLocation } from '@/lib/locationResolver'

interface UseResolvedEventLocationsOptions {
  mapRuntime?: ArcGISMapRuntime | null
}

export function useResolvedEventLocation(
  event: Event | null | undefined,
  options: UseResolvedEventLocationsOptions = {},
) {
  const [location, setLocation] = useState<ResolvedLocation | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!event) {
      setLocation(null)
      setIsLoading(false)
      return () => {
        cancelled = true
      }
    }

    setIsLoading(true)
    void resolveLocation(event.location, { mapRuntime: options.mapRuntime })
      .then((result) => {
        if (!cancelled) {
          setLocation(result)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [event, options.mapRuntime])

  return { location, isLoading }
}

export function useResolvedEventLocations(
  events: Event[],
  options: UseResolvedEventLocationsOptions = {},
) {
  const [resolvedById, setResolvedById] = useState<Record<string, ResolvedLocation>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!events.length) {
      setResolvedById({})
      setIsLoading(false)
      return () => {
        cancelled = true
      }
    }

    setIsLoading(true)
    void Promise.all(
      events.map(async (event) => [event.id, await resolveLocation(event.location, { mapRuntime: options.mapRuntime })] as const),
    )
      .then((entries) => {
        if (cancelled) {
          return
        }

        setResolvedById(Object.fromEntries(entries))
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [events, options.mapRuntime])

  const resolvedEvents = useMemo(
    () =>
      events.map((event) => ({
        event,
        resolvedLocation: resolvedById[event.id] ?? null,
      })),
    [events, resolvedById],
  )

  return { resolvedById, resolvedEvents, isLoading }
}

