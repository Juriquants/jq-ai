# api/app/main.py
# JQ.AI Backend API - Main Entry Point

from fastapi import FastAPI

app = FastAPI(
    title="JQ.AI Backend API",
    description="Core backend for JQ.AI. Handles authentication, projects, skills, audit logs, and document management.",
    version="0.1.0"
)

@app.get("/")
async def root():
    return {"message": "JQ.AI API is running."}
