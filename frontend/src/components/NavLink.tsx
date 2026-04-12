import { NavLink as RouterNavLink, type NavLinkProps } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AppNavLinkProps extends Omit<NavLinkProps, 'className'> {
  className?: string
}

export function AppNavLink({ className, children, ...props }: AppNavLinkProps) {
  return (
    <RouterNavLink
      className={({ isActive }) =>
        cn(
          buttonVariants({ variant: isActive ? 'pill-active' : 'ghost', size: 'sm' }),
          className,
        )
      }
      {...props}
    >
      {children}
    </RouterNavLink>
  )
}
