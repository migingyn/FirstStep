import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { StudentOrg } from '@/data/mockData'

export function useStudentOrgsQuery() {
  return useQuery({
    queryKey: ['student-orgs'],
    queryFn: () => api.get<StudentOrg[]>('/student-orgs'),
  })
}
