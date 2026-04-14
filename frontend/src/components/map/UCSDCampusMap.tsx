import { MapPin } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useArcGISWebMap } from '@/hooks/useArcGISWebMap'
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
  const { status, error, runtime } = useArcGISWebMap({
    containerRef,
    selectedLocation,
  })

  useEffect(() => {
    onRuntimeReady?.(runtime)
  }, [onRuntimeReady, runtime])

  return (
    <div className={cn('relative h-full min-h-[24rem] overflow-hidden rounded-3xl border border-border/60 bg-card', className)}>
      <div ref={containerRef} className="h-full w-full" />

      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="text-center">
            <MapPin className="mx-auto mb-3 h-8 w-8 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">Loading UCSD campus map...</p>
            <p className="mt-1 text-xs text-muted-foreground">Pulling the live ArcGIS WebMap and campus layers.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 px-6 text-center">
          <div>
            <p className="text-sm font-semibold text-foreground">Map unavailable</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error ?? 'We could not load the UCSD map right now.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
