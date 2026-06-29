# gateway/app/main.py
# JQ.AI Inference Gateway
# Live inference with real LLM providers.

import os
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
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://ollama:11434")

DEFAULT_PROVIDER = os.getenv("JQ_AI_DEFAULT_PROVIDER", "openai")
DEFAULT_MODEL = os.getenv("JQ_AI_DEFAULT_MODEL", "gpt-4")

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
# Test Endpoint
# ----------------------------

@app.get("/test")
async def test():
    """
    Test endpoint to verify the Gateway is running.
    No API key required.
    """
    return {
        "status": "ok",
        "message": "JQ.AI Gateway is running correctly.",
        "version": "0.3.0"
    }

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
# Provider Dispatch (Live)
# ----------------------------

async def call_openai(prompt: str, model: str, stream: bool) -> Dict[str, Any]:
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": stream
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()

async def call_anthropic(prompt: str, model: str, stream: bool) -> Dict[str, Any]:
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 4096,
        "stream": stream
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()

async def call_ollama(prompt: str, model: str, stream: bool) -> Dict[str, Any]:
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": stream
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json=payload
        )
        response.raise_for_status()
        return response.json()

async def call_provider(request: InferenceRequest) -> str:
    tier = TIER_MAP.get(request.tier)
    if not tier:
        raise HTTPException(status_code=400, detail="Invalid tier specified")

    provider = tier["provider"]
    model = request.model or DEFAULT_MODEL
    prompt = request.prompt

    logger.info(f"Routing to {provider} (Tier {request.tier}) with model {model}")

    try:
        if provider == "openai":
            if not OPENAI_API_KEY:
                raise HTTPException(status_code=503, detail="OpenAI API key not configured")
            result = await call_openai(prompt, model, request.stream)
            return result["choices"][0]["message"]["content"]

        elif provider == "anthropic":
            if not ANTHROPIC_API_KEY:
                raise HTTPException(status_code=503, detail="Anthropic API key not configured")
            result = await call_anthropic(prompt, model, request.stream)
            return result["content"][0]["text"]

        elif provider == "ollama":
            result = await call_ollama(prompt, model, request.stream)
            return result["message"]["content"]

        elif provider == "azure":
            raise HTTPException(status_code=501, detail="Azure OpenAI not yet implemented")

        else:
            raise HTTPException(status_code=400, detail=f"Provider {provider} not implemented")

    except httpx.TimeoutException:
        logger.error("LLM provider timeout")
        raise HTTPException(status_code=504, detail="LLM provider timeout")
    except httpx.HTTPStatusError as e:
        logger.error(f"LLM provider error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"LLM provider error: {e.response.text}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal gateway error: {str(e)}")

# ----------------------------
# Endpoints
# ----------------------------

@app.post("/v1/inference", dependencies=[Depends(verify_gateway_key)])
async def inference(request: InferenceRequest):
    """
    Route an inference request through the gateway to a live LLM provider.
    """
    logger.info(f"Received inference request for tier {request.tier}")

    # For now, we skip anonymization (will be added in the next layer)
    response_text = await call_provider(request)

    return InferenceResponse(
        response=response_text,
        tier=request.tier,
        provider=TIER_MAP[request.tier]["provider"],
        anonymized=request.anonymize,
        request_id=request.headers.get("X-Request-ID", "unknown"),
        timestamp=datetime.utcnow().isoformat()
    )

@app.get("/health", dependencies=[Depends(verify_gateway_key)])
async def health():
    return {"status": "healthy", "gateway_version": "0.3.0"}

@app.get("/tiers", dependencies=[Depends(verify_gateway_key)])
async def list_tiers():
    return {"tiers": TIER_MAP}
