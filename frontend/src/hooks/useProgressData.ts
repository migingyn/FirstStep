import { useQuery } from '@tanstack/react-query'
import { fetchProgressState } from '@/lib/progress'

export function useProgressDataQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ['progress', userId],
    queryFn: () => fetchProgressState(userId ?? ''),
    enabled: Boolean(userId),
  })
}
