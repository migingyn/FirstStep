import { Button } from '@/components/ui/button'
import { categories } from '@/data/mockData'

interface CategoryPillsProps {
  selected: string
  onSelect: (category: string) => void
}

export function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
  return (
    <div
      role="tablist"
      aria-label="Event categories"
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {categories.map((cat) => (
        <Button
          key={cat}
          role="tab"
          aria-selected={selected === cat}
          variant={selected === cat ? 'pill-active' : 'pill'}
          size="sm"
          onClick={() => onSelect(cat)}
          className="shrink-0"
        >
          {cat}
        </Button>
      ))}
    </div>
  )
}
