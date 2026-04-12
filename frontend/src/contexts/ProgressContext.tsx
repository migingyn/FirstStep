import { createContext, useContext, useEffect, useState } from 'react'

type RsvpStatus = 'going' | 'pending' | 'maybe' | 'not-going'

interface ProgressState {
  rsvpedEvents: string[]
  rsvpStatuses: Record<string, RsvpStatus>
  savedEvents: string[]
  dismissedEvents: string[]
  mapVisited: boolean
}

interface ProgressContextValue extends ProgressState {
  setRsvpStatus: (eventId: string, status: RsvpStatus) => void
  getRsvpStatus: (eventId: string) => RsvpStatus | null
  toggleSave: (eventId: string) => void
  markMapVisited: () => void
  hasAttendedFirst: boolean
  savedCount: number
}

const STORAGE_KEY = 'firststep-progress'

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ProgressState
  } catch {
    // ignore
  }
  return {
    rsvpedEvents: [],
    rsvpStatuses: {},
    savedEvents: [],
    dismissedEvents: [],
    mapVisited: false,
  }
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function setRsvpStatus(eventId: string, status: RsvpStatus) {
    setState((prev) => {
      const newStatuses = { ...prev.rsvpStatuses, [eventId]: status }
      const newRsvped = Object.entries(newStatuses)
        .filter(([, s]) => s === 'going')
        .map(([id]) => id)

      let newSaved = [...prev.savedEvents]
      let newDismissed = [...prev.dismissedEvents]

      if (status === 'pending' || status === 'maybe') {
        if (!newSaved.includes(eventId)) newSaved.push(eventId)
      } else if (status === 'not-going') {
        newSaved = newSaved.filter((id) => id !== eventId)
        if (!newDismissed.includes(eventId)) newDismissed.push(eventId)
      } else if (status === 'going') {
        newDismissed = newDismissed.filter((id) => id !== eventId)
      }

      return {
        ...prev,
        rsvpStatuses: newStatuses,
        rsvpedEvents: newRsvped,
        savedEvents: newSaved,
        dismissedEvents: newDismissed,
      }
    })
  }

  function getRsvpStatus(eventId: string): RsvpStatus | null {
    return state.rsvpStatuses[eventId] ?? null
  }

  function toggleSave(eventId: string) {
    setState((prev) => {
      const isSaved = prev.savedEvents.includes(eventId)
      return {
        ...prev,
        savedEvents: isSaved
          ? prev.savedEvents.filter((id) => id !== eventId)
          : [...prev.savedEvents, eventId],
      }
    })
  }

  function markMapVisited() {
    setState((prev) => ({ ...prev, mapVisited: true }))
  }

  const value: ProgressContextValue = {
    ...state,
    setRsvpStatus,
    getRsvpStatus,
    toggleSave,
    markMapVisited,
    hasAttendedFirst: state.rsvpedEvents.length > 0,
    savedCount: state.savedEvents.length,
  }

  return <ProgressContext value={value}>{children}</ProgressContext>
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
