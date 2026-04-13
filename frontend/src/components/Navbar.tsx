import { Link, NavLink, useLocation } from 'react-router-dom'
import { Home, Compass, CalendarDays, Map, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Start Here', to: '/dashboard' },
  { label: 'Events', to: '/events' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Map', to: '/map' },
]

const mobileLinks = [
  { label: 'Start Here', to: '/dashboard', icon: Home },
  { label: 'Events', to: '/events', icon: Compass },
  { label: 'Calendar', to: '/calendar', icon: CalendarDays },
  { label: 'Map', to: '/map', icon: Map },
  { label: 'Profile', to: '/profile', icon: User },
]

export function Navbar() {
  const location = useLocation()
  const { isAuthenticated, profile, user } = useAuth()

  // Don't show navbar on landing/auth/onboarding pages
  const hidden = ['/', '/auth', '/onboarding'].includes(location.pathname)
  if (hidden) return null

  const profileInitial =
    profile?.full_name.trim().charAt(0) ||
    user?.email?.trim()?.charAt(0)?.toUpperCase() ||
    'F'

  return (
    <>
      {/* Desktop / Top Bar */}
      <header className="sticky top-0 z-40 h-14 border-b border-border/40 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-full max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="text-lg font-bold text-primary tracking-tight">
            FirstStep
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 px-4 py-1.5 cursor-pointer',
                    isActive
                      ? 'bg-foreground text-background shadow-sm'
                      : 'hover:bg-secondary hover:text-foreground text-foreground/70',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <Button asChild variant="coral" size="sm" className="hidden md:inline-flex rounded-full">
                <Link to="/auth">Sign Up</Link>
              </Button>
            )}
            <Link
              to="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
              aria-label="Profile"
            >
              {profileInitial}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-border/40 bg-card/95 backdrop-blur-xl"
      >
        <div className="flex items-stretch h-16">
          {mobileLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    className={cn(
                      'h-5 w-5 transition-all duration-150',
                      isActive ? 'text-primary scale-110' : 'text-muted-foreground',
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      'text-[10px] transition-all duration-150',
                      isActive ? 'text-primary font-semibold' : 'text-muted-foreground',
                    )}
                  >
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-primary/60" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
