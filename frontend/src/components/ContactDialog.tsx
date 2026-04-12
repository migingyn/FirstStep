import { useState } from 'react'
import { Mail } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ContactDialogProps {
  children: React.ReactNode
}

export function ContactDialog({ children }: ContactDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ email: '', subject: '', message: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (!val) {
      setTimeout(() => {
        setSubmitted(false)
        setForm({ email: '', subject: '', message: '' })
      }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>We'd love to hear from you. Send us a message below.</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Message sent!</p>
              <p className="text-sm text-muted-foreground mt-1">We'll get back to you within 24 hours.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="you@ucsd.edu"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-subject">Subject</Label>
              <Input
                id="contact-subject"
                placeholder="How can we help?"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                placeholder="Tell us what's on your mind..."
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" variant="coral" className="rounded-full w-full">
              Send Message
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
