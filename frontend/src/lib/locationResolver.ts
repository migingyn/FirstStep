import {
  ARCGIS_WORLD_GEOCODER_URL,
  type ArcGISMapRuntime,
  scoreTextMatch,
  UCSD_CAMPUS_CENTER,
} from '@/lib/arcgis'

export type LocationResolutionSource = 'feature-layer' | 'search' | 'alias-map' | 'fallback'

export interface ResolvedLocation {
  query: string
  displayName: string
  coordinates: {
    latitude: number
    longitude: number
  }
  buildingName?: string
  helperText?: string
  source: LocationResolutionSource
  confidence: number
  matchedLayerTitle?: string
  address?: string
}

interface LocationAlias {
  displayName: string
  buildingName?: string
  helperText?: string
  coordinates: {
    latitude: number
    longitude: number
  }
  aliases: string[]
}

export interface ResolveLocationOptions {
  mapRuntime?: ArcGISMapRuntime | null
}

const LOCATION_ALIASES: LocationAlias[] = [
  {
    displayName: 'Price Center',
    buildingName: 'Price Center',
    helperText: 'Near Library Walk and the UC San Diego Student Center.',
    coordinates: { latitude: 32.8794, longitude: -117.2361 },
    aliases: ['price center', 'price center east ballroom', 'price center east', 'price center west'],
  },
  {
    displayName: 'Geisel Library',
    buildingName: 'Geisel Library',
    helperText: 'The iconic central library by Library Walk.',
    coordinates: { latitude: 32.8811, longitude: -117.2376 },
    aliases: ['geisel', 'geisel library', 'library walk'],
  },
  {
    displayName: 'Warren Mall',
    buildingName: 'Warren Mall',
    helperText: 'The open plaza through Warren College near engineering buildings.',
    coordinates: { latitude: 32.8825, longitude: -117.2348 },
    aliases: ['warren mall'],
  },
  {
    displayName: 'Gilman Parking Structure',
    buildingName: 'Gilman Parking Structure',
    helperText: 'Near Gilman Drive and central campus access points.',
    coordinates: { latitude: 32.8791, longitude: -117.2336 },
    aliases: ['gilman parking structure', 'gilman parking'],
  },
  {
    displayName: 'RIMAC',
    buildingName: 'RIMAC',
    helperText: 'The main athletics and recreation complex on campus.',
    coordinates: { latitude: 32.8853, longitude: -117.2411 },
    aliases: ['rimac', 'rimac arena'],
  },
  {
    displayName: 'Center Hall',
    buildingName: 'Center Hall',
    helperText: 'A large lecture building near the center of main campus.',
    coordinates: { latitude: 32.8756, longitude: -117.2381 },
    aliases: ['center hall'],
  },
  {
    displayName: 'Pepper Canyon Hall',
    buildingName: 'Pepper Canyon Hall',
    helperText: 'Near the trolley and the newer campus housing area.',
    coordinates: { latitude: 32.8777, longitude: -117.2291 },
    aliases: ['pepper canyon hall', 'pepper canyon'],
  },
  {
    displayName: 'Sixth College',
    buildingName: 'Sixth College',
    helperText: 'Northwest of Geisel with newer student spaces and lounges.',
    coordinates: { latitude: 32.8818, longitude: -117.2427 },
    aliases: ['sixth college', 'sixth college living room'],
  },
  {
    displayName: 'Eighth College',
    buildingName: 'Eighth College',
    helperText: 'On the west side of campus near the coast and newer housing.',
    coordinates: { latitude: 32.889, longitude: -117.2446 },
    aliases: ['eighth college'],
  },
  {
    displayName: 'Career Services Center',
    buildingName: 'Career Services Center',
    helperText: 'Near the main campus core, close to student support services.',
    coordinates: { latitude: 32.8797, longitude: -117.2368 },
    aliases: ['career services center', 'career services center room 210', 'career center'],
  },
  {
    displayName: 'Scripps Pier Lawn',
    buildingName: 'Scripps Pier',
    helperText: 'West of main campus along the coast by Scripps Institution of Oceanography.',
    coordinates: { latitude: 32.8662, longitude: -117.2537 },
    aliases: ['scripps pier lawn', 'scripps pier'],
  },
  {
    displayName: 'Student Center Gaming Lounge',
    buildingName: 'Student Center',
    helperText: 'In the Old Student Center area near campus community spaces.',
    coordinates: { latitude: 32.8792, longitude: -117.2404 },
    aliases: ['student center gaming lounge', 'gaming lounge', 'student center'],
  },
  {
    displayName: 'CSE Building',
    buildingName: 'Computer Science and Engineering Building',
    helperText: 'In the engineering district east of Warren Mall.',
    coordinates: { latitude: 32.8823, longitude: -117.2341 },
    aliases: ['cse building', 'cse building room 1202', 'computer science and engineering building'],
  },
  {
    displayName: 'The Basement',
    buildingName: 'The Basement',
    helperText: 'The entrepreneurship hub near campus innovation spaces.',
    coordinates: { latitude: 32.8794, longitude: -117.2346 },
    aliases: ['the basement', 'entrepreneurship center', 'the basement entrepreneurship center'],
  },
]

function resolveAlias(query: string): ResolvedLocation | null {
  let bestAlias: LocationAlias | null = null
  let bestScore = 0

  for (const alias of LOCATION_ALIASES) {
    const score = scoreTextMatch(query, alias.displayName, alias.buildingName, ...alias.aliases)
    if (score > bestScore) {
      bestAlias = alias
      bestScore = score
    }
  }

  if (!bestAlias || bestScore < 0.55) {
    return null
  }

  return {
    query,
    displayName: bestAlias.displayName,
    buildingName: bestAlias.buildingName,
    helperText: bestAlias.helperText,
    coordinates: bestAlias.coordinates,
    source: 'alias-map',
    confidence: Math.max(0.65, Math.min(0.9, bestScore)),
  }
}

async function searchWithArcGIS(query: string, options: ResolveLocationOptions): Promise<ResolvedLocation | null> {
  const runtimeCandidates = options.mapRuntime
    ? await options.mapRuntime.searchPlaces(query)
    : await searchArcGISWorldGeocoder(query)

  const topResult = runtimeCandidates[0]
  if (!topResult) {
    return null
  }

  return {
    query,
    displayName: topResult.displayName,
    coordinates: topResult.coordinates,
    buildingName: topResult.displayName,
    address: topResult.address,
    helperText: 'Map search matched this campus place approximately.',
    source: 'search',
    confidence: Math.max(0.45, Math.min(0.82, (topResult.score ?? 78) / 100)),
  }
}

function resolveFromFeatureLayer(query: string, options: ResolveLocationOptions): ResolvedLocation | null {
  const featureCandidates = options.mapRuntime?.featureCandidates ?? []

  let bestMatch: ResolvedLocation | null = null
  let bestScore = 0

  for (const candidate of featureCandidates) {
    const score = scoreTextMatch(query, candidate.title, candidate.locationText)
    if (score <= bestScore || score < 0.65) {
      continue
    }

    bestScore = score
    bestMatch = {
      query,
      displayName: candidate.locationText || candidate.title,
      buildingName: candidate.locationText || candidate.title,
      helperText: `Matched against the UCSD ArcGIS layer: ${candidate.layerTitle}.`,
      coordinates: candidate.coordinates,
      source: 'feature-layer',
      confidence: Math.max(0.7, Math.min(0.96, score)),
      matchedLayerTitle: candidate.layerTitle,
    }
  }

  return bestMatch
}

async function searchArcGISWorldGeocoder(query: string) {
  const searchText = `${query}, UC San Diego, La Jolla, CA`
  const params = new URLSearchParams({
    f: 'json',
    maxLocations: '5',
    outFields: 'Place_addr,Addr_type,Type',
    singleLine: searchText,
    searchExtent: '-117.2494,32.8729,-117.2301,32.8822',
    category: 'POI',
  })

  const response = await fetch(`${ARCGIS_WORLD_GEOCODER_URL}/findAddressCandidates?${params}`)
  if (!response.ok) {
    return []
  }

  const json = (await response.json()) as {
    candidates?: Array<{
      address?: string
      location?: { x?: number; y?: number }
      score?: number
      attributes?: Record<string, string | number | undefined>
    }>
  }

  return (json.candidates ?? [])
    .filter((candidate) => candidate.location?.x != null && candidate.location?.y != null)
    .map((candidate) => ({
      displayName: String(
        candidate.attributes?.Place_addr ||
          candidate.attributes?.Type ||
          candidate.address ||
          query,
      ),
      address: candidate.address,
      score: candidate.score,
      coordinates: {
        longitude: Number(candidate.location?.x),
        latitude: Number(candidate.location?.y),
      },
    }))
}

export async function resolveLocation(
  query: string,
  options: ResolveLocationOptions = {},
): Promise<ResolvedLocation> {
  const featureMatch = resolveFromFeatureLayer(query, options)
  if (featureMatch) {
    return featureMatch
  }

  const searchMatch = await searchWithArcGIS(query, options).catch(() => null)
  if (searchMatch) {
    return searchMatch
  }

  const aliasMatch = resolveAlias(query)
  if (aliasMatch) {
    return aliasMatch
  }

  return {
    query,
    displayName: query,
    coordinates: UCSD_CAMPUS_CENTER,
    helperText: 'We could not match this exactly, so the map is centered on the middle of campus.',
    source: 'fallback',
    confidence: 0.2,
  }
}

export function getWhereToGoCopy(location: ResolvedLocation) {
  if (location.confidence >= 0.75) {
    return {
      title: `This event is at ${location.buildingName ?? location.displayName}`,
      body: 'Tap View on Map to see the exact campus location before you head out.',
    }
  }

  return {
    title: 'We matched this location approximately',
    body: 'Please double-check the organizer details before you go, especially if room numbers matter.',
  }
}

export function getResolvedBuildingText(location: ResolvedLocation) {
  return location.buildingName ?? location.displayName
}

