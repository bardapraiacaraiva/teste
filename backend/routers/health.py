from fastapi import APIRouter
from datetime import datetime

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "L.U.C.A.S v2.0 API",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
    }
