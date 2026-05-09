import { useQuery } from '@tanstack/react-query'
import { getStudentOrgs } from '@/lib/studentOrgs'
import type { StudentOrg } from '@/data/mockData'

export function useStudentOrgsQuery() {
  return useQuery<StudentOrg[]>({
    queryKey: ['student-orgs'],
    queryFn: () => getStudentOrgs(),
  })
}
