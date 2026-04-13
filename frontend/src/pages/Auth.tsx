import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import {
  clearPendingAuthFlow,
  getAuthRedirectUrl,
  getPendingAuthFlow,
  setPendingAuthFlow,
} from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, profile } = useAuth()

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return
    }

    const pendingFlow = getPendingAuthFlow()
    const from = (location.state as { from?: string } | null)?.from

    if (pendingFlow === 'signup' || (pendingFlow === 'google' && !profile?.completed_onboarding)) {
      clearPendingAuthFlow()
      navigate('/onboarding', { replace: true })
      return
    }

    clearPendingAuthFlow()
    navigate(from ?? '/dashboard', { replace: true })
  }, [isAuthenticated, isLoading, location.state, navigate, profile?.completed_onboarding])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (mode === 'signup') {
        setPendingAuthFlow('signup')

        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.name,
            },
          },
        })

        if (error) {
          throw error
        }

        if (!data.session) {
          clearPendingAuthFlow()
          toast.success('Account created. Check your email to finish signing in, then continue onboarding.')
          setMode('login')
          return
        }

        navigate('/onboarding')
        return
      }

      setPendingAuthFlow('login')
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (error) {
        throw error
      }

      navigate('/dashboard')
    } catch (error) {
      clearPendingAuthFlow()
      toast.error(error instanceof Error ? error.message : 'Unable to complete authentication.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogleSignIn() {
    try {
      setPendingAuthFlow('google')

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthRedirectUrl(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      clearPendingAuthFlow()
      toast.error(error instanceof Error ? error.message : 'Unable to start Google sign-in.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-center h-16 border-b border-border/50 bg-card/80 backdrop-blur-lg">
        <Link to="/" className="text-xl font-bold text-primary tracking-tight">
          FirstStep
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {mode === 'login'
                ? 'Sign in to access your personalized events'
                : 'Join thousands of UCSD students discovering campus life'}
            </p>
          </div>

          <div className="bg-card rounded-2xl border shadow-elevated p-8">
            <div className="flex bg-secondary rounded-full p-1 mb-7">
              {(['login', 'signup'] as const).map((viewMode) => (
                <button
                  key={viewMode}
                  type="button"
                  onClick={() => setMode(viewMode)}
                  className={cn(
                    'flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer',
                    mode === viewMode
                      ? 'bg-foreground text-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {viewMode === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === 'signup' && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="auth-name">Full Name</Label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="auth-name"
                      placeholder="Jordan Rivera"
                      className="pl-10"
                      value={form.name}
                      onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="auth-email">Email</Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="auth-email"
                    type="email"
                    placeholder="you@ucsd.edu"
                    className="pl-10"
                    value={form.email}
                    onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-password">Password</Label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="auth-password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="........"
                    className="pl-10 pr-10"
                    value={form.password}
                    onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="coral"
                size="lg"
                className="rounded-full w-full mt-1"
                disabled={submitting}
              >
                {submitting
                  ? mode === 'login'
                    ? 'Logging In...'
                    : 'Creating Account...'
                  : mode === 'login'
                    ? 'Log In'
                    : 'Create Account'}
              </Button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-[1px] bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-[1px] bg-border" />
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full gap-3"
              type="button"
              onClick={() => void handleGoogleSignIn()}
              disabled={submitting}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-primary font-medium hover:underline cursor-pointer"
              >
                {mode === 'login' ? 'Sign up free' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
