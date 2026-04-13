import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { EventCard } from '@/components/EventCard'
import type { Event } from '@/data/mockData'
import { useEventsQuery } from '@/hooks/useEvents'

const sectionConfig: Record<string, { title: string; description: string; filter: (e: Event) => boolean }> = {
  recommended: {
    title: 'Recommended For You',
    description: 'Events personalized based on your interests and college.',
    filter: (e) => !!e.whyRecommended,
  },
  'good-first-events': {
    title: 'Good First Events',
    description: 'Low-pressure events perfect for getting started at UCSD.',
    filter: (e) => e.confidenceTags.includes('Good First Event'),
  },
}

export default function SeeAll() {
  const { section } = useParams<{ section: string }>()
  const { data: events = [], isLoading, isError } = useEventsQuery()
  const config = section ? sectionConfig[section] : undefined

  if (!config) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto max-w-6xl px-4 py-8 pb-24 md:pb-8 text-center">
          <p className="text-muted-foreground">Section not found.</p>
          <Link to="/dashboard" className="text-primary hover:underline text-sm mt-2 inline-block">
            Back to dashboard
          </Link>
        </main>
      </>
    )
  }

  const filteredEvents = events.filter(config.filter)

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-6xl px-4 py-8 pb-24 md:pb-8">
        {/* Back */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{config.title}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading events...</p>
        ) : isError ? (
          <p className="text-sm text-destructive">We couldn&apos;t load this section right now.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && !isLoading && !isError && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No events found in this section.</p>
          </div>
        )}
      </main>
    </>
  )
}
