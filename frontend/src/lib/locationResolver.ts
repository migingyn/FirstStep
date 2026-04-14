import {
  ARCGIS_WORLD_GEOCODER_URL,
  type ArcGISMapRuntime,
  normalizeLocationText,
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

const resolutionCache = new Map<string, Promise<ResolvedLocation>>()

const LOCATION_ALIASES: LocationAlias[] = [
  {
    displayName: 'The Zone at Price Center',
    buildingName: 'The Zone',
    helperText: 'Inside Price Center, a student lounge and programming space near the central food court.',
    coordinates: { latitude: 32.8795, longitude: -117.236 },
    aliases: ['the zone', 'price center the zone', 'price center, the zone'],
  },
  {
    displayName: 'Price Center Theater',
    buildingName: 'Price Center Theater',
    helperText: 'Inside Price Center near PC West and the main student activity spaces.',
    coordinates: { latitude: 32.8792, longitude: -117.2363 },
    aliases: ['price center theater', 'pc theater', 'price center west plaza', 'pc west plaza'],
  },
  {
    displayName: 'Cross-Cultural Center, Comunidad Room',
    buildingName: 'Cross-Cultural Center',
    helperText: 'Inside Price Center near the community resource spaces and meeting rooms.',
    coordinates: { latitude: 32.8793, longitude: -117.2362 },
    aliases: ['cross-cultural center', 'comunidad room', 'price center, cross-cultural center', 'cross cultural center comunidad room'],
  },
  {
    displayName: 'Women’s Resource Center',
    buildingName: 'Women’s Resource Center',
    helperText: 'A campus community and resource space near the Student Services area.',
    coordinates: { latitude: 32.8786, longitude: -117.2355 },
    aliases: ['women’s resource center', "women's resource center", 'womens resource center', 'wrc'],
  },
  {
    displayName: 'RAZA Resource Center',
    buildingName: 'RAZA Resource Center',
    helperText: 'Located in Pepper Canyon Hall and close to the trolley-facing side of campus.',
    coordinates: { latitude: 32.8778, longitude: -117.2292 },
    aliases: ['raza resource center', 'rrc', 'pepper canyon hall room 264', 'pepper canyon hall, room 264'],
  },
  {
    displayName: 'Geisel Library Seuss Room',
    buildingName: 'Geisel Library',
    helperText: 'Inside Geisel Library near the named reading and meeting spaces.',
    coordinates: { latitude: 32.8812, longitude: -117.2375 },
    aliases: ['seuss room', 'geisel library seuss room', 'geisel library, seuss room'],
  },
  {
    displayName: 'Geisel Library Calm Cave',
    buildingName: 'Geisel Library',
    helperText: 'Inside Geisel Library in one of the quieter wellness-oriented rooms.',
    coordinates: { latitude: 32.8811, longitude: -117.2377 },
    aliases: ['calm-cave room', 'calm cave room', 'geisel library calm-cave room', 'geisel library, calm-cave room'],
  },
  {
    displayName: 'Geisel Meeting Room',
    buildingName: 'Geisel Library',
    helperText: 'Inside Geisel Library in a reservable campus meeting space.',
    coordinates: { latitude: 32.8811, longitude: -117.2376 },
    aliases: ['geisel meeting room', 'geisel library geisel meeting room', 'geisel library, geisel meeting room'],
  },
  {
    displayName: 'Kavli Auditorium, Tata Hall',
    buildingName: 'Tata Hall',
    helperText: 'Inside Tata Hall near the campus engineering and innovation buildings.',
    coordinates: { latitude: 32.8819, longitude: -117.2332 },
    aliases: ['kavli auditorium', 'tata hall', 'kavli auditorium tata hall', '3rd floor tata hall'],
  },
  {
    displayName: 'Jacobs Hall, Qualcomm Conference Room',
    buildingName: 'Jacobs Hall',
    helperText: 'Inside Jacobs Hall in the engineering district east of Warren Mall.',
    coordinates: { latitude: 32.8831, longitude: -117.2334 },
    aliases: ['jacobs hall', 'qualcomm conference room', 'jacobs hall qualcomm conference room'],
  },
  {
    displayName: 'Craft Center at Sixth College',
    buildingName: 'Craft Center',
    helperText: 'At Sixth College near Mosaic and the newer student commons spaces.',
    coordinates: { latitude: 32.8819, longitude: -117.2425 },
    aliases: ['craft center', 'mosaic second floor', 'craft center sixth college', 'sixth college mosaic second floor'],
  },
  {
    displayName: 'Black Resource Center',
    buildingName: 'Black Resource Center',
    helperText: 'A student community and cultural resource space on central campus.',
    coordinates: { latitude: 32.8788, longitude: -117.2357 },
    aliases: ['black resource center', 'brc'],
  },
  {
    displayName: 'Atkinson Hall',
    buildingName: 'Atkinson Hall',
    helperText: 'Home to Qualcomm Institute spaces near Warren Mall and the engineering side of campus.',
    coordinates: { latitude: 32.8819, longitude: -117.2338 },
    aliases: ['atkinson hall', 'aktinson hall', 'atkinson hall first floor', 'aktinson hall first floor', 'showcase qi'],
  },
  {
    displayName: 'Student Health Services',
    buildingName: 'Student Health Services',
    helperText: 'The main student health clinic and wellness services location on campus.',
    coordinates: { latitude: 32.8755, longitude: -117.2402 },
    aliases: ['student health services', 'student health'],
  },
  {
    displayName: 'ERC Green',
    buildingName: 'ERC Green',
    helperText: 'An open outdoor space in Eleanor Roosevelt College used for casual student events.',
    coordinates: { latitude: 32.8859, longitude: -117.2429 },
    aliases: ['erc green', 'eleanor roosevelt college green', 'roosevelt green'],
  },
  {
    displayName: 'Price Center',
    buildingName: 'Price Center',
    helperText: 'Near Library Walk and the UC San Diego Student Center.',
    coordinates: { latitude: 32.8794, longitude: -117.2361 },
    aliases: ['price center', 'price center east ballroom', 'price center east', 'price center west', 'price center 2nd floor', 'price center, 2nd floor, 2.425'],
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
  let bestSpecificity = 0
  const normalizedQuery = normalizeLocationText(query)

  for (const alias of LOCATION_ALIASES) {
    const aliasPhrases = [alias.displayName, alias.buildingName, ...alias.aliases].filter(Boolean) as string[]
    const score = scoreTextMatch(query, ...aliasPhrases)
    const phraseBonus = aliasPhrases.some((phrase) => {
      const normalizedPhrase = normalizeLocationText(phrase)
      return normalizedPhrase.length > 0 && normalizedQuery.includes(normalizedPhrase)
    })
      ? 0.08
      : 0
    const boostedScore = Math.min(1, score + phraseBonus)
    const specificity = Math.max(...aliasPhrases.map((phrase) => normalizeLocationText(phrase).length), 0)

    if (boostedScore > bestScore || (boostedScore === bestScore && specificity > bestSpecificity)) {
      bestAlias = alias
      bestScore = boostedScore
      bestSpecificity = specificity
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
  const cacheKey = normalizeLocationText(query)
  const canUseCache = !options.mapRuntime && Boolean(cacheKey)

  if (canUseCache) {
    const cached = resolutionCache.get(cacheKey)
    if (cached) {
      return cached
    }
  }

  const resolutionPromise = (async () => {
    const featureMatch = resolveFromFeatureLayer(query, options)
    if (featureMatch) {
      return featureMatch
    }

    const aliasMatch = resolveAlias(query)
    if (aliasMatch) {
      return aliasMatch
    }

    const searchMatch = await searchWithArcGIS(query, options).catch(() => null)
    if (searchMatch) {
      return searchMatch
    }

    return {
      query,
      displayName: query,
      coordinates: UCSD_CAMPUS_CENTER,
      helperText: 'We could not match this exactly, so the map is centered on the middle of campus.',
      source: 'fallback' as const,
      confidence: 0.2,
    }
  })()

  if (canUseCache) {
    resolutionCache.set(cacheKey, resolutionPromise)
  }

  return resolutionPromise
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
