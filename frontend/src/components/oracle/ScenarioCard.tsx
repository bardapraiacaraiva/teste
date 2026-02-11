import type { ReactNode } from 'react'
import { cn, formatCurrency } from '@/lib/utils'

interface ScenarioCardProps {
  name: string
  totalRevenue: number
  totalProfit: number
  totalIrc: number
  totalNetProfit: number
  profitMargin: number
  ircEffectiveRate: number
  color: string       // tailwind border color class e.g. 'border-emerald-500'
  icon: ReactNode
}

export function ScenarioCard({
  name,
  totalRevenue,
  totalProfit,
  totalIrc,
  totalNetProfit,
  profitMargin,
  ircEffectiveRate,
  color,
  icon,
}: ScenarioCardProps) {
  // Determine text accent color from the border color
  const textColor = color.includes('emerald')
    ? 'text-emerald-400'
    : color.includes('blue')
    ? 'text-blue-400'
    : 'text-red-400'

  const bgGlow = color.includes('emerald')
    ? 'from-emerald-500/5 to-transparent'
    : color.includes('blue')
    ? 'from-blue-500/5 to-transparent'
    : 'from-red-500/5 to-transparent'

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl',
        'border-t-4 transition-all duration-300 hover:bg-white/[0.08] hover:shadow-lg',
        color
      )}
    >
      {/* Subtle gradient glow */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-b opacity-50',
          bgGlow
        )}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <span className={cn('text-2xl', textColor)}>{icon}</span>
          <div>
            <h3 className={cn('text-lg font-bold', textColor)}>
              Cenario {name}
            </h3>
            <p className="text-xs text-slate-500">Projecao a 36 meses</p>
          </div>
        </div>

        {/* Primary metrics — 2x2 grid */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <MetricCell label="Receita Total" value={formatCurrency(totalRevenue)} />
          <MetricCell label="Lucro Total" value={formatCurrency(totalProfit)} />
          <MetricCell
            label="IRC a Pagar"
            value={formatCurrency(totalIrc)}
            highlight="warning"
          />
          <MetricCell
            label="Lucro Liquido"
            value={formatCurrency(totalNetProfit)}
            highlight={totalNetProfit >= 0 ? 'success' : 'danger'}
          />
        </div>

        {/* Secondary metrics */}
        <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 border border-white/5">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-wider text-slate-500">
              Margem
            </p>
            <p className={cn('text-sm font-bold', textColor)}>
              {profitMargin.toFixed(1)}%
            </p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-wider text-slate-500">
              Taxa IRC Efetiva
            </p>
            <p className={cn('text-sm font-bold', textColor)}>
              {ircEffectiveRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Internal sub-component
// ---------------------------------------------------------------------------

function MetricCell({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: 'success' | 'warning' | 'danger'
}) {
  const valueColor =
    highlight === 'success'
      ? 'text-emerald-400'
      : highlight === 'warning'
      ? 'text-amber-400'
      : highlight === 'danger'
      ? 'text-red-400'
      : 'text-white'

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 px-3 py-3">
      <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </p>
      <p className={cn('text-base font-bold tabular-nums', valueColor)}>
        {value}
      </p>
    </div>
  )
}
