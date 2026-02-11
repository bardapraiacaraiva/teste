import { cn } from "@/lib/utils"

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className }: LogoProps) {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' }
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn(sizes[size], "font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-amber-400 bg-clip-text text-transparent")}>
        L.U.C.A.S
      </span>
      <span className={cn(size === 'lg' ? 'text-lg' : 'text-xs', "text-slate-400 font-light")}>v2.0</span>
    </div>
  )
}
