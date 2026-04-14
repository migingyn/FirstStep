import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { useProgressDataQuery } from '@/hooks/useProgressData'
import {
  applyEventRsvpStatus,
  applyLocalRsvpTransition,
  applyLocalToggleSave,
  fetchProgressState,
  getEmptyProgressState,
  persistMapVisited,
  persistSavedEvent,
  type ProgressState,
  type RsvpStatus,
} from '@/lib/progress'

interface ProgressContextValue extends ProgressState {
  setRsvpStatus: (eventId: string, status: RsvpStatus) => Promise<void>
  getRsvpStatus: (eventId: string) => RsvpStatus | null
  toggleSave: (eventId: string) => Promise<void>
  markMapVisited: () => Promise<void>
  hasAttendedFirst: boolean
  savedCount: number
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [state, setState] = useState<ProgressState>(getEmptyProgressState)
  const hydratedUserIdRef = useRef<string | null>(null)
  const stateRef = useRef(state)
  const progressQuery = useProgressDataQuery(user?.id)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    if (!user?.id || !progressQuery.data || hydratedUserIdRef.current === user.id) {
      return
    }

    setState(progressQuery.data)
    hydratedUserIdRef.current = user.id
  }, [progressQuery.data, user?.id])

  useEffect(() => {
    if (!user?.id) {
      hydratedUserIdRef.current = null
      setState(getEmptyProgressState())
    }
  }, [user?.id])

  async function syncFromSupabase(userId: string) {
    const latestState = await queryClient.fetchQuery({
      queryKey: ['progress', userId],
      queryFn: () => fetchProgressState(userId),
    })

    setState(latestState)
  }

  async function setRsvpStatus(eventId: string, status: RsvpStatus) {
    setState((current) => applyLocalRsvpTransition(current, eventId, status))

    if (!user?.id) {
      return
    }

    try {
      await applyEventRsvpStatus(eventId, status)
      try {
        await queryClient.invalidateQueries({ queryKey: ['progress', user.id] })
        await syncFromSupabase(user.id)
      } catch (syncError) {
        console.warn('RSVP persisted, but progress sync failed. Keeping local RSVP state.', syncError)
      }
    } catch (error) {
      console.warn('Unable to persist RSVP. Keeping local RSVP state for this session.', error)
    }
  }

  function getRsvpStatus(eventId: string): RsvpStatus | null {
    return state.rsvpStatuses[eventId] ?? null
  }

  async function toggleSave(eventId: string) {
    const previousState = stateRef.current
    const shouldSave = !previousState.savedEvents.includes(eventId)

    setState((current) => applyLocalToggleSave(current, eventId))

    if (!user?.id) {
      return
    }

    try {
      await persistSavedEvent(user.id, eventId, shouldSave)
      try {
        await queryClient.invalidateQueries({ queryKey: ['progress', user.id] })
        await syncFromSupabase(user.id)
      } catch (syncError) {
        console.warn('Saved event persisted, but progress sync failed. Keeping local save state.', syncError)
      }
    } catch (error) {
      console.warn('Unable to persist saved event. Keeping local save state for this session.', error)
    }
  }

  async function markMapVisited() {
    const previousState = stateRef.current
    setState((current) => ({ ...current, mapVisited: true }))

    if (!user?.id) {
      return
    }

    try {
      await persistMapVisited(user.id)
      await queryClient.invalidateQueries({ queryKey: ['progress', user.id] })
      await syncFromSupabase(user.id)
    } catch (error) {
      setState(previousState)
      throw error
    }
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
