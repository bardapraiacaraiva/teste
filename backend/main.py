"""
L.U.C.A.S v2.0 - API Server
FastAPI backend for Oracle Monte Carlo and Agent Chat
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS
from routers import oracle, chat, health

app = FastAPI(
    title="L.U.C.A.S v2.0 API",
    description="Motor de Presciência Fiscal e Chat Multi-Agente",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(oracle.router, prefix="/api/oracle")
app.include_router(chat.router, prefix="/api/chat")


@app.get("/")
async def root():
    return {"message": "L.U.C.A.S v2.0 API - Lusaconta AI", "docs": "/docs"}
