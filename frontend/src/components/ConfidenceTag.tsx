import { cn } from '@/lib/utils'

const colorMap: Record<string, string> = {
  'Good First Event': 'border-confidence-green/40 bg-confidence-green/10 text-confidence-green',
  'Beginner-Friendly': 'border-confidence-blue/40 bg-confidence-blue/10 text-confidence-blue',
  'Low-Pressure': 'border-confidence-yellow/40 bg-confidence-yellow/10 text-confidence-yellow',
  'No Experience Needed': 'border-confidence-blue/40 bg-confidence-blue/10 text-confidence-blue',
  'Small Group': 'border-primary/40 bg-primary/10 text-primary',
  'Come Solo Friendly': 'border-confidence-green/40 bg-confidence-green/10 text-confidence-green',
  'Drop-In': 'border-confidence-yellow/40 bg-confidence-yellow/10 text-confidence-yellow',
  'Structured Activity': 'border-primary/40 bg-primary/10 text-primary',
}

interface ConfidenceTagProps {
  tag: string
  className?: string
}

export function ConfidenceTag({ tag, className }: ConfidenceTagProps) {
  const colors = colorMap[tag] ?? 'border-border/40 bg-muted text-muted-foreground'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 hover:scale-105 hover:shadow-sm',
        colors,
        className,
      )}
    >
      {tag}
    </span>
  )
}
