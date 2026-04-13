import { useState } from 'react'
import { ChevronLeft, ChevronRight, Bookmark, CalendarCheck, Clock } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { useProgress } from '@/contexts/ProgressContext'
import { useEventsQuery } from '@/hooks/useEvents'
import { cn } from '@/lib/utils'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getCalendarDays(year: number, month: number): Date[] {
  const firstDayOfMonth = new Date(year, month, 1)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const days: Date[] = []
  const startDay = 1 - firstDayOfWeek
  for (let i = 0; i < 42; i++) {
    days.push(new Date(year, month, startDay + i))
  }
  return days
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function eventDotColor(category: string): string {
  if (category === 'Career') return 'bg-primary'
  if (category === 'Academic') return 'bg-purple-400'
  return 'bg-confidence-green'
}

const CATEGORY_FILTERS = ['All', 'Social', 'Career', 'Academic']

export default function CalendarPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const { savedEvents, rsvpStatuses, toggleSave } = useProgress()
  const { data: events = [] } = useEventsQuery()

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const days = getCalendarDays(year, month)

  // Events that are relevant (saved or rsvp'd)
  const relevantEvents = events.filter(
    (e) =>
      savedEvents.includes(e.id) ||
      ['going', 'pending', 'maybe'].includes(rsvpStatuses[e.id] ?? ''),
  )

  // Events on a specific day
  function eventsOnDay(d: Date) {
    return relevantEvents.filter((e) => {
      const eventDate = new Date(e.date + 'T12:00:00')
      return sameDay(eventDate, d)
    })
  }

  // Agenda events
  const agendaEvents = (() => {
    if (selectedDate) {
      return relevantEvents.filter((e) => {
        const eventDate = new Date(e.date + 'T12:00:00')
        return sameDay(eventDate, selectedDate)
      })
    }
    // Next 7 days
    const end = new Date(today)
    end.setDate(end.getDate() + 7)
    return relevantEvents.filter((e) => {
      const eventDate = new Date(e.date + 'T12:00:00')
      return eventDate >= today && eventDate <= end
    })
  })()

  const filteredAgenda = agendaEvents.filter(
    (e) => categoryFilter === 'All' || e.category === categoryFilter,
  )

  function prevMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
    setSelectedDate(null)
  }

  function nextMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
    setSelectedDate(null)
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-8 pb-24 md:pb-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">My Calendar</h1>
          <p className="text-muted-foreground">Your saved &amp; RSVP'd events</p>
        </div>

        {/* Month Calendar */}
        <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <button
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-secondary transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="font-semibold text-foreground">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-secondary transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border/50">
            {DAYS.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const isCurrentMonth = day.getMonth() === month
              const isToday = sameDay(day, today)
              const isSelected = selectedDate ? sameDay(day, selectedDate) : false
              const dayEvents = eventsOnDay(day)
              const hasEvents = dayEvents.length > 0

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (hasEvents) {
                      setSelectedDate(isSelected ? null : day)
                    }
                  }}
                  disabled={!hasEvents && !isCurrentMonth}
                  className={cn(
                    'flex flex-col items-center py-2 px-1 min-h-[3rem] transition-colors',
                    !isCurrentMonth && 'opacity-30',
                    hasEvents && 'cursor-pointer hover:bg-secondary/50',
                    !hasEvents && isCurrentMonth && 'cursor-default',
                  )}
                  aria-label={`${day.toLocaleDateString()}${hasEvents ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors',
                      isToday && 'bg-primary text-primary-foreground font-semibold',
                      isSelected && !isToday && 'bg-foreground text-background font-semibold',
                      !isToday && !isSelected && 'text-foreground',
                    )}
                  >
                    {day.getDate()}
                  </span>
                  {/* Event dots */}
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((e, di) => (
                        <div
                          key={di}
                          className={cn('h-1 w-1 rounded-full', eventDotColor(e.category))}
                        />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORY_FILTERS.map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? 'pill-active' : 'pill'}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
              className="shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Agenda */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {selectedDate
              ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
              : 'Next 7 Days'}
          </h2>

          {filteredAgenda.length === 0 ? (
            <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
              <p className="mb-3">No events to show</p>
              {selectedDate && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedDate(null)}
                >
                  Clear date filter
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAgenda.map((event) => {
                const status = rsvpStatuses[event.id]
                const isSaved = savedEvents.includes(event.id)
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 rounded-2xl border bg-card shadow-card p-4"
                  >
                    {/* Accent bar */}
                    <div className={cn('w-1 self-stretch rounded-full shrink-0', eventDotColor(event.category))} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">{event.time}</p>
                          <h3 className="font-medium text-foreground text-sm">{event.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{event.location}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {status === 'going' && (
                            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                              <CalendarCheck className="h-3 w-3" />
                              Going
                            </span>
                          )}
                          {status === 'pending' && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-accent/30 text-accent-foreground">
                              <Clock className="h-3 w-3" />
                              Pending
                            </span>
                          )}
                          <button
                            onClick={() => toggleSave(event.id)}
                            aria-label={isSaved ? 'Remove bookmark' : 'Bookmark event'}
                            className={cn(
                              'transition-colors',
                              isSaved ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                            )}
                          >
                            <Bookmark
                              className="h-4 w-4"
                              fill={isSaved ? 'currentColor' : 'none'}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      <span className="mt-2 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                        {event.category}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
