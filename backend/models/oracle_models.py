from pydantic import BaseModel, Field
from typing import Optional


class SimulationRequest(BaseModel):
    revenue: float = Field(..., gt=0, description="Annual revenue in EUR")
    costs: float = Field(..., gt=0, description="Annual costs in EUR")
    tax_rate: float = Field(0.21, ge=0, le=1, description="Effective tax rate (0-1)")
    growth_rate: float = Field(0.05, ge=-0.5, le=0.5, description="Expected annual growth")
    volatility: float = Field(0.15, ge=0.01, le=1.0, description="Market volatility")
    iterations: int = Field(10000, ge=100, le=50000)
    periods: int = Field(36, ge=6, le=60, description="Months to simulate")

    model_config = {
        "json_schema_extra": {
            "example": {
                "revenue": 500000,
                "costs": 350000,
                "tax_rate": 0.21,
                "growth_rate": 0.05,
                "volatility": 0.15,
                "iterations": 10000,
                "periods": 36,
            }
        }
    }


class MonthlyProjection(BaseModel):
    month: int
    date: str
    revenue: float
    costs: float
    irc_due: float
    net_profit: float


class ScenarioResult(BaseModel):
    name: str
    total_revenue: float
    total_profit: float
    total_irc: float
    total_net_profit: float
    profit_margin: float
    irc_effective_rate: float
    monthly_projections: list[MonthlyProjection]


class RiskMetrics(BaseModel):
    var_95: float
    var_99: float
    cvar_95: float
    max_drawdown: float


class SimulationResponse(BaseModel):
    simulation_id: str
    created_at: str
    confidence_score: float
    cenario_favoravel: ScenarioResult
    cenario_base: ScenarioResult
    cenario_risco: ScenarioResult
    recommendations: list[dict]
    alerts: list[str]
    distribution: list[float]
    risk_metrics: RiskMetrics
    processing_time_ms: int


class ChatRequest(BaseModel):
    message: str
    agent_id: Optional[str] = None


class CTPResponse(BaseModel):
    contexto: str
    pensamento: str
    proposta: str


class ChatResponse(BaseModel):
    message_id: str
    agent_id: str
    agent_name: str
    content: str
    ctp: CTPResponse
    timestamp: str
