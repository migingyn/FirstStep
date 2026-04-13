import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { ensureProfile, type ProfileRecord } from '@/lib/profiles'
import { supabase } from '@/lib/supabase'

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: ProfileRecord | null
  isLoading: boolean
  profileError: string | null
  isAuthenticated: boolean
  refreshProfile: () => Promise<ProfileRecord | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfileRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)

  async function syncSession(nextSession: Session | null) {
    setSession(nextSession)

    if (!nextSession?.user) {
      setProfile(null)
      setProfileError(null)
      setIsLoading(false)
      return null
    }

    try {
      const nextProfile = await ensureProfile(nextSession.user)
      setProfile(nextProfile)
      setProfileError(null)
      return nextProfile
    } catch (error) {
      setProfile(null)
      setProfileError(error instanceof Error ? error.message : 'Unable to load your profile.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true

    async function bootstrap() {
      const { data, error } = await supabase.auth.getSession()

      if (!isActive) {
        return
      }

      if (error) {
        setSession(null)
        setProfile(null)
        setProfileError(error.message)
        setIsLoading(false)
        return
      }

      await syncSession(data.session)
    }

    void bootstrap()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isActive) {
        return
      }

      void syncSession(nextSession)
    })

    return () => {
      isActive = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function refreshProfile() {
    if (!session?.user) {
      setProfile(null)
      return null
    }

    const refreshedProfile = await ensureProfile(session.user)
    setProfile(refreshedProfile)
    setProfileError(null)
    return refreshedProfile
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isLoading,
      profileError,
      isAuthenticated: Boolean(session?.user),
      refreshProfile,
      signOut,
    }),
    [isLoading, profile, profileError, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
