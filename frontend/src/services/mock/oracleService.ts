// ============================================================================
// L.U.C.A.S v2.0 - Oracle Mock Service
// Monte Carlo Simulation Engine (Client-Side)
// ============================================================================

export interface SimulationParams {
  revenue: number
  costs: number
  taxRate: number
  growthRate: number
  volatility: number
}

export interface MonthlyProjection {
  month: number
  date: string
  revenue: number
  costs: number
  ircDue: number
  netProfit: number
}

export interface Scenario {
  name: string
  totalRevenue: number
  totalProfit: number
  totalIrc: number
  totalNetProfit: number
  profitMargin: number
  ircEffectiveRate: number
  monthlyProjections: MonthlyProjection[]
}

export interface OracleResult {
  simulationId: string
  createdAt: string
  confidenceScore: number
  cenarioFavoravel: Scenario
  cenarioBase: Scenario
  cenarioRisco: Scenario
  recommendations: {
    priority: string
    title: string
    description: string
    potentialSaving: string
    action: string
  }[]
  alerts: string[]
  distribution: number[]
  riskMetrics: {
    var95: number
    var99: number
    cvar95: number
    maxDrawdown: number
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(): string {
  return `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/** Box-Muller transform for normally-distributed random numbers */
function gaussianRandom(mean: number, stdDev: number): number {
  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  return mean + z * stdDev
}

function formatMonthDate(monthOffset: number): string {
  const now = new Date()
  const future = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  return future.toISOString().slice(0, 7) // YYYY-MM
}

// ---------------------------------------------------------------------------
// Scenario generation
// ---------------------------------------------------------------------------

function generateScenarioProjections(
  params: SimulationParams,
  bias: number, // >1 favorable, 1 base, <1 risk
  volatilityMultiplier: number
): MonthlyProjection[] {
  const monthlyRevenue = params.revenue / 12
  const monthlyCosts = params.costs / 12
  const monthlyGrowthRate = params.growthRate / 100 / 12
  const vol = (params.volatility / 100) * volatilityMultiplier

  const projections: MonthlyProjection[] = []

  for (let m = 1; m <= 36; m++) {
    // Compound growth with stochastic shock
    const growthFactor = Math.pow(1 + monthlyGrowthRate * bias, m)
    const shock = gaussianRandom(1, vol)

    const revenue = Math.max(0, monthlyRevenue * growthFactor * shock * bias)
    const costShock = gaussianRandom(1, vol * 0.5)
    const costs = Math.max(0, monthlyCosts * Math.pow(1 + monthlyGrowthRate * 0.3, m) * costShock * (2 - bias))
    const profit = revenue - costs
    const ircDue = profit > 0 ? profit * (params.taxRate / 100) : 0
    const netProfit = profit - ircDue

    projections.push({
      month: m,
      date: formatMonthDate(m),
      revenue: Math.round(revenue * 100) / 100,
      costs: Math.round(costs * 100) / 100,
      ircDue: Math.round(ircDue * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
    })
  }

  return projections
}

function buildScenario(
  name: string,
  projections: MonthlyProjection[]
): Scenario {
  const totalRevenue = projections.reduce((s, p) => s + p.revenue, 0)
  const totalCosts = projections.reduce((s, p) => s + p.costs, 0)
  const totalProfit = totalRevenue - totalCosts
  const totalIrc = projections.reduce((s, p) => s + p.ircDue, 0)
  const totalNetProfit = projections.reduce((s, p) => s + p.netProfit, 0)
  const profitMargin = totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0
  const ircEffectiveRate = totalProfit > 0 ? (totalIrc / totalProfit) * 100 : 0

  return {
    name,
    totalRevenue: Math.round(totalRevenue),
    totalProfit: Math.round(totalProfit),
    totalIrc: Math.round(totalIrc),
    totalNetProfit: Math.round(totalNetProfit),
    profitMargin: Math.round(profitMargin * 10) / 10,
    ircEffectiveRate: Math.round(ircEffectiveRate * 10) / 10,
    monthlyProjections: projections,
  }
}

// ---------------------------------------------------------------------------
// Recommendations engine
// ---------------------------------------------------------------------------

function generateRecommendations(
  params: SimulationParams,
  base: Scenario
): OracleResult['recommendations'] {
  const recs: OracleResult['recommendations'] = []

  if (params.taxRate >= 21) {
    recs.push({
      priority: 'alta',
      title: 'Beneficios Fiscais PME',
      description:
        'A sua taxa de IRC de ' + params.taxRate + '% pode ser reduzida. Empresas com lucro tributavel ate 25.000€ beneficiam de taxa reduzida de 17%.',
      potentialSaving: `${Math.round(base.totalIrc * 0.12)}€/ano`,
      action: 'Rever elegibilidade para regime PME junto do contabilista certificado.',
    })
  }

  if (base.profitMargin < 15) {
    recs.push({
      priority: 'alta',
      title: 'Margem de Lucro Critica',
      description:
        'A margem liquida projetada de ' + base.profitMargin + '% esta abaixo do limiar de seguranca de 15%. Considere otimizacao de custos.',
      potentialSaving: `${Math.round(base.totalRevenue * 0.03)}€/ano`,
      action: 'Auditar estrutura de custos e renegociar contratos com fornecedores.',
    })
  }

  recs.push({
    priority: 'media',
    title: 'Pagamentos por Conta',
    description:
      'Com base na simulacao, recomenda-se provisionar pagamentos por conta trimestrais para evitar juros compensatorios.',
    potentialSaving: `${Math.round(base.totalIrc * 0.04)}€/ano`,
    action: 'Configurar pagamentos por conta automaticos no portal das Financas.',
  })

  if (params.volatility > 20) {
    recs.push({
      priority: 'alta',
      title: 'Volatilidade Elevada',
      description:
        'O nivel de volatilidade de ' + params.volatility + '% requer um fundo de reserva robusto para absorver choques de receita.',
      potentialSaving: `${Math.round(base.totalRevenue * 0.05)}€ em reserva`,
      action: 'Constituir provisao equivalente a 3 meses de custos fixos.',
    })
  }

  recs.push({
    priority: 'baixa',
    title: 'Planeamento Fiscal Anual',
    description:
      'Recomenda-se revisao trimestral da estrategia fiscal com base nas projecoes atualizadas do Oraculo.',
    potentialSaving: `${Math.round(base.totalIrc * 0.02)}€/ano`,
    action: 'Agendar revisao trimestral de planeamento fiscal.',
  })

  return recs
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

function generateAlerts(
  params: SimulationParams,
  risco: Scenario
): string[] {
  const alerts: string[] = []

  if (risco.totalNetProfit < 0) {
    alerts.push(
      `Cenario de risco projeta prejuizo liquido de ${Math.abs(risco.totalNetProfit).toLocaleString('pt-PT')}€ em 36 meses.`
    )
  }

  if (params.volatility > 25) {
    alerts.push(
      'Volatilidade acima de 25% - cenarios extremos podem ocorrer com frequencia significativa.'
    )
  }

  if (risco.profitMargin < 5) {
    alerts.push(
      `Margem de lucro do cenario de risco e de apenas ${risco.profitMargin}% - risco elevado de insolvencia.`
    )
  }

  const costRatio = params.costs / params.revenue
  if (costRatio > 0.8) {
    alerts.push(
      `Racio custos/receitas de ${(costRatio * 100).toFixed(0)}% - estrutura de custos muito pesada.`
    )
  }

  return alerts
}

// ---------------------------------------------------------------------------
// Distribution (histogram bins for Monte Carlo visualization)
// ---------------------------------------------------------------------------

function generateDistribution(base: Scenario, volatility: number): number[] {
  const bins = 50
  const distribution: number[] = new Array(bins).fill(0)
  const iterations = 1000
  const mean = base.totalNetProfit
  const stdDev = mean * (volatility / 100) * 1.5

  for (let i = 0; i < iterations; i++) {
    const sample = gaussianRandom(mean, stdDev)
    // Map to bin index (range: mean - 3*stdDev .. mean + 3*stdDev)
    const minVal = mean - 3 * stdDev
    const maxVal = mean + 3 * stdDev
    const range = maxVal - minVal
    const binIndex = Math.floor(((sample - minVal) / range) * bins)
    const clampedIndex = Math.max(0, Math.min(bins - 1, binIndex))
    distribution[clampedIndex]++
  }

  return distribution
}

// ---------------------------------------------------------------------------
// Risk metrics
// ---------------------------------------------------------------------------

function computeRiskMetrics(
  base: Scenario,
  volatility: number
): OracleResult['riskMetrics'] {
  const mean = base.totalNetProfit
  const stdDev = mean * (volatility / 100) * 1.5
  const samples: number[] = []

  for (let i = 0; i < 5000; i++) {
    samples.push(gaussianRandom(mean, stdDev))
  }

  samples.sort((a, b) => a - b)

  const var95 = samples[Math.floor(samples.length * 0.05)]
  const var99 = samples[Math.floor(samples.length * 0.01)]
  const tail5 = samples.slice(0, Math.floor(samples.length * 0.05))
  const cvar95 = tail5.reduce((s, v) => s + v, 0) / tail5.length

  // Max drawdown from cumulative monthly net profits
  let peak = 0
  let maxDrawdown = 0
  let cumulative = 0
  for (const proj of base.monthlyProjections) {
    cumulative += proj.netProfit
    if (cumulative > peak) peak = cumulative
    const drawdown = peak - cumulative
    if (drawdown > maxDrawdown) maxDrawdown = drawdown
  }

  return {
    var95: Math.round(var95),
    var99: Math.round(var99),
    cvar95: Math.round(cvar95),
    maxDrawdown: Math.round(maxDrawdown),
  }
}

// ============================================================================
// PUBLIC API
// ============================================================================

export async function runMockSimulation(
  params: SimulationParams
): Promise<OracleResult> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate projections for each scenario
  const favProjections = generateScenarioProjections(params, 1.15, 0.6)
  const baseProjections = generateScenarioProjections(params, 1.0, 1.0)
  const riskProjections = generateScenarioProjections(params, 0.85, 1.4)

  const cenarioFavoravel = buildScenario('Favoravel', favProjections)
  const cenarioBase = buildScenario('Base', baseProjections)
  const cenarioRisco = buildScenario('Risco', riskProjections)

  const recommendations = generateRecommendations(params, cenarioBase)
  const alerts = generateAlerts(params, cenarioRisco)
  const distribution = generateDistribution(cenarioBase, params.volatility)
  const riskMetrics = computeRiskMetrics(cenarioBase, params.volatility)

  const confidenceScore = Math.max(
    60,
    Math.min(98, 90 - params.volatility * 0.8 + Math.random() * 10)
  )

  return {
    simulationId: generateId(),
    createdAt: new Date().toISOString(),
    confidenceScore: Math.round(confidenceScore * 10) / 10,
    cenarioFavoravel,
    cenarioBase,
    cenarioRisco,
    recommendations,
    alerts,
    distribution,
    riskMetrics,
  }
}
