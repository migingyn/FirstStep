import { ExternalLink, AtSign, Globe } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { studentOrgs } from '@/data/mockData'
import { useStudentOrgsQuery } from '@/hooks/useStudentOrgs'

export default function StudentOrgs() {
  const { data, isLoading, isError } = useStudentOrgsQuery()
  const orgs = data ?? studentOrgs

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Campus Life</span>
          <h1 className="text-3xl font-bold text-foreground mt-2 mb-3">Student Organizations</h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            Find your community. UCSD has over 500 registered student organizations — here are some
            of the best ones for transfer students getting started.
          </p>
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground mb-6">Loading organizations from the backend...</p>
        )}

        {isError && (
          <p className="text-sm text-muted-foreground mb-6">
            Backend unavailable right now, showing the built-in organization list instead.
          </p>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {orgs.map((org) => (
            <div
              key={org.id}
              className="rounded-2xl border bg-card shadow-card p-6 flex flex-col gap-4 hover:shadow-card-hover transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                {/* Abbreviation box */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                  {org.abbreviation}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{org.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-3">
                    {org.description}
                  </p>
                </div>
              </div>

              {/* Links */}
              {(org.website || org.instagram) && (
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  {org.website && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                      Website
                      <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                    </a>
                  )}
                  {org.instagram && (
                    <a
                      href={`https://instagram.com/${org.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <AtSign className="h-3.5 w-3.5" aria-hidden="true" />
                      {org.instagram}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
