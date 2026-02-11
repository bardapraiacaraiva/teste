import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variant === 'default' && 'bg-slate-500/20 text-slate-300',
        variant === 'success' && 'bg-emerald-500/20 text-emerald-400',
        variant === 'warning' && 'bg-amber-500/20 text-amber-400',
        variant === 'danger' && 'bg-red-500/20 text-red-400',
        variant === 'info' && 'bg-blue-500/20 text-blue-400',
        className
      )}
    >
      {children}
    </span>
  )
}
