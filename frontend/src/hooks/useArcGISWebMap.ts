import { useEffect, useMemo, useState } from 'react'
import type { RefObject } from 'react'
import type MapView from '@arcgis/core/views/MapView'
import type FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import type GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import type ArcGISGraphic from '@arcgis/core/Graphic'
import type ArcGISPoint from '@arcgis/core/geometry/Point'
import {
  type ArcGISFeatureCandidate,
  type ArcGISLayerSummary,
  type ArcGISMapRuntime,
  ARCGIS_WORLD_GEOCODER_URL,
  isLikelyCampusPlaceLayer,
  UCSD_CAMPUS_CENTER,
  UCSD_CAMPUS_WEBMAP_ID,
} from '@/lib/arcgis'
import type { ResolvedLocation } from '@/lib/locationResolver'

interface UseArcGISWebMapOptions {
  containerRef: RefObject<HTMLDivElement | null>
  itemId?: string
  selectedLocation?: ResolvedLocation | null
}

export function useArcGISWebMap({
  containerRef,
  itemId = UCSD_CAMPUS_WEBMAP_ID,
  selectedLocation,
}: UseArcGISWebMapOptions) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [runtime, setRuntime] = useState<ArcGISMapRuntime | null>(null)
  const [view, setView] = useState<MapView | null>(null)

  useEffect(() => {
    let isMounted = true
    let localView: MapView | null = null

    async function setupMap() {
      if (!containerRef.current) {
        return
      }

      setStatus('loading')
      setError(null)

      try {
        const [
          { default: WebMap },
          { default: MapView },
          { default: GraphicsLayer },
          { default: FeatureLayer },
          locator,
        ] = await Promise.all([
          import('@arcgis/core/WebMap.js'),
          import('@arcgis/core/views/MapView.js'),
          import('@arcgis/core/layers/GraphicsLayer.js'),
          import('@arcgis/core/layers/FeatureLayer.js'),
          import('@arcgis/core/rest/locator.js'),
        ])

        const destinationLayer = new GraphicsLayer({
          title: 'Selected destination',
          listMode: 'hide',
        })

        const webMap = new WebMap({
          portalItem: { id: itemId },
        })

        webMap.add(destinationLayer)

        localView = new MapView({
          container: containerRef.current,
          map: webMap,
          center: [UCSD_CAMPUS_CENTER.longitude, UCSD_CAMPUS_CENTER.latitude],
          zoom: 15,
          constraints: { snapToZoom: false },
          popup: {
            dockEnabled: false,
          },
        })

        await localView.when()
        await webMap.loadAll()

        const layerSummaries: ArcGISLayerSummary[] = webMap.layers.toArray().map((layer) => ({
          id: layer.id,
          title: layer.title ?? layer.id,
          type: layer.type,
          url: 'url' in layer && typeof layer.url === 'string' ? layer.url : undefined,
          fieldNames:
            'fields' in layer && Array.isArray(layer.fields)
              ? layer.fields.map((field) => field.name)
              : [],
        }))

        if (import.meta.env.DEV) {
          console.info('ArcGIS WebMap operational layers', layerSummaries.map((layer) => layer.title))
        }

        const candidateLayers = webMap.layers
          .toArray()
          .filter(
            (layer): layer is FeatureLayer =>
              layer instanceof FeatureLayer &&
              layer.geometryType === 'point' &&
              isLikelyCampusPlaceLayer({
                id: layer.id,
                title: layer.title ?? layer.id,
                type: layer.type,
                url: typeof layer.url === 'string' ? layer.url : undefined,
                fieldNames: layer.fields.map((field) => field.name),
              }),
          )

        const queriedCandidates = await Promise.all(
          candidateLayers.map(async (layer) => {
            try {
              const featureSet = await layer.queryFeatures({
                where: '1=1',
                outFields: ['*'],
                returnGeometry: true,
              })

              return featureSet.features
                .filter((feature: ArcGISGraphic) => feature.geometry?.type === 'point')
                .map((feature: ArcGISGraphic) => {
                  const attributes = feature.attributes as Record<string, unknown>
                  const resource = String(attributes.Resource ?? attributes.Name ?? layer.title ?? layer.id).trim()
                  const locationText = String(attributes.Location ?? '').trim() || undefined
                  const geometry = feature.geometry as ArcGISPoint

                  return {
                    id: `${layer.id}:${String(attributes.OBJECTID ?? resource)}`,
                    title: resource,
                    layerId: layer.id,
                    layerTitle: layer.title ?? layer.id,
                    locationText,
                    coordinates: {
                      longitude: geometry.longitude ?? UCSD_CAMPUS_CENTER.longitude,
                      latitude: geometry.latitude ?? UCSD_CAMPUS_CENTER.latitude,
                    },
                    rawAttributes: attributes,
                  } satisfies ArcGISFeatureCandidate
                })
            } catch (layerError) {
              if (import.meta.env.DEV) {
                console.warn(`Unable to query ArcGIS layer "${layer.title}"`, layerError)
              }

              return []
            }
          }),
        )

        const featureCandidates = queriedCandidates.flat()

        const nextRuntime: ArcGISMapRuntime = {
          layerSummaries,
          featureCandidates,
          searchPlaces: async (query: string) => {
            const searchText = `${query}, UC San Diego, La Jolla, CA`
            const results = await locator.addressToLocations(ARCGIS_WORLD_GEOCODER_URL, {
              address: { SingleLine: searchText },
              maxLocations: 5,
              outFields: ['Place_addr', 'Addr_type', 'Type'],
              searchExtent: localView?.extent,
            })

            return results
              .filter((candidate) => candidate.location != null)
              .map((candidate) => ({
                displayName: String(
                  (candidate.attributes as Record<string, unknown> | null | undefined)?.Place_addr ??
                    (candidate.attributes as Record<string, unknown> | null | undefined)?.Type ??
                    query,
                ),
                address: candidate.address ?? undefined,
                score: candidate.score ?? undefined,
                coordinates: {
                  longitude: candidate.location?.longitude ?? UCSD_CAMPUS_CENTER.longitude,
                  latitude: candidate.location?.latitude ?? UCSD_CAMPUS_CENTER.latitude,
                },
              }))
          },
        }

        if (!isMounted) {
          localView.destroy()
          return
        }

        setRuntime(nextRuntime)
        setView(localView)
        setStatus('ready')
      } catch (mapError) {
        if (!isMounted) {
          return
        }

        setError(mapError instanceof Error ? mapError.message : 'Unable to load the UCSD map.')
        setStatus('error')
      }
    }

    void setupMap()

    return () => {
      isMounted = false
      setRuntime(null)
      setView(null)
      localView?.destroy()
    }
  }, [containerRef, itemId])

  useEffect(() => {
    if (!view) {
      return
    }

    let cancelled = false
    const currentView = view

    async function highlightSelection() {
      const [
        { default: Graphic },
        { default: GraphicsLayer },
        { default: Point },
      ] = await Promise.all([
        import('@arcgis/core/Graphic.js'),
        import('@arcgis/core/layers/GraphicsLayer.js'),
        import('@arcgis/core/geometry/Point.js'),
      ])

      if (cancelled) {
        return
      }

      const destinationLayer = currentView.map?.layers
        .toArray()
        .find((layer) => layer instanceof GraphicsLayer && layer.title === 'Selected destination') as GraphicsLayer | undefined

      if (!destinationLayer) {
        return
      }

      destinationLayer.removeAll()

      if (!selectedLocation) {
        currentView.closePopup()
        return
      }

      const point = new Point({
        longitude: selectedLocation.coordinates.longitude,
        latitude: selectedLocation.coordinates.latitude,
      })

      const highlightGraphic = new Graphic({
        geometry: point,
        attributes: {
          title: selectedLocation.displayName,
          helperText: selectedLocation.helperText ?? '',
          source: selectedLocation.source,
        },
        symbol: {
          type: 'simple-marker',
          style: 'circle',
          size: 16,
          color: [10, 103, 163, 0.95],
          outline: {
            color: [255, 199, 0, 1],
            width: 3,
          },
        },
        popupTemplate: {
          title: '{title}',
          content: '{helperText}',
        },
      })

      destinationLayer.add(highlightGraphic)

      await currentView.goTo(
        {
          target: point,
          zoom: selectedLocation.confidence >= 0.7 ? 17 : 15,
        },
        { duration: 650 },
      )

      currentView.openPopup({
        features: [highlightGraphic],
        location: point,
      })
    }

    void highlightSelection()

    return () => {
      cancelled = true
    }
  }, [selectedLocation, view])

  const layerTitles = useMemo(
    () => runtime?.layerSummaries.map((layer) => layer.title) ?? [],
    [runtime],
  )

  return {
    status,
    error,
    runtime,
    view,
    layerTitles,
  }
}
