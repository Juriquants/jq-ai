# gateway/app/main.py
# JQ.AI Inference Gateway - Main Entry Point

from fastapi import FastAPI

app = FastAPI(
    title="JQ.AI Inference Gateway",
    description="Single audited egress point for all LLM inference requests.",
    version="0.1.0"
)

@app.get("/")
async def root():
    return {"message": "JQ.AI Gateway is running."}
