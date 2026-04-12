import { useState } from 'react'
import {
  User,
  LogOut,
  ChevronDown,
  Bell,
  Shield,
  Lock,
  Trash2,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useProgress } from '@/contexts/ProgressContext'
import { cn } from '@/lib/utils'

const profile = {
  name: 'Jordan Rivera',
  email: 'jrivera@ucsd.edu',
  major: 'Computer Science',
  college: 'Warren College',
  year: 'Junior (Transfer)',
  interests: ['Social Events', 'Career & Networking', 'Academic', 'Casual Hangouts'],
}

type SettingsSection = 'notifications' | 'privacy' | 'security' | 'danger' | null

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  )
}

function SwitchRow({ label, description, defaultChecked = false }: { label: string; description?: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  )
}

export default function Profile() {
  const { rsvpedEvents, savedCount } = useProgress()
  const [openSection, setOpenSection] = useState<SettingsSection>(null)

  function toggleSection(s: SettingsSection) {
    setOpenSection((prev) => (prev === s ? null : s))
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-2xl px-4 py-8 pb-24 md:pb-8 space-y-6">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center text-center gap-3 py-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <User className="h-10 w-10 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {profile.college} · {profile.year}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-card shadow-card p-5 text-center">
            <p className="text-3xl font-bold text-primary">{rsvpedEvents.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Events RSVPed</p>
          </div>
          <div className="rounded-2xl border bg-card shadow-card p-5 text-center">
            <p className="text-3xl font-bold text-primary">{savedCount}</p>
            <p className="text-sm text-muted-foreground mt-1">Events Saved</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="rounded-2xl border bg-card shadow-card p-6 space-y-5">
          <h2 className="font-semibold text-foreground">Profile Details</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <ReadonlyField label="Name" value={profile.name} />
            <ReadonlyField label="Email" value={profile.email} />
            <ReadonlyField label="Major" value={profile.major} />
            <ReadonlyField label="College" value={profile.college} />
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
              Interests
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-border/60 bg-secondary px-3 py-1 text-xs font-medium text-foreground"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border/50">
            <h2 className="font-semibold text-foreground">Account Settings</h2>
          </div>

          {/* Notifications */}
          <AccordionSection
            icon={Bell}
            title="Notifications"
            open={openSection === 'notifications'}
            onToggle={() => toggleSection('notifications')}
          >
            <SwitchRow label="Event Reminders" description="Get reminded 1 hour before events" defaultChecked={true} />
            <SwitchRow label="Recommendations" description="Weekly personalized event suggestions" defaultChecked={true} />
            <SwitchRow label="Org Updates" description="News from organizations you follow" defaultChecked={false} />
            <SwitchRow label="Email Digest" description="Weekly email summary of upcoming events" defaultChecked={false} />
          </AccordionSection>

          {/* Privacy */}
          <AccordionSection
            icon={Shield}
            title="Privacy"
            open={openSection === 'privacy'}
            onToggle={() => toggleSection('privacy')}
          >
            <SwitchRow label="Public Profile" description="Let other students see your profile" defaultChecked={true} />
            <SwitchRow label="Show RSVPs" description="Show events you're attending" defaultChecked={false} />
            <SwitchRow label="Show Interests" description="Display your interests on your profile" defaultChecked={true} />
          </AccordionSection>

          {/* Security */}
          <AccordionSection
            icon={Lock}
            title="Security"
            open={openSection === 'security'}
            onToggle={() => toggleSection('security')}
          >
            <div className="py-3">
              <Button variant="outline" size="sm" className="rounded-xl">
                Change Password
              </Button>
            </div>
          </AccordionSection>

          {/* Danger Zone */}
          <AccordionSection
            icon={Trash2}
            title="Danger Zone"
            open={openSection === 'danger'}
            onToggle={() => toggleSection('danger')}
            danger
          >
            <div className="py-3 space-y-2">
              <p className="text-sm text-muted-foreground">
                Deleting your account is permanent and cannot be undone. All your data will be removed.
              </p>
              <Button variant="destructive" size="sm" className="rounded-xl">
                Delete Account
              </Button>
            </div>
          </AccordionSection>
        </div>

        {/* Log Out */}
        <Button
          variant="ghost"
          size="lg"
          className="w-full rounded-2xl text-destructive hover:bg-destructive/5 hover:text-destructive gap-2"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log Out
        </Button>
      </main>
    </>
  )
}

interface AccordionSectionProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
  danger?: boolean
}

function AccordionSection({ icon: Icon, title, open, onToggle, children, danger = false }: AccordionSectionProps) {
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn('h-4 w-4', danger ? 'text-destructive' : 'text-muted-foreground')} aria-hidden="true" />
          <span className={cn('text-sm font-medium', danger ? 'text-destructive' : 'text-foreground')}>
            {title}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-6 pb-4 divide-y divide-border/50">
          {children}
        </div>
      )}
    </div>
  )
}
