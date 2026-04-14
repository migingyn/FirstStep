import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Briefcase,
  BookOpen,
  Music,
  Trophy,
  Heart,
  Coffee,
  GraduationCap,
  Sparkles,
  Check,
  ChevronLeft,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { saveOnboardingProfile } from '@/lib/profiles'
import { cn } from '@/lib/utils'

const colleges = ['Revelle', 'Muir', 'Marshall', 'Warren', 'Roosevelt', 'Sixth', 'Seventh', 'Eighth']

const interests = [
  { label: 'Social Events', icon: Users },
  { label: 'Career & Networking', icon: Briefcase },
  { label: 'Academic', icon: BookOpen },
  { label: 'Arts & Culture', icon: Music },
  { label: 'Sports & Fitness', icon: Trophy },
  { label: 'Wellness', icon: Heart },
  { label: 'Casual Hangouts', icon: Coffee },
  { label: 'Student Orgs', icon: GraduationCap },
]

const goals = [
  { label: 'Make friends', description: 'Meet people who get the transfer experience' },
  { label: 'Build my network', description: 'Find professional connections and mentors' },
  { label: 'Explore campus', description: 'Discover everything UCSD has to offer' },
  { label: 'Find my community', description: 'Connect with students who share your passions' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { profile, refreshProfile, user } = useAuth()
  const [step, setStep] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [data, setData] = useState({
    name: '',
    college: '',
    interests: [] as string[],
    goal: '',
  })

  useEffect(() => {
    if (!profile) {
      return
    }

    setData((current) => ({
      name: current.name || profile.full_name,
      college: current.college || profile.college,
      interests: current.interests.length > 0 ? current.interests : profile.interests,
      goal: current.goal || profile.goal,
    }))
  }, [profile])

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return data.name.trim().length > 0
      case 1:
        return data.college !== ''
      case 2:
        return data.interests.length > 0
      case 3:
        return data.goal !== ''
      default:
        return false
    }
  }

  async function persistProfile(completedOnboarding: boolean) {
    if (!user) {
      toast.error('You need to be signed in to complete onboarding.')
      return
    }

    setIsSaving(true)

    try {
      await saveOnboardingProfile(user.id, {
        fullName: data.name,
        college: data.college,
        interests: data.interests,
        goal: data.goal,
        completedOnboarding,
      })
      await refreshProfile()
      navigate('/dashboard')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unable to save onboarding right now.'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  function handleNext() {
    if (step < 3) {
      setStep((current) => current + 1)
      return
    }

    void persistProfile(true)
  }

  function toggleInterest(label: string) {
    setData((current) => ({
      ...current,
      interests: current.interests.includes(label)
        ? current.interests.filter((interest) => interest !== label)
        : [...current.interests, label],
    }))
  }

  const selectionClass = (selected: boolean) =>
    cn(
      'relative flex items-center gap-3 rounded-2xl border p-4 cursor-pointer text-left transition-all duration-150',
      selected
        ? 'border-primary bg-primary/5 shadow-sm'
        : 'border-border/60 hover:border-border hover:bg-secondary/50',
    )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between h-16 px-6 border-b border-border/50">
        <span className="text-lg font-bold text-primary">FirstStep</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => void persistProfile(true)}
          disabled={isSaving}
        >
          Skip for now
        </Button>
      </header>

      <div className="h-0.5 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-400"
          style={{ width: `${((step + 1) / 4) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-12 overflow-y-auto">
        <div key={step} className="w-full max-w-lg animate-fade-in">
          {step === 0 && (
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">What should we call you?</h1>
              <p className="text-muted-foreground mb-8">We'll use this to personalize your experience.</p>
              <input
                type="text"
                placeholder="Your first name"
                autoFocus
                value={data.name}
                onChange={(e) => setData((current) => ({ ...current, name: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
                className="w-full text-2xl font-medium bg-transparent border-0 border-b-2 border-border focus:border-primary outline-none pb-3 placeholder:text-muted-foreground/50 transition-colors"
              />
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Which college are you in?</h1>
              <p className="text-muted-foreground mb-8">This helps us show events near you.</p>
              <div className="grid grid-cols-2 gap-3">
                {colleges.map((college) => {
                  const selected = data.college === college
                  return (
                    <button
                      key={college}
                      onClick={() => setData((current) => ({ ...current, college }))}
                      className={selectionClass(selected)}
                    >
                      <span className="font-medium text-sm">{college}</span>
                      {selected && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Check className="h-4 w-4 text-primary" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">What are you into?</h1>
              <p className="text-muted-foreground mb-8">Select everything that applies. You can change this later.</p>
              <div className="grid grid-cols-2 gap-3">
                {interests.map(({ label, icon: Icon }) => {
                  const selected = data.interests.includes(label)
                  return (
                    <button
                      key={label}
                      onClick={() => toggleInterest(label)}
                      className={selectionClass(selected)}
                    >
                      <Icon
                        className={cn('h-4 w-4 shrink-0', selected ? 'text-primary' : 'text-muted-foreground')}
                        aria-hidden="true"
                      />
                      <span className="font-medium text-sm">{label}</span>
                      {selected && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Check className="h-4 w-4 text-primary" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {data.name ? `What's your main goal, ${data.name}?` : "What's your main goal?"}
              </h1>
              <p className="text-muted-foreground mb-8">We'll focus your recommendations around this.</p>
              <div className="flex flex-col gap-3">
                {goals.map(({ label, description }) => {
                  const selected = data.goal === label
                  return (
                    <button
                      key={label}
                      onClick={() => setData((current) => ({ ...current, goal: label }))}
                      className={cn(
                        'relative flex flex-col items-start rounded-2xl border p-4 cursor-pointer text-left transition-all duration-150',
                        selected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border/60 hover:border-border hover:bg-secondary/50',
                      )}
                    >
                      <span className="font-medium text-sm text-foreground">{label}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{description}</span>
                      {selected && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Check className="h-4 w-4 text-primary" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-10">
            {step > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep((current) => current - 1)}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            <span className="text-sm text-muted-foreground">{step + 1} of 4</span>

            {step < 3 ? (
              <Button onClick={handleNext} disabled={!canProceed()} className="rounded-full">
                Continue
              </Button>
            ) : (
              <Button
                variant="coral"
                onClick={handleNext}
                disabled={!canProceed() || isSaving}
                className="rounded-full gap-2"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {isSaving ? 'Saving...' : 'Get Started'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
