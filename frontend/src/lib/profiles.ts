import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface ProfileRecord {
  id: string
  full_name: string
  college: string
  major: string | null
  year: string | null
  interests: string[]
  goal: string
  completed_onboarding: boolean
  created_at: string
  updated_at: string
}

const PENDING_ONBOARDING_PREFIX = 'firststep-pending-onboarding:'

function getDefaultProfileSeed(user: User) {
  return {
    id: user.id,
    full_name:
      typeof user.user_metadata.full_name === 'string'
        ? user.user_metadata.full_name
        : typeof user.user_metadata.name === 'string'
          ? user.user_metadata.name
          : '',
    college: '',
    major: null,
    year: null,
    interests: [] as string[],
    goal: '',
    completed_onboarding: false,
  }
}

export async function fetchProfile(userId: string): Promise<ProfileRecord | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()

  if (error) {
    throw error
  }

  return data
}

interface SaveOnboardingInput {
  fullName: string
  college: string
  interests: string[]
  goal: string
  completedOnboarding: boolean
}

function getPendingOnboardingKey(userId: string) {
  return `${PENDING_ONBOARDING_PREFIX}${userId}`
}

function getNowIso() {
  return new Date().toISOString()
}

function cachePendingOnboarding(userId: string, input: SaveOnboardingInput) {
  window.localStorage.setItem(getPendingOnboardingKey(userId), JSON.stringify(input))
}

function clearPendingOnboarding(userId: string) {
  window.localStorage.removeItem(getPendingOnboardingKey(userId))
}

function readPendingOnboarding(userId: string): SaveOnboardingInput | null {
  const raw = window.localStorage.getItem(getPendingOnboardingKey(userId))
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as SaveOnboardingInput
  } catch {
    clearPendingOnboarding(userId)
    return null
  }
}

function mergeProfileWithPending(
  profile: ProfileRecord,
  pending: SaveOnboardingInput,
): ProfileRecord {
  return {
    ...profile,
    full_name: pending.fullName || profile.full_name,
    college: pending.college || profile.college,
    interests: pending.interests.length > 0 ? pending.interests : profile.interests,
    goal: pending.goal || profile.goal,
    completed_onboarding: pending.completedOnboarding || profile.completed_onboarding,
    updated_at: getNowIso(),
  }
}

function buildLocalProfile(user: User, pending?: SaveOnboardingInput | null): ProfileRecord {
  const seed = getDefaultProfileSeed(user)
  const now = getNowIso()

  return {
    id: user.id,
    full_name: pending?.fullName || seed.full_name,
    college: pending?.college || seed.college,
    major: seed.major,
    year: seed.year,
    interests: pending?.interests ?? seed.interests,
    goal: pending?.goal || seed.goal,
    completed_onboarding: pending?.completedOnboarding ?? seed.completed_onboarding,
    created_at: now,
    updated_at: now,
  }
}

async function upsertProfile(payload: Partial<ProfileRecord> & { id: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        ...payload,
        updated_at: getNowIso(),
      },
      { onConflict: 'id' },
    )
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as ProfileRecord
}

export async function saveOnboardingProfile(
  userId: string,
  input: SaveOnboardingInput,
): Promise<ProfileRecord> {
  cachePendingOnboarding(userId, input)

  try {
    const profile = await upsertProfile({
      id: userId,
      full_name: input.fullName,
      college: input.college,
      interests: input.interests,
      goal: input.goal,
      completed_onboarding: input.completedOnboarding,
    })
    clearPendingOnboarding(userId)
    return profile
  } catch (error) {
    // Keep pending onboarding data locally so it can sync later,
    // but surface the failure so the UI does not assume save succeeded.
    throw error instanceof Error ? error : new Error('Unable to save onboarding profile.')
  }
}

export async function ensureProfile(user: User): Promise<ProfileRecord> {
  const pending = readPendingOnboarding(user.id)
  const existing = await fetchProfile(user.id)

  if (pending) {
    try {
      const synced = await upsertProfile({
        id: user.id,
        full_name: pending.fullName || existing?.full_name || getDefaultProfileSeed(user).full_name,
        college: pending.college || existing?.college || '',
        interests: pending.interests,
        goal: pending.goal || existing?.goal || '',
        completed_onboarding: pending.completedOnboarding,
      })
      clearPendingOnboarding(user.id)
      return synced
    } catch {
      if (existing) {
        return mergeProfileWithPending(existing, pending)
      }

      return buildLocalProfile(user, pending)
    }
  }

  if (existing) {
    return existing
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(getDefaultProfileSeed(user))
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return data
  } catch {
    return buildLocalProfile(user)
  }
}
