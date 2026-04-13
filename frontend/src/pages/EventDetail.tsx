import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  PartyPopper,
  Share2,
  Bookmark,
  CalendarPlus,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { Navbar } from '@/components/Navbar'
import { ConfidenceTag } from '@/components/ConfidenceTag'
import { Button } from '@/components/ui/button'
import { useProgress } from '@/contexts/ProgressContext'
import { useEventQuery } from '@/hooks/useEvents'
import { generateICS, getGoogleCalendarUrl } from '@/lib/calendar-export'
import { cn } from '@/lib/utils'

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const eventDate = new Date(dateStr)
  eventDate.setHours(0, 0, 0, 0)
  return Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: event, isLoading, isError } = useEventQuery(id)
  const { getRsvpStatus, setRsvpStatus, savedEvents, toggleSave } = useProgress()
  const [confirming, setConfirming] = useState(false)

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading event details...</p>
        </main>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">We couldn&apos;t load this event right now.</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/events">Back to Events</Link>
          </Button>
        </main>
      </>
    )
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">Event not found.</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/events">Back to Events</Link>
          </Button>
        </main>
      </>
    )
  }

  // Capture in a non-nullable const so closures don't see Event | undefined
  const ev = event
  const status = getRsvpStatus(ev.id)
  const isGoing = status === 'going'
  const isPending = status === 'pending'
  const isMaybe = status === 'maybe'
  const isNotGoing = status === 'not-going'
  const isSaved = savedEvents.includes(ev.id)
  const days = daysUntil(ev.date)

  function handleGoing() {
    setRsvpStatus(ev.id, 'pending')
    window.open('https://forms.gle/example-rsvp-form', '_blank')
    toast.info('RSVP form opened in a new tab — come back here and confirm once you\'ve submitted.')
  }

  function handleMaybe() {
    setRsvpStatus(ev.id, 'maybe')
    toast.success('Saved to your bookmarks')
  }

  function handleCantGo() {
    setRsvpStatus(ev.id, 'not-going')
    toast('No worries, removed from your list')
  }

  function handleConfirmRsvp() {
    setConfirming(true)
    setTimeout(() => {
      setRsvpStatus(ev.id, 'going')
      setConfirming(false)
      toast.success("You're going! Check your calendar for details.")
    }, 600)
  }

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: ev.title, url })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    }
  }

  const attendeeCount = ev.rsvpCount + (isGoing || isPending ? 1 : 0)

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-3xl px-4 py-8 pb-48 md:pb-24">
        {/* Back */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </Link>

        {/* Accent line */}
        <div className="h-[3px] w-full rounded-full bg-gradient-to-r from-primary to-primary/60 mb-6" />

        {/* Tags row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-foreground">
            {ev.category}
          </span>
          {ev.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{ev.title}</h1>
        <p className="text-muted-foreground mb-4">by {ev.organizer}</p>

        {/* Confidence tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ev.confidenceTags.map((tag) => (
            <ConfidenceTag key={tag} tag={tag} />
          ))}
        </div>

        {/* Why recommended */}
        {ev.whyRecommended && (
          <div className="rounded-2xl bg-teal-light border border-primary/10 p-4 mb-6">
            <p className="text-sm font-semibold text-primary mb-1">Why this is good for you</p>
            <p className="text-sm text-foreground leading-relaxed">{ev.whyRecommended}</p>
          </div>
        )}

        {/* Event details */}
        <div className="flex flex-col gap-3 mb-6 text-sm">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <span className="text-foreground">{formatDate(ev.date)}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{ev.time}</span>
            {days >= 0 && (
              <span className="ml-auto rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium shrink-0">
                {days === 0 ? 'Today' : `In ${days} day${days === 1 ? '' : 's'}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <span className="text-foreground">{ev.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <span className="text-foreground">{attendeeCount} people going</span>
          </div>
        </div>

        {/* About */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">About this event</h2>
          <p className="text-muted-foreground leading-relaxed">{ev.description}</p>
        </div>

        {/* Pending RSVP banner */}
        {isPending && (
          <div className="rounded-2xl bg-accent/20 border border-accent/30 p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
              <h3 className="font-semibold text-foreground">Pending RSVP</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Did you submit the RSVP form? Confirm below once you've filled it out.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={handleConfirmRsvp}
                disabled={confirming}
                className="rounded-xl"
              >
                {confirming ? 'Confirming...' : 'I submitted the form'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-1"
                asChild
              >
                <a href="https://forms.gle/example-rsvp-form" target="_blank" rel="noopener noreferrer">
                  Open form again
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Going banner */}
        {isGoing && (
          <div className="rounded-2xl bg-teal-light border border-primary/10 p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <PartyPopper className="h-4 w-4 text-primary" aria-hidden="true" />
              <h3 className="font-semibold text-foreground">You're going!</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Add this event to your calendar so you don't miss it.</p>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-1"
                asChild
              >
                <a
                  href={getGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CalendarPlus className="h-3.5 w-3.5" />
                  Google Calendar
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-1"
                onClick={() => generateICS(event)}
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                Download .ics
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Sticky RSVP Bar */}
      <div className="fixed bottom-16 md:bottom-4 left-0 right-0 z-30 px-4 pointer-events-none">
        <div className="mx-auto max-w-3xl pointer-events-auto">
          <div className="bg-card/95 backdrop-blur-lg border rounded-2xl shadow-elevated p-4">
            {isNotGoing ? (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">You declined this ev.</p>
                <button
                  onClick={() => setRsvpStatus(ev.id, 'maybe')}
                  className="text-sm text-primary hover:underline"
                >
                  Changed your mind?
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <Button
                    onClick={handleGoing}
                    className={cn(
                      'flex-1 rounded-xl',
                      (isGoing || isPending) && 'bg-teal-light text-primary border border-primary/20 hover:bg-teal-light/80',
                    )}
                    variant={isGoing || isPending ? 'outline' : 'default'}
                  >
                    {isGoing ? 'Going' : isPending ? 'Pending...' : 'Going'}
                  </Button>
                  <Button
                    onClick={handleMaybe}
                    variant="outline"
                    className={cn(
                      'flex-1 rounded-xl',
                      isMaybe && 'bg-accent/20 border-accent/30 text-accent-foreground',
                    )}
                  >
                    Maybe
                  </Button>
                  <Button
                    onClick={handleCantGo}
                    variant="ghost"
                    className="flex-1 rounded-xl text-muted-foreground"
                  >
                    Can't Go
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <button
                    onClick={() => toggleSave(ev.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 text-xs transition-colors',
                      isSaved ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <Bookmark
                      className="h-3.5 w-3.5"
                      fill={isSaved ? 'currentColor' : 'none'}
                      aria-hidden="true"
                    />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Share
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
