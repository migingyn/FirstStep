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

export async function ensureProfile(user: User): Promise<ProfileRecord> {
  const existing = await fetchProfile(user.id)
  if (existing) {
    return existing
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert(getDefaultProfileSeed(user))
    .select('*')
    .single()

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

export async function saveOnboardingProfile(
  userId: string,
  input: SaveOnboardingInput,
): Promise<ProfileRecord> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: input.fullName,
      college: input.college,
      interests: input.interests,
      goal: input.goal,
      completed_onboarding: input.completedOnboarding,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
}
