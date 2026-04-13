export type AuthFlow = 'login' | 'signup' | 'google'

const AUTH_FLOW_KEY = 'firststep-auth-flow'

export function getAuthRedirectUrl(): string {
  return import.meta.env.VITE_SUPABASE_AUTH_REDIRECT_URL ?? `${window.location.origin}/auth`
}

export function setPendingAuthFlow(flow: AuthFlow) {
  window.sessionStorage.setItem(AUTH_FLOW_KEY, flow)
}

export function getPendingAuthFlow(): AuthFlow | null {
  const flow = window.sessionStorage.getItem(AUTH_FLOW_KEY)

  if (flow === 'login' || flow === 'signup' || flow === 'google') {
    return flow
  }

  return null
}

export function clearPendingAuthFlow() {
  window.sessionStorage.removeItem(AUTH_FLOW_KEY)
}
