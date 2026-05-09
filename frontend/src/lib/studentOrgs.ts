import { studentOrgs as mockStudentOrgs, type StudentOrg } from '@/data/mockData'
import { supabase } from '@/lib/supabase'

interface ClubRecord {
  id: string
  name: string
  abbreviation: string
  description: string
  website: string | null
  instagram: string | null
}

function mapClubRecord(record: ClubRecord): StudentOrg {
  return {
    id: record.id,
    name: record.name,
    abbreviation: record.abbreviation,
    description: record.description,
    website: record.website,
    instagram: record.instagram,
  }
}

export async function getStudentOrgs(): Promise<StudentOrg[]> {
  const { data, error } = await supabase
    .from('clubs')
    .select('id, name, abbreviation, description, website, instagram')
    .order('name', { ascending: true })

  if (error) {
    console.warn('Falling back to bundled mock student orgs because Supabase clubs could not be loaded.', error)
    return mockStudentOrgs
  }

  if (!data?.length) {
    console.warn('Supabase returned no clubs. Falling back to bundled mock student orgs.')
    return mockStudentOrgs
  }

  return data.map(mapClubRecord)
}
