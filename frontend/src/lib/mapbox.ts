export const MAPBOX_GL_JS_VERSION = '3.19.1'
export const MAPBOX_SCRIPT_ID = 'firststep-mapbox-script'
export const MAPBOX_STYLE_ID = 'firststep-mapbox-style'

declare global {
  interface Window {
    mapboxgl?: any
    __firstStepMapboxLoader?: Promise<void>
  }
}

export function getMapboxAccessToken() {
  return import.meta.env.VITE_MAPBOX_ACCESS_TOKEN?.trim() ?? ''
}

function ensureMapboxStylesheet() {
  if (document.getElementById(MAPBOX_STYLE_ID)) {
    return
  }

  const link = document.createElement('link')
  link.id = MAPBOX_STYLE_ID
  link.rel = 'stylesheet'
  link.href = `https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_GL_JS_VERSION}/mapbox-gl.css`
  document.head.appendChild(link)
}

export async function loadMapboxGl(): Promise<void> {
  const accessToken = getMapboxAccessToken()

  if (!accessToken) {
    throw new Error('Missing VITE_MAPBOX_ACCESS_TOKEN. Add it to frontend/.env.local to load the campus map.')
  }

  if (window.mapboxgl?.Map) {
    return
  }

  if (window.__firstStepMapboxLoader) {
    return window.__firstStepMapboxLoader
  }

  ensureMapboxStylesheet()

  window.__firstStepMapboxLoader = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(MAPBOX_SCRIPT_ID) as HTMLScriptElement | null
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Mapbox GL JS failed to load.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = MAPBOX_SCRIPT_ID
    script.async = true
    script.defer = true
    script.src = `https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_GL_JS_VERSION}/mapbox-gl.js`
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Mapbox GL JS failed to load.'))
    document.head.appendChild(script)
  })

  await window.__firstStepMapboxLoader

  if (!window.mapboxgl?.Map) {
    throw new Error('Mapbox GL JS did not finish initializing.')
  }

  window.mapboxgl.accessToken = accessToken
}
