import { Link } from 'react-router-dom'
import {
  CalendarCheck,
  Bookmark,
  Map as MapIcon,
  CheckCircle2,
  Circle,
  ArrowRight,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { EventCard } from '@/components/EventCard'
import { Button } from '@/components/ui/button'
import { useProgress } from '@/contexts/ProgressContext'
import { useEventsQuery } from '@/hooks/useEvents'
import { cn } from '@/lib/utils'

export default function Dashboard() {
  const { hasAttendedFirst, savedCount, mapVisited } = useProgress()
  const { data: events = [], isLoading, isError } = useEventsQuery()

  const tasks = [
    {
      title: 'Attend Your First Event',
      description: 'RSVP to an event and mark it as going',
      done: hasAttendedFirst,
      icon: CalendarCheck,
      link: '/events',
      action: 'Find Events',
    },
    {
      title: 'Save 3 Events You Like',
      description: `Bookmark events for later — ${Math.min(savedCount, 3)}/3 saved`,
      done: savedCount >= 3,
      icon: Bookmark,
      link: '/events',
      action: `${Math.min(savedCount, 3)}/3 saved`,
    },
    {
      title: 'Explore the Campus Map',
      description: 'See where events happen around campus',
      done: mapVisited,
      icon: MapIcon,
      link: '/map',
      action: 'Open Map',
    },
  ]

  const completedCount = tasks.filter((t) => t.done).length
  const allDone = completedCount === tasks.length
  const recommended = events.filter((event) => event.whyRecommended).slice(0, 4)
  const goodFirst = events.filter((event) => event.confidenceTags.includes('Good First Event'))

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-6xl px-4 py-8 pb-24 md:pb-8 space-y-10">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to UCSD</h1>
          <p className="text-muted-foreground">
            Here's your personalized guide to getting involved this week.
          </p>
        </div>

        {/* Start Here — hidden when all done */}
        {!allDone && (
          <section aria-labelledby="start-here-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="start-here-heading" className="text-lg font-semibold text-foreground">
                Start Here This Week
              </h2>
              <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                {completedCount}/{tasks.length} complete
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-secondary mb-6 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <div
                  key={task.title}
                  className={cn(
                    'rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-200',
                    task.done
                      ? 'border-primary/30 bg-teal-light'
                      : 'border-border/50 bg-card shadow-card',
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        task.done ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground',
                      )}
                    >
                      <task.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    {task.done ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/40" aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{task.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                  </div>
                  {task.done ? (
                    <span className="inline-flex items-center text-xs font-semibold text-primary">
                      Done
                    </span>
                  ) : (
                    <Button asChild variant="outline" size="sm" className="rounded-full self-start">
                      <Link to={task.link}>
                        {task.action}
                        <ArrowRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended */}
        <section aria-labelledby="recommended-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="recommended-heading" className="text-lg font-semibold text-foreground">
              Recommended For You
            </h2>
            <Link
              to="/see-all/recommended"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              See all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading events...</p>
          ) : isError ? (
            <p className="text-sm text-destructive">We couldn&apos;t load recommended events right now.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommended.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Good First Events */}
        <section aria-labelledby="good-first-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="good-first-heading" className="text-lg font-semibold text-foreground">
              Good First Events
            </h2>
            <Link
              to="/see-all/good-first-events"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              See all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading events...</p>
          ) : isError ? (
            <p className="text-sm text-destructive">We couldn&apos;t load good first events right now.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {goodFirst.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
