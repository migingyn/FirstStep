export const UCSD_CAMPUS_WEBMAP_ID = 'd8cb938328994b4491305845130c5346'
export const ARCGIS_WORLD_GEOCODER_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'

export const UCSD_CAMPUS_CENTER = {
  latitude: 32.8801,
  longitude: -117.234,
} as const

export const UCSD_DEFAULT_ZOOM = 16
export const UCSD_FALLBACK_ZOOM = 15

export interface ArcGISLayerSummary {
  id: string
  title: string
  type: string
  url?: string
  fieldNames: string[]
}

export interface ArcGISFeatureCandidate {
  id: string
  title: string
  layerId: string
  layerTitle: string
  locationText?: string
  coordinates: {
    latitude: number
    longitude: number
  }
  rawAttributes: Record<string, unknown>
}

export interface ArcGISSearchCandidate {
  displayName: string
  address?: string
  score?: number
  coordinates: {
    latitude: number
    longitude: number
  }
}

export interface ArcGISMapRuntime {
  layerSummaries: ArcGISLayerSummary[]
  featureCandidates: ArcGISFeatureCandidate[]
  searchPlaces: (query: string) => Promise<ArcGISSearchCandidate[]>
}

export function normalizeLocationText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\n\r]+/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function scoreTextMatch(query: string, ...candidates: Array<string | undefined>): number {
  const normalizedQuery = normalizeLocationText(query)
  if (!normalizedQuery) {
    return 0
  }

  let bestScore = 0
  for (const candidate of candidates) {
    if (!candidate) {
      continue
    }

    const normalizedCandidate = normalizeLocationText(candidate)
    if (!normalizedCandidate) {
      continue
    }

    if (normalizedCandidate === normalizedQuery) {
      bestScore = Math.max(bestScore, 1)
      continue
    }

    if (normalizedCandidate.includes(normalizedQuery) || normalizedQuery.includes(normalizedCandidate)) {
      bestScore = Math.max(bestScore, 0.9)
      continue
    }

    const queryTokens = normalizedQuery.split(' ')
    const candidateTokens = normalizedCandidate.split(' ')
    const overlapCount = queryTokens.filter((token) => candidateTokens.includes(token)).length
    const tokenScore = overlapCount / Math.max(queryTokens.length, candidateTokens.length)
    bestScore = Math.max(bestScore, tokenScore)
  }

  return bestScore
}

export function isLikelyCampusPlaceLayer(summary: ArcGISLayerSummary): boolean {
  const searchableText = normalizeLocationText(
    `${summary.title} ${summary.fieldNames.join(' ')} ${summary.url ?? ''}`,
  )

  return (
    searchableText.includes('resource') ||
    searchableText.includes('building') ||
    searchableText.includes('place') ||
    searchableText.includes('location') ||
    searchableText.includes('poi')
  )
}

