import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
  color: string
}

export function StatsCard({ title, value, change, icon: Icon, color }: StatsCardProps) {
  const isPositive = change >= 0
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 transition-all duration-300 hover:bg-white/10 hover:scale-[1.01]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <p className={cn("text-xs mt-2 font-medium", isPositive ? "text-green-400" : "text-red-400")}>
            {isPositive ? '+' : ''}{change}% vs mês anterior
          </p>
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
    </div>
  )
}
