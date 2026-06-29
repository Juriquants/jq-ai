# api/app/main.py
# JQ.AI Backend API
# Core service for authentication, projects, skills, and audit logs.

import os
import logging
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import routers
from app.routers import projects
from app.routers import skills

# ----------------------------
# Logging Setup
# ----------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("jq-api")

# ----------------------------
# FastAPI Setup
# ----------------------------

app = FastAPI(
    title="JQ.AI Backend API",
    description="Core backend for JQ.AI. Handles authentication, projects, skills, audit logs, and document management.",
    version="0.3.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Register Routers
# ----------------------------

app.include_router(projects.router)
app.include_router(skills.router)

# ----------------------------
# Models
# ----------------------------

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str

class StatsResponse(BaseModel):
    total_projects: int
    total_skills: int
    total_users: int
    uptime_seconds: int

# ----------------------------
# Startup Event
# ----------------------------

@app.on_event("startup")
async def startup():
    logger.info("JQ.AI API starting up...")

@app.on_event("shutdown")
async def shutdown():
    logger.info("JQ.AI API shutting down...")

# ----------------------------
# Endpoints
# ----------------------------

@app.get("/health", response_model=HealthResponse)
async def health():
    """
    Health check for the API.
    """
    return HealthResponse(
        status="healthy",
        version="0.3.0",
        timestamp=datetime.utcnow().isoformat()
    )

@app.get("/stats", response_model=StatsResponse)
async def stats():
    """
    Return basic platform statistics.
    """
    return StatsResponse(
        total_projects=0,
        total_skills=10,
        total_users=0,
        uptime_seconds=0
    )

@app.get("/")
async def root():
    """
    Root endpoint.
    """
    return {
        "message": "JQ.AI API is running.",
        "version": "0.3.0",
        "documentation": "/docs"
    }
