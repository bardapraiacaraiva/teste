import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { Scenario } from '@/services/mock/oracleService'
import { formatCurrency } from '@/lib/utils'

interface MonteCarloChartProps {
  cenarioFavoravel: Scenario
  cenarioBase: Scenario
  cenarioRisco: Scenario
}

interface ChartDataPoint {
  month: number
  favoravel: number
  base: number
  risco: number
}

// Custom tooltip with glassmorphism styling
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: number
}) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="rounded-xl border border-white/10 bg-[#0A0E27]/95 backdrop-blur-xl p-4 shadow-2xl">
      <p className="text-xs font-semibold text-slate-400 mb-3">
        Mes {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-6 mb-1.5 last:mb-0">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-slate-300 capitalize">{entry.name}</span>
          </div>
          <span className="text-xs font-bold text-white tabular-nums">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function MonteCarloChart({
  cenarioFavoravel,
  cenarioBase,
  cenarioRisco,
}: MonteCarloChartProps) {
  // Build accumulated IRC data for each month
  const data: ChartDataPoint[] = []

  let accFav = 0
  let accBase = 0
  let accRisk = 0

  for (let i = 0; i < 36; i++) {
    accFav += cenarioFavoravel.monthlyProjections[i]?.ircDue ?? 0
    accBase += cenarioBase.monthlyProjections[i]?.ircDue ?? 0
    accRisk += cenarioRisco.monthlyProjections[i]?.ircDue ?? 0

    data.push({
      month: i + 1,
      favoravel: Math.round(accFav),
      base: Math.round(accBase),
      risco: Math.round(accRisk),
    })
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">
          Simulacao Monte Carlo — IRC Acumulado
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Projecao de IRC a pagar acumulado ao longo de 36 meses para cada cenario
        </p>
      </div>

      {/* Chart */}
      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradFavoravel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradRisco" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              tickFormatter={(v: number) => (v % 6 === 0 ? `${v}` : '')}
            />

            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M€`
                  : v >= 1000
                  ? `${(v / 1000).toFixed(0)}k€`
                  : `${v}€`
              }
              width={65}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: 12, fontSize: 12, color: '#94a3b8' }}
            />

            <Area
              type="monotone"
              dataKey="favoravel"
              name="Favoravel"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradFavoravel)"
              dot={false}
              activeDot={{ r: 4, fill: '#10b981', stroke: '#0A0E27', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="base"
              name="Base"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#gradBase)"
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6', stroke: '#0A0E27', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="risco"
              name="Risco"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#gradRisco)"
              dot={false}
              activeDot={{ r: 4, fill: '#ef4444', stroke: '#0A0E27', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
