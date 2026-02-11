from fastapi import APIRouter, HTTPException
from models.oracle_models import SimulationRequest, SimulationResponse
from services.monte_carlo import MonteCarloEngine

router = APIRouter(tags=["oracle"])


@router.post("/simulate", response_model=SimulationResponse)
async def run_simulation(request: SimulationRequest):
    try:
        engine = MonteCarloEngine(iterations=request.iterations)
        result = engine.run_simulation(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")
