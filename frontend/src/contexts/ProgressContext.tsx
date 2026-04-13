import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProgressDataQuery } from '@/hooks/useProgressData'
import {
  getEmptyProgressState,
  hasProgressData,
  type ProgressState,
  type RsvpStatus,
} from '@/lib/progress'

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
  return getEmptyProgressState()
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [state, setState] = useState<ProgressState>(loadState)
  const hydratedUserIdRef = useRef<string | null>(null)
  const progressQuery = useProgressDataQuery(user?.id)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (!user?.id || !progressQuery.data || hydratedUserIdRef.current === user.id) {
      return
    }

    setState((current) => {
      if (hasProgressData(progressQuery.data) || !hasProgressData(current)) {
        return progressQuery.data
      }

      return current
    })
    hydratedUserIdRef.current = user.id
  }, [progressQuery.data, user?.id])

  useEffect(() => {
    if (!user?.id) {
      hydratedUserIdRef.current = null
    }
  }, [user?.id])

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
