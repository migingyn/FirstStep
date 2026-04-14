import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight, MapPin, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { UCSDCampusMap } from '@/components/map/UCSDCampusMap'
import { Navbar } from '@/components/Navbar'
import { Input } from '@/components/ui/input'
import { useResolvedEventLocations } from '@/hooks/useResolvedEventLocations'
import { useProgress } from '@/contexts/ProgressContext'
import { useEventsQuery } from '@/hooks/useEvents'
import type { ArcGISMapRuntime } from '@/lib/arcgis'
import { getResolvedBuildingText } from '@/lib/locationResolver'
import { cn } from '@/lib/utils'

export default function MapPage() {
  const { markMapVisited } = useProgress()
  const { data: events = [], isLoading, isError } = useEventsQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const [panelOpen, setPanelOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')
  const [runtime, setRuntime] = useState<ArcGISMapRuntime | null>(null)
  const selectedEventId = searchParams.get('event')

  useEffect(() => {
    void markMapVisited().catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to save map progress right now.')
    })
  }, [markMapVisited])

  useEffect(() => {
    setSearchQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const { resolvedById } = useResolvedEventLocations(events, { mapRuntime: runtime })

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return events.filter((event) => {
      if (!query) {
        return true
      }

      const resolved = resolvedById[event.id]
      return [
        event.title,
        event.location,
        event.organizer,
        resolved?.displayName,
        resolved?.buildingName,
        resolved?.helperText,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    })
  }, [events, resolvedById, searchQuery])

  const selectedEvent =
    events.find((event) => event.id === selectedEventId) ??
    filteredEvents[0] ??
    null

  const selectedLocation = selectedEvent ? resolvedById[selectedEvent.id] ?? null : null

  function updateSearchParams(nextEventId: string | null, nextQuery = searchQuery) {
    const next = new URLSearchParams(searchParams)

    if (nextEventId) {
      next.set('event', nextEventId)
    } else {
      next.delete('event')
    }

    if (nextQuery.trim()) {
      next.set('q', nextQuery.trim())
    } else {
      next.delete('q')
    }

    setSearchParams(next, { replace: true })
  }

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        {panelOpen && (
          <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-r border-border/50 bg-card lg:w-[26rem]">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-4">
              <div>
                <h2 className="font-semibold text-foreground">Campus Map</h2>
                <p className="text-xs text-muted-foreground">
                  {filteredEvents.length} event{filteredEvents.length === 1 ? '' : 's'} with map context
                </p>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary md:hidden"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="border-b border-border/50 px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder="Search by event, organizer, or building..."
                  className="h-10 rounded-xl pl-10"
                  value={searchQuery}
                  onChange={(event) => {
                    const nextQuery = event.target.value
                    setSearchQuery(nextQuery)
                    updateSearchParams(selectedEventId, nextQuery)
                  }}
                />
              </div>
              {import.meta.env.DEV && runtime?.layerSummaries.length ? (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  ArcGIS layers: {runtime.layerSummaries.map((layer) => layer.title).join(', ')}
                </p>
              ) : null}
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-8 text-sm text-muted-foreground">Loading event locations...</div>
              ) : isError ? (
                <div className="px-4 py-8 text-sm text-destructive">
                  We couldn&apos;t load event locations right now.
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="px-4 py-8 text-sm text-muted-foreground">
                  No events matched that search yet.
                </div>
              ) : (
                filteredEvents.map((event) => {
                  const resolved = resolvedById[event.id]
                  const isActive = selectedEvent?.id === event.id

                  return (
                    <button
                      key={event.id}
                      onClick={() => updateSearchParams(event.id)}
                      className={cn(
                        'w-full border-b border-border/40 px-4 py-4 text-left transition-colors hover:bg-secondary/40',
                        isActive && 'bg-primary/5',
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary',
                        )}>
                          <MapPin className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-foreground">{event.title}</p>
                            <ChevronRight
                              className={cn(
                                'mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                                isActive && 'rotate-90',
                              )}
                              aria-hidden="true"
                            />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{event.organizer}</p>
                          <p className="mt-2 text-xs text-foreground">
                            {resolved ? getResolvedBuildingText(resolved) : event.location}
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {resolved?.helperText ?? 'Matching campus location...'}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="rounded-full bg-secondary px-2 py-0.5">
                              {resolved?.source ?? 'resolving'}
                            </span>
                            {resolved ? (
                              <span>{Math.round(resolved.confidence * 100)}% confidence</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </aside>
        )}

        <div className="relative flex-1 overflow-hidden bg-warm-white p-4">
          {!panelOpen && (
            <button
              onClick={() => setPanelOpen(true)}
              className="absolute left-8 top-8 z-20 inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2 text-sm font-medium shadow-card"
            >
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              Open list
            </button>
          )}

          <div className="absolute right-8 top-8 z-20 rounded-full border border-border/60 bg-card/85 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            UCSD ArcGIS campus map
          </div>

          <UCSDCampusMap
            className="h-full"
            selectedLocation={selectedLocation}
            onRuntimeReady={setRuntime}
          />

          {selectedEvent && selectedLocation ? (
            <div className="pointer-events-none absolute bottom-8 left-8 right-8 z-20 md:right-auto md:max-w-sm">
              <div className="pointer-events-auto rounded-2xl border border-border/60 bg-card/95 p-4 shadow-elevated backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Where to go</p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{selectedEvent.title}</h3>
                <p className="mt-2 text-sm text-foreground">
                  {selectedLocation.confidence >= 0.75
                    ? `This event is at ${getResolvedBuildingText(selectedLocation)}.`
                    : 'We matched this event location approximately.'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedLocation.helperText ??
                    'Use the highlighted marker to orient yourself before heading across campus.'}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-secondary px-2 py-1">
                    {selectedLocation.source}
                  </span>
                  <span>{Math.round(selectedLocation.confidence * 100)}% confidence</span>
                </div>
                <ButtonRow eventId={selectedEvent.id} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

function ButtonRow({ eventId }: { eventId: string }) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <Link to={`/events/${eventId}`} className="text-sm font-medium text-primary hover:underline">
        Back to event details
      </Link>
      <span className="text-xs text-muted-foreground">One destination highlighted at a time</span>
    </div>
  )
}
