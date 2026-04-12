import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  useEffect(() => {
    console.error('404 - Page not found:', window.location.pathname)
  }, [])

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4 leading-none">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-3">Oops! Page not found</h2>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild variant="coral" size="lg" className="rounded-full">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
