"""
L.U.C.A.S v2.0 - Motor Monte Carlo
Simulacao de cenarios fiscais com Geometric Brownian Motion
"""

import numpy as np
from scipy import stats
from datetime import datetime, timedelta
from models.oracle_models import (
    SimulationRequest, SimulationResponse, ScenarioResult,
    MonthlyProjection, RiskMetrics,
)
import uuid
import time


class MonteCarloEngine:
    def __init__(self, iterations: int = 10000):
        self.iterations = iterations

    def run_simulation(self, request: SimulationRequest) -> SimulationResponse:
        start = time.time()

        monthly_revenue = request.revenue / 12
        monthly_costs = request.costs / 12
        dt = 1 / 12  # monthly time step
        mu_r = request.growth_rate
        sigma_r = request.volatility
        mu_c = request.growth_rate * 0.6  # costs grow slower
        sigma_c = request.volatility * 0.5
        tax_rate = request.tax_rate
        periods = request.periods

        # Seasonality factors (Q4 stronger)
        seasonality = np.array([
            0.85, 0.88, 0.92, 0.95, 1.00, 1.00,
            0.92, 0.88, 0.95, 1.08, 1.12, 1.18,
        ] * 3)[:periods]

        # Generate all paths at once (vectorized)
        z_revenue = np.random.standard_normal((self.iterations, periods))
        z_costs = np.random.standard_normal((self.iterations, periods))

        # Geometric Brownian Motion for revenue
        revenue_paths = np.zeros((self.iterations, periods))
        cost_paths = np.zeros((self.iterations, periods))

        revenue_paths[:, 0] = monthly_revenue * seasonality[0]
        cost_paths[:, 0] = monthly_costs

        for t in range(1, periods):
            revenue_paths[:, t] = revenue_paths[:, t - 1] * np.exp(
                (mu_r - 0.5 * sigma_r**2) * dt + sigma_r * np.sqrt(dt) * z_revenue[:, t]
            ) * (seasonality[t] / seasonality[t - 1])

            cost_paths[:, t] = cost_paths[:, t - 1] * np.exp(
                (mu_c - 0.5 * sigma_c**2) * dt + sigma_c * np.sqrt(dt) * z_costs[:, t]
            )

        # Calculate profits and IRC
        profit_paths = revenue_paths - cost_paths
        irc_paths = np.maximum(profit_paths * tax_rate, 0)
        net_profit_paths = profit_paths - irc_paths

        # Total net profit per simulation
        total_net_profits = net_profit_paths.sum(axis=1)
        total_ircs = irc_paths.sum(axis=1)

        # Scenario extraction by percentiles of total net profit
        sorted_indices = np.argsort(total_net_profits)

        def extract_scenario(name: str, pct_low: int, pct_high: int) -> ScenarioResult:
            low_idx = int(self.iterations * pct_low / 100)
            high_idx = int(self.iterations * pct_high / 100)
            mid_idx = (low_idx + high_idx) // 2
            sim_idx = sorted_indices[mid_idx]

            base_date = datetime.now()
            projections = []
            for m in range(periods):
                month_date = base_date + timedelta(days=30 * (m + 1))
                projections.append(MonthlyProjection(
                    month=m + 1,
                    date=month_date.strftime("%Y-%m"),
                    revenue=round(float(revenue_paths[sim_idx, m]), 2),
                    costs=round(float(cost_paths[sim_idx, m]), 2),
                    irc_due=round(float(irc_paths[sim_idx, m]), 2),
                    net_profit=round(float(net_profit_paths[sim_idx, m]), 2),
                ))

            total_rev = float(revenue_paths[sim_idx].sum())
            total_cost = float(cost_paths[sim_idx].sum())
            total_profit = total_rev - total_cost
            total_irc = float(irc_paths[sim_idx].sum())
            total_net = float(net_profit_paths[sim_idx].sum())

            return ScenarioResult(
                name=name,
                total_revenue=round(total_rev, 2),
                total_profit=round(total_profit, 2),
                total_irc=round(total_irc, 2),
                total_net_profit=round(total_net, 2),
                profit_margin=round((total_profit / total_rev * 100) if total_rev > 0 else 0, 1),
                irc_effective_rate=round((total_irc / total_profit * 100) if total_profit > 0 else 0, 1),
                monthly_projections=projections,
            )

        cenario_favoravel = extract_scenario("favoravel", 75, 90)
        cenario_base = extract_scenario("base", 40, 60)
        cenario_risco = extract_scenario("risco", 10, 25)

        # Distribution histogram (50 bins)
        hist, _ = np.histogram(total_net_profits, bins=50)
        distribution = [int(x) for x in hist]

        # Risk metrics
        var_95 = float(np.percentile(total_net_profits, 5))
        var_99 = float(np.percentile(total_net_profits, 1))
        cvar_95 = float(total_net_profits[total_net_profits <= var_95].mean()) if (total_net_profits <= var_95).any() else var_95

        # Max drawdown from cumulative net profit paths
        cum_profits = np.cumsum(net_profit_paths, axis=1)
        running_max = np.maximum.accumulate(cum_profits, axis=1)
        drawdowns = (running_max - cum_profits) / np.where(running_max > 0, running_max, 1)
        max_drawdown = float(drawdowns.max())

        # Recommendations
        recommendations = []
        if cenario_base.irc_effective_rate > 20:
            recommendations.append({
                "priority": "ALTA",
                "title": "Otimizar Carga Fiscal IRC",
                "description": f"Taxa efetiva IRC de {cenario_base.irc_effective_rate}% acima da média PME. Considerar benefícios fiscais.",
                "potentialSaving": f"€{cenario_base.total_irc * 0.15:,.0f}",
                "action": "Agendar reunião com Tomé (Fiscal)",
            })
        if cenario_base.profit_margin < 15:
            recommendations.append({
                "priority": "MÉDIA",
                "title": "Melhorar Margem Operacional",
                "description": f"Margem de {cenario_base.profit_margin}% pode ser otimizada.",
                "potentialSaving": f"€{cenario_base.total_revenue * 0.03:,.0f}",
                "action": "Análise de custos com Duarte (Estratégia)",
            })
        recommendations.append({
            "priority": "MÉDIA",
            "title": "Ativar Benefícios Fiscais",
            "description": "Verificar elegibilidade para SIFIDE III, RFAI e DLRR.",
            "potentialSaving": f"€{cenario_base.total_irc * 0.10:,.0f}",
            "action": "Verificar elegibilidade com Tomé",
        })

        # Alerts
        alerts = []
        risk_ratio = cenario_risco.total_irc / cenario_base.total_irc if cenario_base.total_irc > 0 else 1
        if risk_ratio > 1.3:
            alerts.append(f"Cenário de risco mostra IRC {(risk_ratio - 1) * 100:.0f}% superior ao base")
        if cenario_base.profit_margin < 10:
            alerts.append("Margem de lucro próxima de nível crítico (<10%)")

        elapsed = int((time.time() - start) * 1000)

        return SimulationResponse(
            simulation_id=f"ORC_{uuid.uuid4().hex[:12]}",
            created_at=datetime.now().isoformat(),
            confidence_score=0.85,
            cenario_favoravel=cenario_favoravel,
            cenario_base=cenario_base,
            cenario_risco=cenario_risco,
            recommendations=recommendations,
            alerts=alerts,
            distribution=distribution,
            risk_metrics=RiskMetrics(
                var_95=round(var_95, 2),
                var_99=round(var_99, 2),
                cvar_95=round(cvar_95, 2),
                max_drawdown=round(max_drawdown * 100, 1),
            ),
            processing_time_ms=elapsed,
        )
