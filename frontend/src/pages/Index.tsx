import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Zap,
  Users,
  ChevronDown,
  Menu,
  X,
  Check,
  ArrowRight,
  CalendarDays,
  Bookmark,
  MapPinned,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactDialog } from '@/components/ContactDialog'
import { PrivacyDialog } from '@/components/PrivacyDialog'
import { cn } from '@/lib/utils'

const heroPreviewTabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'events', label: 'Events' },
  { id: 'map', label: 'Map' },
] as const

// ─── Scroll animation hook ────────────────────────────────────────────────────
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setIsVisible(true) },
      { threshold: 0.15 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, isVisible }
}

// ─── Hero Preview ─────────────────────────────────────────────────────────────
function HeroPreview() {
  const [activeTab, setActiveTab] = useState<(typeof heroPreviewTabs)[number]['id']>('dashboard')

  useEffect(() => {
    const cycle = window.setInterval(() => {
      setActiveTab((current) => {
        const currentIndex = heroPreviewTabs.findIndex((tab) => tab.id === current)
        return heroPreviewTabs[(currentIndex + 1) % heroPreviewTabs.length].id
      })
    }, 3500)

    return () => window.clearInterval(cycle)
  }, [])

  const dashboardTasks = [
    {
      title: 'Attend Your First Event',
      meta: '1 step away from completing your welcome path',
      status: 'Recommended',
      icon: CalendarDays,
      tone: 'text-primary bg-primary/10',
    },
    {
      title: 'Save 3 Events You Like',
      meta: '2/3 saved so far',
      status: 'In Progress',
      icon: Bookmark,
      tone: 'text-confidence-green bg-confidence-green/10',
    },
    {
      title: 'Explore the Campus Map',
      meta: 'Find events close to class',
      status: 'New',
      icon: MapPinned,
      tone: 'text-coral bg-coral/15',
    },
  ]

  const eventCards = [
    {
      title: 'Transfer Welcome Mixer',
      time: 'Apr 15 · 5:00 PM',
      note: 'Good First Event',
    },
    {
      title: 'Resume Lab',
      time: 'Apr 16 · 3:00 PM',
      note: 'Small Group',
    },
    {
      title: 'Salsa Social Night',
      time: 'Apr 17 · 7:30 PM',
      note: 'Come Solo Friendly',
    },
  ]

  return (
    <div className="relative mx-auto flex w-full max-w-[42rem] items-center justify-center py-6 md:py-8">
      <div className="absolute -left-4 top-4 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-2 right-0 h-40 w-40 rounded-full bg-coral/20 blur-3xl" />
      <div className="relative w-full overflow-hidden rounded-[2rem] border border-foreground/10 bg-card/95 p-3 shadow-elevated backdrop-blur-sm md:p-4">
        <div className="rounded-[1.6rem] border border-border/70 bg-background">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">FirstStep</p>
              <p className="text-xs text-muted-foreground">Preview of your first week at UCSD</p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              {heroPreviewTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-foreground text-background'
                      : 'bg-secondary text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-5">
            <div className="mb-4 flex flex-wrap gap-2 md:hidden">
              {heroPreviewTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-foreground text-background'
                      : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-teal-light p-3">
                <p className="text-xs text-muted-foreground">Recommended</p>
                <p className="mt-1 text-2xl font-bold text-foreground">12</p>
              </div>
              <div className="rounded-2xl bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Saved Events</p>
                <p className="mt-1 text-2xl font-bold text-foreground">3</p>
              </div>
              <div className="rounded-2xl bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Confidence Match</p>
                <p className="mt-1 text-2xl font-bold text-foreground">92%</p>
              </div>
            </div>

            <div className="min-h-[21rem] transition-all duration-300">
              {activeTab === 'dashboard' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-foreground">Start Here This Week</p>
                      <p className="text-sm text-muted-foreground">
                        A more realistic view of the guided dashboard students actually use.
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      1/3 complete
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full w-1/3 rounded-full bg-primary transition-all duration-500" />
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    {dashboardTasks.map((task) => (
                      <div key={task.title} className="rounded-2xl border border-border/70 bg-card p-4 shadow-card">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', task.tone)}>
                            <task.icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <span className="rounded-full border border-border/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                            {task.status}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{task.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{task.meta}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-foreground">Recommended For You</p>
                      <p className="text-sm text-muted-foreground">
                        Event cards reflect the same confidence-tagged browsing experience as the app.
                      </p>
                    </div>
                    <span className="hidden items-center gap-1 text-sm font-medium text-primary md:inline-flex">
                      See all <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {eventCards.map((event) => (
                      <div key={event.title} className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card">
                        <div className="h-24 bg-gradient-to-r from-primary/85 via-primary to-confidence-blue/70" />
                        <div className="space-y-2 p-4">
                          <span className="inline-flex rounded-full bg-confidence-green/10 px-2.5 py-1 text-[11px] font-semibold text-confidence-green">
                            {event.note}
                          </span>
                          <p className="text-sm font-semibold text-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'map' && (
                <div className="animate-fade-in">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-foreground">Campus Map</p>
                      <p className="text-sm text-muted-foreground">
                        Students can explore nearby events before heading across campus.
                      </p>
                    </div>
                    <span className="rounded-full bg-coral/15 px-3 py-1 text-xs font-semibold text-foreground">
                      Live hotspots
                    </span>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
                    <div className="relative min-h-[16rem] overflow-hidden rounded-[1.5rem] border border-border/70 bg-[radial-gradient(circle_at_top,_rgba(10,103,163,0.10),_transparent_38%),linear-gradient(135deg,_rgba(255,255,255,0.95),_rgba(240,247,251,0.95))] p-5">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(10,103,163,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(10,103,163,0.08)_1px,transparent_1px)] bg-[size:38px_38px] opacity-40" />
                      <div className="relative flex h-full items-center justify-center">
                        <div className="grid w-full max-w-md grid-cols-3 gap-4">
                          {[
                            'Library Walk',
                            'Price Center',
                            'RIMAC',
                            'Sun God Lawn',
                            'Career Center',
                            'Matthews Quad',
                          ].map((label, index) => (
                            <div
                              key={label}
                              className={cn(
                                'rounded-2xl border px-3 py-4 text-center text-xs font-medium shadow-soft',
                                index % 2 === 0
                                  ? 'border-primary/20 bg-white text-foreground'
                                  : 'border-coral/20 bg-coral/10 text-foreground',
                              )}
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        ['Career Fair', '8 min walk from Center Hall'],
                        ['Board Game Social', 'Near Price Center East'],
                        ['Transfer Meetup', 'Popular with solo attendees'],
                      ].map(([title, meta]) => (
                        <div key={title} className="rounded-2xl border border-border/70 bg-card p-4 shadow-card">
                          <p className="text-sm font-semibold text-foreground">{title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{meta}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn('px-4 py-20 md:py-28', className)}>
      <div className="container mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Index() {
  const [activeSection, setActiveSection] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation()
  const { ref: howRef, isVisible: howVisible } = useScrollAnimation()
  const { ref: storiesRef, isVisible: storiesVisible } = useScrollAnimation()

  // Active section tracking
  useEffect(() => {
    const ids = ['features', 'how-it-works', 'stories', 'membership']
    const observers: IntersectionObserver[] = []
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry?.isIntersecting) setActiveSection(id) },
        { threshold: 0.15 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Stories', href: '#stories' },
    { label: 'Membership', href: '#membership' },
  ]

  const features = [
    {
      icon: Sparkles,
      iconClass: 'bg-primary/10 text-primary',
      title: 'Smart Recommendations',
      desc: 'Get events curated for your major, college, and interests. No noise — just what fits your life.',
    },
    {
      icon: Zap,
      iconClass: 'bg-confidence-green/10 text-confidence-green',
      title: 'Confidence Tags',
      desc: '"Come Solo Friendly." "Low-Pressure." Know exactly what to expect before you walk in the door.',
    },
    {
      icon: Users,
      iconClass: 'bg-coral/10 text-coral',
      title: 'Easy RSVP',
      desc: 'RSVP in one tap, sync to your calendar, and track everything in one place. No app-hopping.',
    },
  ]

  const steps = [
    {
      num: '01',
      icon: Users,
      title: 'Build your profile',
      desc: 'Tell us your college, major, and what you\'re into. Takes 2 minutes.',
    },
    {
      num: '02',
      icon: Sparkles,
      title: 'Get curated events',
      desc: 'We surface events matched to your profile, with confidence tags on every one.',
    },
    {
      num: '03',
      icon: Check,
      title: 'Show up with confidence',
      desc: 'RSVP, add to calendar, and walk in knowing exactly what to expect.',
    },
  ]

  const testimonials = [
    {
      quote: 'I came to UCSD knowing nobody. FirstStep helped me find my people in the first two weeks. The Transfer Mixer changed everything.',
      name: 'Priya K.',
      role: 'Revelle College · Biology Transfer',
    },
    {
      quote: 'The confidence tags are so smart. I\'m introverted and "Come Solo Friendly" made all the difference. I went to 3 events my first quarter.',
      name: 'Marcus T.',
      role: 'Warren College · CS Transfer',
    },
    {
      quote: '"Small Group" on the Resume Workshop finally got me to go. I landed an internship from a connection I made there.',
      name: 'Sofia R.',
      role: 'Marshall College · Econ Transfer',
    },
  ]

  const faqItems = [
    {
      q: 'How is this different from the UCSD events calendar?',
      a: 'The UCSD events calendar shows everything — hundreds of unfiltered events with no context. FirstStep curates based on your profile and adds confidence tags so you know exactly what to expect, which is game-changing for new students.',
    },
    {
      q: 'Do I need a ucsd.edu email to sign up?',
      a: 'Yes — a ucsd.edu email is required to verify you\'re a current UCSD student. This keeps the community genuine and focused on students who are actually on campus.',
    },
    {
      q: 'Is my RSVP data private?',
      a: 'Absolutely. Event organizers only see anonymous RSVP counts, never individual identities. Your personal activity is never shared without your explicit consent, and you can control all privacy settings from your profile.',
    },
  ]

  const studentFeatures = [
    'Browse all campus events',
    'Confidence tags on every event',
    '1-click RSVP with calendar sync',
    'Save & bookmark events',
  ]

  const schoolFeatures = [
    'Everything in Student plan',
    'Custom branded event feed',
    'Engagement analytics dashboard',
    'Priority support',
    'API access for integrations',
  ]

  return (
    <div className="min-h-screen bg-background">

      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-lg">
        <div className="container mx-auto max-w-6xl flex items-center justify-between h-16 px-4">
          <a href="#" className="text-xl font-bold text-primary tracking-tight">FirstStep</a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const sectionId = item.href.replace('#', '')
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                    activeSection === sectionId
                      ? 'text-primary underline underline-offset-4'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Log In</Link>
            </Button>
            <Button asChild variant="coral" size="sm" className="rounded-full">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-card px-4 pb-4 pt-2">
            <nav className="flex flex-col gap-1 mb-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <Button asChild variant="coral" size="lg" className="rounded-full w-full">
              <Link to="/auth">Get Started Free</Link>
            </Button>
          </div>
        )}
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-4 py-20 md:py-32 bg-gradient-to-br from-background via-secondary to-teal-light">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                  Built for UCSD transfer students
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  Discover.<br />Join.<br />
                  <span className="text-primary">Belong.</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
                  Stop scrolling through 47 apps to find your people. FirstStep puts the best
                  UCSD events in one place — with confidence tags so you always know what to expect.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="coral" size="xl" className="rounded-full">
                    <Link to="/dashboard">Start Exploring</Link>
                  </Button>
                  <Button asChild variant="outline" size="xl" className="rounded-full">
                    <Link to="/events">Browse Events</Link>
                  </Button>
                </div>
              </div>

              {/* Right: Product preview */}
              <div className="mt-2 md:mt-0">
                <HeroPreview />
              </div>
            </div>

            {/* Stats strip */}
            <div className="mt-16 rounded-2xl border bg-card shadow-card p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">200+</p>
                  <p className="text-sm text-muted-foreground mt-1">Events This Quarter</p>
                </div>
                <div className="border-x border-border">
                  <p className="text-3xl font-bold text-primary">1-Click</p>
                  <p className="text-sm text-muted-foreground mt-1">RSVP &amp; Calendar Sync</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">70%</p>
                  <p className="text-sm text-muted-foreground mt-1">Attend Solo Their First Time</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <Section id="features">
          <div ref={featuresRef}>
            <div
              className={cn(
                'transition-all duration-700',
                featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              )}
            >
              <div className="text-center mb-12">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Why FirstStep?</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                  Everything you need to get started
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((f) => (
                  <div key={f.title} className="rounded-2xl border bg-card shadow-card p-6 hover:shadow-card-hover transition-shadow duration-200">
                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl mb-4', f.iconClass)}>
                      <f.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── How It Works ─────────────────────────────────────────────────── */}
        <Section id="how-it-works" className="bg-warm-white">
          <div ref={howRef}>
            <div
              className={cn(
                'transition-all duration-700',
                howVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              )}
            >
              <div className="text-center mb-12">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">The Process</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">3 simple steps</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {steps.map((step) => (
                  <div key={step.num} className="text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                      <step.icon className="h-7 w-7 text-primary" aria-hidden="true" />
                    </div>
                    <div className="text-4xl font-bold text-primary/20 mb-2">{step.num}</div>
                    <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Testimonials ─────────────────────────────────────────────────── */}
        <Section id="stories">
          <div ref={storiesRef}>
            <div
              className={cn(
                'transition-all duration-700',
                storiesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              )}
            >
              <div className="text-center mb-12">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Success Stories</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">What students say</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                  <div key={t.name} className="rounded-2xl border bg-card shadow-card p-6 flex flex-col gap-4">
                    <p className="text-muted-foreground italic leading-relaxed text-sm">"{t.quote}"</p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Membership ───────────────────────────────────────────────────── */}
        <Section id="membership" className="bg-warm-white">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">Simple, honest pricing</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Student */}
            <div className="rounded-2xl border bg-card shadow-card p-8">
              <h3 className="font-bold text-foreground text-xl mb-1">Student</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground mb-1">/forever</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">For UCSD students, always free.</p>
              <ul className="space-y-3 mb-8">
                {studentFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="h-4 w-4 text-confidence-green shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="coral" size="lg" className="rounded-full w-full">
                <Link to="/dashboard">Get Started Free</Link>
              </Button>
            </div>

            {/* School */}
            <div className="rounded-2xl border-2 border-primary bg-card shadow-elevated p-8 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  For Institutions
                </span>
              </div>
              <h3 className="font-bold text-foreground text-xl mb-1">School</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-bold text-foreground">$2,500</span>
                <span className="text-muted-foreground mb-1">/year</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Per campus, billed annually.</p>
              <ul className="space-y-3 mb-8">
                {schoolFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" size="lg" className="rounded-full w-full">
                <Link to="/contact-sales">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </Section>

        {/* ── Dark CTA ─────────────────────────────────────────────────────── */}
        <section className="px-4 py-20 bg-foreground">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
              Ready to take your first step?
            </h2>
            <p className="text-background/60 mb-8 text-lg">
              Join hundreds of UCSD transfer students who found their community on campus.
            </p>
            <Button asChild variant="coral" size="xl" className="rounded-full">
              <Link to="/dashboard">Get Started Free</Link>
            </Button>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <Section id="faq">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Frequently asked questions</h2>
            </div>
            <div className="space-y-2">
              {faqItems.map((item, i) => (
                <div key={i} className="rounded-2xl border bg-card overflow-hidden">
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-secondary/50 transition-colors"
                    aria-expanded={faqOpen === i}
                  >
                    <span className="font-medium text-foreground text-sm pr-4">{item.q}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200',
                        faqOpen === i && 'rotate-180',
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  {faqOpen === i && (
                    <div className="px-6 pb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 bg-card px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <p className="text-lg font-bold text-primary mb-2">FirstStep</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Helping UCSD transfer students discover, join, and belong from day one.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Navigation</p>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <a key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Campus */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Campus</p>
              <div className="flex flex-col gap-2">
                <a href="https://events.ucsd.edu" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Events Calendar
                </a>
                <Link to="/student-orgs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Student Orgs
                </Link>
                <a href="https://career.ucsd.edu" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Career Center
                </a>
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Company</p>
              <div className="flex flex-col gap-2">
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
                <ContactDialog>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left cursor-pointer">
                    Contact
                  </button>
                </ContactDialog>
                <PrivacyDialog>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left cursor-pointer">
                    Privacy
                  </button>
                </PrivacyDialog>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} FirstStep. Built for UCSD transfer students.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">Made with care at UCSD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
