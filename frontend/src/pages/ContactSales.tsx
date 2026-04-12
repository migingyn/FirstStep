import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ContactSales() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    institution: '',
    phone: '',
    message: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">For Schools</span>
          <h1 className="text-3xl font-bold text-foreground mt-2 mb-3">
            Bring FirstStep to your campus
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Give your students a modern way to discover campus life. FirstStep's School Plan
            includes a custom event feed, engagement analytics, and dedicated support.
          </p>
        </div>

        <div className="rounded-2xl border bg-card shadow-card p-8">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">We'll be in touch!</h2>
                <p className="text-muted-foreground mt-2">
                  Thanks for reaching out. Our team will contact you within 1–2 business days.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full mt-2">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sales-name">Your Name</Label>
                  <Input
                    id="sales-name"
                    placeholder="Dr. Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sales-email">Work Email</Label>
                  <Input
                    id="sales-email"
                    type="email"
                    placeholder="jsmith@university.edu"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sales-institution">Institution</Label>
                <Input
                  id="sales-institution"
                  placeholder="UC San Diego"
                  value={form.institution}
                  onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sales-phone">
                  Phone <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="sales-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sales-message">Message</Label>
                <Textarea
                  id="sales-message"
                  placeholder="Tell us about your institution and what you're hoping to achieve..."
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" variant="coral" size="lg" className="rounded-full w-full">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
