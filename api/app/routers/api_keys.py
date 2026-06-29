# api/app/routers/api_keys.py
# JQ.AI API Key Management

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from pydantic import BaseModel
from uuid import UUID
import secrets
from datetime import datetime

from app.database import get_db
from app.models import User, ApiKey
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api-keys", tags=["api-keys"])

# ----------------------------
# Schemas
# ----------------------------

class ApiKeyCreate(BaseModel):
    name: str

class ApiKeyResponse(BaseModel):
    id: UUID
    name: str
    key: str
    created_at: datetime
    last_used: datetime | None

class ApiKeyListResponse(BaseModel):
    id: UUID
    name: str
    created_at: datetime
    last_used: datetime | None

# ----------------------------
# Endpoints
# ----------------------------

@router.post("/", response_model=ApiKeyResponse)
async def create_api_key(
    key_data: ApiKeyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new API key for the authenticated user.
    """
    # Generate a secure random key
    raw_key = secrets.token_urlsafe(32)
    # In production, you should hash this before storing
    # For now, we store it plaintext (not recommended for production)

    new_key = ApiKey(
        name=key_data.name,
        key=raw_key,
        user_id=current_user.id
    )
    db.add(new_key)
    await db.commit()
    await db.refresh(new_key)

    return ApiKeyResponse(
        id=new_key.id,
        name=new_key.name,
        key=new_key.key,
        created_at=new_key.created_at,
        last_used=new_key.last_used
    )

@router.get("/", response_model=list[ApiKeyListResponse])
async def list_api_keys(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all API keys for the authenticated user.
    """
    result = await db.execute(
        select(ApiKey).where(ApiKey.user_id == current_user.id)
    )
    keys = result.scalars().all()
    return keys

@router.delete("/{key_id}")
async def revoke_api_key(
    key_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Revoke (delete) an API key.
    """
    result = await db.execute(
        select(ApiKey).where(
            ApiKey.id == key_id,
            ApiKey.user_id == current_user.id
        )
    )
    key = result.scalar_one_or_none()
    if not key:
        raise HTTPException(status_code=404, detail="API key not found")

    await db.delete(key)
    await db.commit()
    return {"status": "revoked"}
