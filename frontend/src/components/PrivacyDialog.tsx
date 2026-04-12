import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PrivacyDialogProps {
  children: React.ReactNode
}

const sections = [
  {
    title: 'Information We Collect',
    content:
      'We collect information you provide directly, such as your name, email address, college, interests, and event RSVPs. We also collect usage data including pages visited and features used to improve your experience.',
  },
  {
    title: 'How We Use Your Information',
    content:
      'Your information is used to personalize event recommendations, track your campus involvement progress, send event reminders you\'ve opted into, and improve the FirstStep platform for all UCSD students.',
  },
  {
    title: 'Data Sharing',
    content:
      'We do not sell your personal information. We may share anonymized, aggregated data with UCSD administrators to improve campus programming. Event organizers can see RSVP counts but not individual identities.',
  },
  {
    title: 'Data Security',
    content:
      'Your data is stored securely using industry-standard encryption. We use HTTPS for all data transmission. Access to personal data is restricted to authorized team members only.',
  },
  {
    title: 'Your Rights',
    content:
      'You may request to view, correct, or delete your personal data at any time by contacting us. You can also adjust your privacy settings in the Profile page to control what information is visible.',
  },
  {
    title: 'Contact',
    content:
      'For privacy-related questions or requests, please contact us at privacy@firststep.ucsd.edu. We will respond within 5 business days.',
  },
]

export function PrivacyDialog({ children }: PrivacyDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">Last updated: April 12, 2026</p>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="flex flex-col gap-5">
            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold text-foreground mb-1.5">{section.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
