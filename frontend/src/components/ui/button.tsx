import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'default' &&
          'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/25',
        variant === 'outline' &&
          'border border-white/10 bg-white/5 text-white hover:bg-white/10',
        variant === 'ghost' && 'text-slate-400 hover:text-white hover:bg-white/5',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-7 py-3 text-base',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
