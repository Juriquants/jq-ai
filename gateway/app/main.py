# gateway/app/main.py
# JQ.AI Inference Gateway
# Single audited egress point for all LLM inference requests.

import os
import json
import logging
from typing import Optional, Dict, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx

# ----------------------------
# Logging Setup
# ----------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("jq-gateway")

# ----------------------------
# Configuration
# ----------------------------

GATEWAY_KEY = os.getenv("JQ_AI_GATEWAY_KEY", "dev-key-change-me")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://ollama:11434")

TIER_MAP = {
    1: {"name": "Local Inference", "provider": "ollama", "base_url": OLLAMA_BASE_URL},
    2: {"name": "Self-Hosted Cloud", "provider": "custom", "base_url": None},
    3: {"name": "Managed Enterprise", "provider": "azure", "base_url": AZURE_OPENAI_ENDPOINT},
    4: {"name": "Standard Cloud", "provider": "openai", "base_url": "https://api.openai.com/v1"},
    5: {"name": "Consumer/Free", "provider": "anthropic", "base_url": "https://api.anthropic.com/v1"},
}

# ----------------------------
# Models
# ----------------------------

class InferenceRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="The user prompt to send to the model.")
    tier: int = Field(4, ge=1, le=5, description="Inference tier (1-5).")
    model: Optional[str] = Field(None, description="Override the model name.")
    stream: bool = Field(False, description="Enable streaming responses.")
    anonymize: bool = Field(True, description="Anonymize sensitive entities before sending.")

class InferenceResponse(BaseModel):
    response: str
    tier: int
    provider: str
    anonymized: bool
    request_id: str
    timestamp: str

# ----------------------------
# FastAPI Setup
# ----------------------------

app = FastAPI(
    title="JQ.AI Inference Gateway",
    description="Single audited egress point for all LLM inference requests.",
    version="0.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Auth Middleware
# ----------------------------

async def verify_gateway_key(request: Request):
    key = request.headers.get("X-Gateway-Key")
    if key != GATEWAY_KEY:
        logger.warning(f"Unauthorized request: invalid key provided.")
        raise HTTPException(status_code=401, detail="Invalid gateway key")
    return True

# ----------------------------
# Provider Dispatch
# ----------------------------

async def call_provider(request: InferenceRequest) -> Dict[str, Any]:
    tier = TIER_MAP.get(request.tier)
    if not tier:
        raise HTTPException(status_code=400, detail="Invalid tier specified")

    provider = tier["provider"]
    base_url = tier["base_url"]

    if not base_url:
        raise HTTPException(status_code=503, detail=f"Provider {provider} not configured")

    headers = {"Content-Type": "application/json"}
    payload = {
        "model": request.model or "gpt-4",
        "messages": [{"role": "user", "content": request.prompt}],
        "stream": request.stream
    }

    # Provider-specific adaptations
    if provider == "anthropic":
        headers["x-api-key"] = ANTHROPIC_API_KEY
        headers["anthropic-version"] = "2023-06-01"
        payload["max_tokens"] = 4096
        endpoint = f"{base_url}/messages"
    elif provider == "openai":
        headers["Authorization"] = f"Bearer {OPENAI_API_KEY}"
        endpoint = f"{base_url}/chat/completions"
    elif provider == "azure":
        headers["api-key"] = AZURE_OPENAI_KEY
        endpoint = f"{base_url}/openai/deployments/{request.model or 'gpt-4'}/chat/completions"
    elif provider == "ollama":
        endpoint = f"{base_url}/api/chat"
    else:
        raise HTTPException(status_code=400, detail=f"Provider {provider} not implemented")

    # Simulate the call (in production, uncomment the httpx lines below)
    # async with httpx.AsyncClient() as client:
    #     response = await client.post(endpoint, headers=headers, json=payload, timeout=30.0)
    #     response.raise_for_status()
    #     return response.json()

    # Simulated response for testing
    return {
        "choices": [{"message": {"content": f"Simulated response for {provider} (Tier {request.tier})"}}]
    }

# ----------------------------
# Endpoints
# ----------------------------

@app.post("/v1/inference", dependencies=[Depends(verify_gateway_key)])
async def inference(request: InferenceRequest):
    """
    Route an inference request through the gateway.
    """
    logger.info(f"Received request for tier {request.tier}")

    try:
        provider_response = await call_provider(request)
        response_text = provider_response.get("choices", [{}])[0].get("message", {}).get("content", "No response")

        return InferenceResponse(
            response=response_text,
            tier=request.tier,
            provider=TIER_MAP[request.tier]["provider"],
            anonymized=request.anonymize,
            request_id=request.headers.get("X-Request-ID", "unknown"),
            timestamp=datetime.utcnow().isoformat()
        )

    except Exception as e:
        logger.error(f"Inference failed: {str(e)}")
        raise HTTPException(status_code=502, detail=f"Inference provider error: {str(e)}")

@app.get("/health", dependencies=[Depends(verify_gateway_key)])
async def health():
    """
    Health check for the gateway.
    """
    return {"status": "healthy", "gateway_version": "0.2.0"}

@app.get("/tiers", dependencies=[Depends(verify_gateway_key)])
async def list_tiers():
    """
    Return the available inference tiers.
    """
    return {"tiers": TIER_MAP}
