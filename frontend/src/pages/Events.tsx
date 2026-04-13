import { useState } from 'react'
import { Search } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { EventCard } from '@/components/EventCard'
import { CategoryPills } from '@/components/CategoryPills'
import { Input } from '@/components/ui/input'
import { useEventsQuery } from '@/hooks/useEvents'

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { data: events = [], isLoading, isError } = useEventsQuery()

  const filtered = events.filter((event) => {
    const matchesCategory =
      selectedCategory === 'All' || event.category === selectedCategory
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !searchQuery ||
      event.title.toLowerCase().includes(q) ||
      event.description.toLowerCase().includes(q) ||
      event.organizer.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-6xl px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">Discover Events</h1>
          <p className="text-muted-foreground">Find your people at UCSD</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search events, clubs, or topics..."
            className="pl-11 rounded-full h-11 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search events"
          />
        </div>

        {/* Category filters */}
        <div className="mb-6">
          <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Results count */}
        <div className="mb-4">
          <span
            aria-live="polite"
            className="text-sm text-muted-foreground"
          >
            {filtered.length} {filtered.length === 1 ? 'event' : 'events'} found
          </span>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="font-semibold text-foreground mb-1">Loading events</h3>
            <p className="text-sm text-muted-foreground">Fetching the latest event list from Supabase.</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="font-semibold text-foreground mb-1">Unable to load events</h3>
            <p className="text-sm text-muted-foreground">Please try again in a moment.</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-10 w-10 text-muted-foreground/40 mb-4" aria-hidden="true" />
            <h3 className="font-semibold text-foreground mb-1">No events found</h3>
            <p className="text-sm text-muted-foreground">
              Try a different search term or select a different category.
            </p>
          </div>
        )}
      </main>
    </>
  )
}
