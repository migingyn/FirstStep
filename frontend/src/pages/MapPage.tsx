import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Search, ChevronRight, X } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Input } from '@/components/ui/input'
import { useProgress } from '@/contexts/ProgressContext'
import { useEventsQuery } from '@/hooks/useEvents'
import { cn } from '@/lib/utils'

const locationData = [
  { name: 'Price Center East Ballroom', x: 42, y: 38 },
  { name: 'Career Services Center, Room 210', x: 35, y: 52 },
  { name: 'Scripps Pier Lawn', x: 78, y: 72 },
  { name: 'Student Center, Gaming Lounge', x: 45, y: 42 },
  { name: 'CSE Building, Room 1202', x: 55, y: 30 },
  { name: 'Library Walk', x: 48, y: 45 },
  { name: 'Sixth College Living Room', x: 62, y: 25 },
  { name: 'The Basement (Entrepreneurship Center)', x: 40, y: 55 },
]

export default function MapPage() {
  const { markMapVisited } = useProgress()
  const { data: events = [] } = useEventsQuery()
  const [activeLocation, setActiveLocation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [panelOpen, setPanelOpen] = useState(true)

  useEffect(() => {
    markMapVisited()
  }, [markMapVisited])

  const filteredLocations = locationData.filter((loc) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    if (loc.name.toLowerCase().includes(q)) return true
    return events.some((event) => {
      if (event.location !== loc.name) {
        return false
      }

      return (
        event.title.toLowerCase().includes(q) ||
        event.category.toLowerCase().includes(q) ||
        event.organizer.toLowerCase().includes(q)
      )
    })
  })

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">

        {/* Left Panel */}
        {panelOpen && (
          <div className="w-80 lg:w-96 shrink-0 border-r border-border/50 bg-card flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border/50">
              <div>
                <h2 className="font-semibold text-foreground">Campus Map</h2>
                <p className="text-xs text-muted-foreground">{locationData.length} locations</p>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg hover:bg-secondary transition-colors"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative px-4 py-3 border-b border-border/50">
              <Search
                className="absolute left-7 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search locations..."
                className="pl-9 h-9 text-sm rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Location list */}
            <div className="flex-1 overflow-y-auto">
              {filteredLocations.map((loc) => {
                const isActive = activeLocation === loc.name
                const locationEvents = events.filter((event) => event.location === loc.name)

                return (
                  <div key={loc.name}>
                    <button
                      onClick={() => setActiveLocation(isActive ? null : loc.name)}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border/30',
                        'hover:bg-secondary/50',
                        isActive && 'bg-primary/5 border-l-2 border-l-primary',
                      )}
                      aria-expanded={isActive}
                    >
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{loc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {locationEvents.length} event{locationEvents.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0',
                          isActive && 'rotate-90',
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    {/* Expanded events */}
                    {isActive && (
                      <div className="bg-secondary/30 px-4 py-2 border-b border-border/30">
                        {locationEvents.map((event) =>
                          event ? (
                            <Link
                              key={event.id}
                              to={`/events/${event.id}`}
                              className="flex items-start gap-2 py-2 hover:text-primary transition-colors group"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                                  {event.title}
                                </p>
                                <p className="text-[11px] text-muted-foreground">{event.time} · {event.date}</p>
                              </div>
                            </Link>
                          ) : null,
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden bg-warm-white">
          {/* Grid pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, hsl(204 100% 32% / 0.04) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Toggle panel button */}
          {!panelOpen && (
            <button
              onClick={() => setPanelOpen(true)}
              className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm font-medium shadow-card hover:shadow-card-hover transition-shadow"
            >
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              Locations
            </button>
          )}

          {/* UCSD Campus label */}
          <div className="absolute top-4 right-4 z-10">
            <span className="text-xs font-medium text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
              UCSD Campus
            </span>
          </div>

          {/* Decorative campus buildings */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute rounded-xl bg-primary/5 border border-primary/10" style={{ left: '25%', top: '20%', width: '18%', height: '12%' }} />
            <div className="absolute rounded-xl bg-secondary border border-border/50" style={{ left: '50%', top: '35%', width: '22%', height: '15%' }} />
            <div className="absolute rounded-xl bg-primary/5 border border-primary/10" style={{ left: '60%', top: '55%', width: '16%', height: '10%' }} />
            <div className="absolute rounded-xl bg-secondary border border-border/50" style={{ left: '30%', top: '65%', width: '20%', height: '8%' }} />
          </div>

          {/* Location pins */}
          {locationData.map((loc) => {
            const isActive = activeLocation === loc.name
            return (
              <button
                key={loc.name}
                onClick={() => setActiveLocation(isActive ? null : loc.name)}
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
                aria-label={loc.name}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm shadow-md transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground scale-125 shadow-elevated'
                      : 'bg-card border-2 border-primary text-primary hover:scale-110 hover:shadow-card-hover',
                  )}
                >
                  {events.filter((event) => event.location === loc.name).length}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                  <div className="whitespace-nowrap bg-foreground text-background text-xs px-2.5 py-1.5 rounded-lg shadow-elevated max-w-[180px] text-center leading-tight">
                    {loc.name}
                  </div>
                </div>
              </button>
            )
          })}

          {/* Center prompt */}
          {!activeLocation && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" aria-hidden="true" />
                <p className="text-sm font-medium">Click a pin or location to see events</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
