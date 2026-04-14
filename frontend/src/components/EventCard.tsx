import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, Bookmark } from 'lucide-react'
import { toast } from 'sonner'
import { ConfidenceTag } from '@/components/ConfidenceTag'
import { useProgress } from '@/contexts/ProgressContext'
import { cn } from '@/lib/utils'
import type { Event } from '@/data/mockData'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate()
  const { savedEvents, toggleSave } = useProgress()
  const isSaved = savedEvents.includes(event.id)

  function handleClick() {
    navigate(`/events/${event.id}`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleClick()
  }

  async function handleBookmark(e: React.MouseEvent) {
    e.stopPropagation()
    try {
      await toggleSave(event.id)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update saved events right now.')
    }
  }

  function handleViewMap(e: React.MouseEvent) {
    e.stopPropagation()
    navigate(`/map?event=${event.id}`)
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex flex-col bg-card rounded-2xl border border-border/50 overflow-hidden cursor-pointer',
        'shadow-card transition-all duration-200 ease-out',
        'hover:shadow-card-hover hover:-translate-y-1',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      )}
    >
      {/* Top accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-primary to-primary/60" />

      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {event.category}
          </span>
          <button
            aria-label={isSaved ? 'Remove bookmark' : 'Bookmark event'}
            aria-pressed={isSaved}
            onClick={handleBookmark}
            className={cn(
              'rounded-lg p-1 transition-all duration-150',
              isSaved
                ? 'text-primary opacity-100'
                : 'text-muted-foreground opacity-40 hover:opacity-100 hover:text-primary',
            )}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Title */}
        <h3
          className="text-[15px] font-medium leading-snug line-clamp-2 transition-colors duration-150 group-hover:text-primary"
          style={{ fontSize: '15px' }}
        >
          {event.title}
        </h3>

        {/* Summary */}
        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
          {event.summary}
        </p>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mt-auto">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{event.date} · {event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{event.rsvpCount} going</span>
          </div>
        </div>

        {/* Confidence tags (max 2) */}
        {event.confidenceTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {event.confidenceTags.slice(0, 2).map((tag) => (
              <ConfidenceTag key={tag} tag={tag} />
            ))}
          </div>
        )}

        <div className="pt-1">
          <button
            type="button"
            onClick={handleViewMap}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            View on map
          </button>
        </div>
      </div>
    </article>
  )
}
