import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline: 'border border-input bg-background hover:bg-secondary hover:border-border shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70 shadow-sm',
        ghost: 'hover:bg-secondary hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        coral: 'bg-coral text-foreground font-semibold hover:bg-coral-hover shadow-sm hover:shadow-md',
        pill: 'bg-secondary text-foreground rounded-full hover:bg-secondary/70 border border-border/60',
        'pill-active': 'bg-foreground text-background rounded-full shadow-sm',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 rounded-xl px-3.5',
        lg: 'h-12 rounded-2xl px-8 text-base',
        xl: 'h-14 rounded-2xl px-10 text-lg font-semibold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
