# api/app/routers/projects.py
# JQ.AI Projects CRUD endpoints

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.models import Project

router = APIRouter(prefix="/projects", tags=["projects"])

# ----------------------------
# Schemas
# ----------------------------

from pydantic import BaseModel
from typing import Optional

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    created_by: UUID
    created_at: datetime
    updated_at: datetime

# ----------------------------
# Endpoints
# ----------------------------

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    # TODO: replace with real auth
    user_id: UUID = UUID("00000000-0000-0000-0000-000000000000")
):
    """
    Create a new project.
    """
    new_project = Project(
        name=project.name,
        description=project.description,
        created_by=user_id
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project

@router.get("/", response_model=list[ProjectResponse])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    # TODO: replace with real auth
    user_id: UUID = UUID("00000000-0000-0000-0000-000000000000")
):
    """
    List all projects for the current user.
    """
    result = await db.execute(
        select(Project).where(Project.created_by == user_id)
    )
    projects = result.scalars().all()
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    # TODO: replace with real auth
    user_id: UUID = UUID("00000000-0000-0000-0000-000000000000")
):
    """
    Get a single project by ID.
    """
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.created_by == user_id
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    project_update: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    # TODO: replace with real auth
    user_id: UUID = UUID("00000000-0000-0000-0000-000000000000")
):
    """
    Update an existing project.
    """
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.created_by == user_id
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project_update.name is not None:
        project.name = project_update.name
    if project_update.description is not None:
        project.description = project_update.description

    await db.commit()
    await db.refresh(project)
    return project

@router.delete("/{project_id}")
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    # TODO: replace with real auth
    user_id: UUID = UUID("00000000-0000-0000-0000-000000000000")
):
    """
    Delete a project by ID.
    """
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.created_by == user_id
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    await db.delete(project)
    await db.commit()
    return {"status": "deleted"}
