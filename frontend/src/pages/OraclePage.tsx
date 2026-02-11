import { useState } from 'react'
import {
  Sparkles,
  Play,
  RotateCcw,
  TrendingUp,
  Target,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Zap,
} from 'lucide-react'

import { PageHeader } from '@/components/shared/PageHeader'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useOracle } from '@/hooks/useOracle'
import { ScenarioCard } from '@/components/oracle/ScenarioCard'
import { MonteCarloChart } from '@/components/oracle/MonteCarloChart'
import { formatCurrency } from '@/lib/utils'
import type { SimulationParams } from '@/services/mock/oracleService'

// ---------------------------------------------------------------------------
// Default parameters
// ---------------------------------------------------------------------------

const DEFAULTS: SimulationParams = {
  revenue: 500000,
  costs: 350000,
  taxRate: 21,
  growthRate: 5,
  volatility: 15,
}

// ---------------------------------------------------------------------------
// Slider config
// ---------------------------------------------------------------------------

interface SliderConfig {
  key: keyof SimulationParams
  label: string
  min: number
  max: number
  step: number
  unit: string
  format: (v: number) => string
}

const SLIDERS: SliderConfig[] = [
  {
    key: 'revenue',
    label: 'Receita Anual',
    min: 50000,
    max: 5000000,
    step: 10000,
    unit: '€',
    format: (v) => formatCurrency(v),
  },
  {
    key: 'costs',
    label: 'Custos Anuais',
    min: 10000,
    max: 4000000,
    step: 10000,
    unit: '€',
    format: (v) => formatCurrency(v),
  },
  {
    key: 'taxRate',
    label: 'Taxa IRC',
    min: 10,
    max: 35,
    step: 0.5,
    unit: '%',
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: 'growthRate',
    label: 'Taxa de Crescimento',
    min: -10,
    max: 30,
    step: 0.5,
    unit: '%',
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: 'volatility',
    label: 'Volatilidade',
    min: 1,
    max: 50,
    step: 1,
    unit: '%',
    format: (v) => `${v}%`,
  },
]

// ---------------------------------------------------------------------------
// Priority badge mapper
// ---------------------------------------------------------------------------

function priorityVariant(priority: string) {
  switch (priority) {
    case 'alta':
      return 'danger' as const
    case 'media':
      return 'warning' as const
    case 'baixa':
      return 'info' as const
    default:
      return 'default' as const
  }
}

function priorityLabel(priority: string) {
  switch (priority) {
    case 'alta':
      return 'Alta'
    case 'media':
      return 'Media'
    case 'baixa':
      return 'Baixa'
    default:
      return priority
  }
}

// ============================================================================
// OraclePage
// ============================================================================

export default function OraclePage() {
  const [params, setParams] = useState<SimulationParams>({ ...DEFAULTS })
  const { loading, progress, result, error, runSimulation, reset } = useOracle()

  const handleSliderChange = (key: keyof SimulationParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const handleRun = () => {
    runSimulation(params)
  }

  const handleReset = () => {
    reset()
    setParams({ ...DEFAULTS })
  }

  return (
    <div className="min-h-screen bg-[#0A0E27] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <PageHeader
          title="O Oraculo — Presciencia Fiscal"
          description="Motor de simulacao Monte Carlo para projecoes fiscais inteligentes. Analise cenarios e otimize a sua estrategia de IRC."
          icon={<Sparkles className="h-8 w-8 text-amber-400" />}
        />

        {/* ---------------------------------------------------------------- */}
        {/* Simulation Controls                                              */}
        {/* ---------------------------------------------------------------- */}
        <GlassCard className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <h2 className="text-base font-semibold text-white">
              Parametros da Simulacao
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SLIDERS.map((slider) => (
              <div key={slider.key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {slider.label}
                  </label>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {slider.format(params[slider.key])}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={params[slider.key]}
                  onChange={(e) =>
                    handleSliderChange(slider.key, parseFloat(e.target.value))
                  }
                  className="w-full h-2 rounded-full appearance-none bg-white/10 accent-blue-500 cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/40
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-300
                    [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125"
                  disabled={loading}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-slate-600">
                    {slider.key === 'revenue' || slider.key === 'costs'
                      ? formatCurrency(slider.min)
                      : `${slider.min}${slider.unit}`}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {slider.key === 'revenue' || slider.key === 'costs'
                      ? formatCurrency(slider.max)
                      : `${slider.max}${slider.unit}`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              onClick={handleRun}
              disabled={loading}
              size="lg"
              className="min-w-[220px]"
            >
              {loading ? (
                <>
                  <Zap className="h-4 w-4 animate-pulse" />
                  A processar...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Executar Simulacao
                </>
              )}
            </Button>

            {result && (
              <Button variant="outline" onClick={handleReset} size="lg">
                <RotateCcw className="h-4 w-4" />
                Reiniciar
              </Button>
            )}
          </div>
        </GlassCard>

        {/* ---------------------------------------------------------------- */}
        {/* Loading state                                                    */}
        {/* ---------------------------------------------------------------- */}
        {loading && (
          <GlassCard className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-5 w-5 text-cyan-400 animate-pulse" />
              <h2 className="text-base font-semibold text-white">
                Motor Monte Carlo em execucao...
              </h2>
            </div>
            <Progress value={progress} className="mb-3" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                A simular 10.000 iteracoes estocasticas com parametros personalizados
              </p>
              <span className="text-sm font-bold text-cyan-400 tabular-nums">
                {progress}%
              </span>
            </div>
          </GlassCard>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Error state                                                      */}
        {/* ---------------------------------------------------------------- */}
        {error && (
          <GlassCard className="mb-8 border-red-500/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <h3 className="text-sm font-semibold text-red-400">
                  Erro na simulacao
                </h3>
                <p className="text-xs text-slate-400 mt-1">{error}</p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Results                                                          */}
        {/* ---------------------------------------------------------------- */}
        {result && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Confidence header */}
            <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Resultado da Simulacao
                  </h2>
                  <p className="text-xs text-slate-500">
                    ID: {result.simulationId} | {new Date(result.createdAt).toLocaleString('pt-PT')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Confianca:</span>
                <span className="text-2xl font-black text-emerald-400 tabular-nums">
                  {result.confidenceScore}%
                </span>
              </div>
            </GlassCard>

            {/* 3 Scenario cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ScenarioCard
                {...result.cenarioFavoravel}
                color="border-emerald-500"
                icon={<TrendingUp className="h-6 w-6" />}
              />
              <ScenarioCard
                {...result.cenarioBase}
                color="border-blue-500"
                icon={<Target className="h-6 w-6" />}
              />
              <ScenarioCard
                {...result.cenarioRisco}
                color="border-red-500"
                icon={<AlertTriangle className="h-6 w-6" />}
              />
            </div>

            {/* Risk metrics row */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'VaR 95%', value: result.riskMetrics.var95, desc: 'Value at Risk' },
                { label: 'VaR 99%', value: result.riskMetrics.var99, desc: 'Value at Risk' },
                { label: 'CVaR 95%', value: result.riskMetrics.cvar95, desc: 'Conditional VaR' },
                { label: 'Max Drawdown', value: result.riskMetrics.maxDrawdown, desc: 'Queda maxima' },
              ].map((metric) => (
                <GlassCard key={metric.label} className="text-center py-5">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">
                    {metric.label}
                  </p>
                  <p className="text-lg font-bold text-white tabular-nums">
                    {formatCurrency(metric.value)}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-1">{metric.desc}</p>
                </GlassCard>
              ))}
            </div>

            {/* Monte Carlo chart */}
            <MonteCarloChart
              cenarioFavoravel={result.cenarioFavoravel}
              cenarioBase={result.cenarioBase}
              cenarioRisco={result.cenarioRisco}
            />

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <GlassCard>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <h2 className="text-base font-semibold text-white">
                    Recomendacoes do Oraculo
                  </h2>
                </div>

                <div className="space-y-4">
                  {result.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/5 bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.06]"
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <Badge variant={priorityVariant(rec.priority)}>
                          {priorityLabel(rec.priority)}
                        </Badge>
                        <h3 className="text-sm font-semibold text-white">
                          {rec.title}
                        </h3>
                        {rec.potentialSaving && (
                          <span className="ml-auto text-xs font-bold text-emerald-400 tabular-nums">
                            Poupanca: {rec.potentialSaving}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        {rec.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-blue-400">
                        <ChevronRight className="h-3 w-3" />
                        <span>{rec.action}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Alerts */}
            {result.alerts.length > 0 && (
              <GlassCard className="border-amber-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <h2 className="text-base font-semibold text-amber-400">
                    Alertas
                  </h2>
                </div>

                <div className="space-y-3">
                  {result.alerts.map((alert, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl bg-amber-500/5 border border-amber-500/10 px-4 py-3"
                    >
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                      <p className="text-xs text-amber-200/80 leading-relaxed">
                        {alert}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
