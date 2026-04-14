import { MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { UCSD_CAMPUS_CENTER, UCSD_DEFAULT_ZOOM, UCSD_FALLBACK_ZOOM } from '@/lib/arcgis'
import { loadMapboxGl } from '@/lib/mapbox'
import { cn } from '@/lib/utils'
import type { ResolvedLocation } from '@/lib/locationResolver'
import type { ArcGISMapRuntime } from '@/lib/arcgis'

interface UCSDCampusMapProps {
  className?: string
  selectedLocation?: ResolvedLocation | null
  onRuntimeReady?: (runtime: ArcGISMapRuntime | null) => void
}

export function UCSDCampusMap({
  className,
  selectedLocation,
  onRuntimeReady,
}: UCSDCampusMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const popupRef = useRef<any>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    onRuntimeReady?.(null)
  }, [onRuntimeReady])

  useEffect(() => {
    let cancelled = false

    async function setupMap() {
      if (!containerRef.current) {
        return
      }

      setStatus('loading')
      setError(null)

      try {
        await loadMapboxGl()
        const mapboxgl = window.mapboxgl
        if (!mapboxgl?.Map) {
          throw new Error('Mapbox GL JS did not finish initializing.')
        }

        if (cancelled || !containerRef.current) {
          return
        }

        const map = new mapboxgl.Map({
          container: containerRef.current,
          style: 'mapbox://styles/mapbox/outdoors-v12',
          center: [UCSD_CAMPUS_CENTER.longitude, UCSD_CAMPUS_CENTER.latitude],
          zoom: UCSD_FALLBACK_ZOOM,
          pitch: 0,
          bearing: 0,
          attributionControl: false,
        })

        mapRef.current = map
        popupRef.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 20,
        })

        map.on('style.load', () => {
          if (!map.getSource('mapbox-dem')) {
            map.addSource('mapbox-dem', {
              type: 'raster-dem',
              url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
              tileSize: 512,
              maxzoom: 14,
            })
          }

          const markerElement = document.createElement('div')
          markerElement.className = 'firststep-mapbox-marker'
          markerElement.innerHTML =
            '<div style="width:22px;height:22px;border-radius:9999px;background:#0a67a3;border:4px solid #ffcf33;box-shadow:0 10px 24px rgba(10,103,163,0.25);"></div>'

          markerRef.current = new mapboxgl.Marker({
            element: markerElement,
            anchor: 'bottom',
          })
            .setLngLat([UCSD_CAMPUS_CENTER.longitude, UCSD_CAMPUS_CENTER.latitude])
            .addTo(map)

          if (!cancelled) {
            setStatus('ready')
          }
        })
      } catch (mapError) {
        if (cancelled) {
          return
        }

        setError(mapError instanceof Error ? mapError.message : 'Unable to load the campus map.')
        setStatus('error')
      }
    }

    void setupMap()

    return () => {
      cancelled = true
      markerRef.current?.remove?.()
      markerRef.current = null
      popupRef.current?.remove?.()
      popupRef.current = null
      mapRef.current?.remove?.()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const marker = markerRef.current
    const popup = popupRef.current

    if (!map || !marker) {
      return
    }

    const activeLocation = selectedLocation ?? {
      displayName: 'UCSD Campus',
      helperText: 'Centered on the middle of campus while you browse events.',
      coordinates: UCSD_CAMPUS_CENTER,
      confidence: 0.2,
      source: 'fallback' as const,
      query: 'ucsd campus',
    }

    const position = {
      lng: activeLocation.coordinates.longitude,
      lat: activeLocation.coordinates.latitude,
    }

    marker.setLngLat([position.lng, position.lat])

    map.easeTo({
      center: [position.lng, position.lat],
      zoom: activeLocation.confidence >= 0.75 ? UCSD_DEFAULT_ZOOM + 1 : UCSD_DEFAULT_ZOOM,
      pitch: 0,
      bearing: 0,
      duration: 800,
    })

    if (!selectedLocation) {
      popup?.remove?.()
      return
    }

    popup
      ?.setLngLat([position.lng, position.lat])
      .setHTML(
        `<div style="max-width:220px"><strong>${escapeHtml(activeLocation.displayName)}</strong><div style="margin-top:6px;color:#5b6470;font-size:12px;line-height:1.4">${escapeHtml(activeLocation.helperText ?? 'Highlighted destination')}</div></div>`,
      )
      .addTo(map)
  }, [selectedLocation])

  return (
    <div className={cn('relative h-full min-h-[24rem] overflow-hidden rounded-3xl border border-border/60 bg-card', className)}>
      <div ref={containerRef} className="h-full w-full" />

      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="text-center">
            <MapPin className="mx-auto mb-3 h-8 w-8 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">Loading UCSD campus map...</p>
            <p className="mt-1 text-xs text-muted-foreground">Loading Mapbox terrain so you can see where to go on campus.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 px-6 text-center">
          <div>
            <p className="text-sm font-semibold text-foreground">Map unavailable</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error ?? 'We could not load the campus map right now.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
