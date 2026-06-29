# api/app/routers/skills.py
# JQ.AI Skills Router
# Returns metadata about built-in and community skills.

from fastapi import APIRouter, HTTPException
import os
import glob
from pathlib import Path

router = APIRouter(prefix="/skills", tags=["skills"])

# Path to the skills directory
SKILLS_DIR = Path(__file__).parent.parent.parent.parent / "skills"
BUILTIN_DIR = SKILLS_DIR / "built-in"
COMMUNITY_DIR = SKILLS_DIR / "community"

@router.get("/")
async def list_skills():
    """
    List all available skills (built-in and community).
    """
    skills = []

    # List built-in skills
    if BUILTIN_DIR.exists():
        for skill_path in BUILTIN_DIR.iterdir():
            if skill_path.is_dir() and (skill_path / "SKILL.md").exists():
                skills.append({
                    "name": skill_path.name,
                    "source": "built-in",
                    "path": str(skill_path.relative_to(SKILLS_DIR))
                })

    # List community skills (if mounted)
    if COMMUNITY_DIR.exists():
        for skill_path in COMMUNITY_DIR.iterdir():
            if skill_path.is_dir() and (skill_path / "SKILL.md").exists():
                skills.append({
                    "name": skill_path.name,
                    "source": "community",
                    "path": str(skill_path.relative_to(SKILLS_DIR))
                })

    return {"skills": skills}

@router.get("/{skill_name}")
async def get_skill(skill_name: str):
    """
    Get the full content of a specific skill by name.
    """
    # Check built-in first, then community
    skill_path = BUILTIN_DIR / skill_name / "SKILL.md"
    if not skill_path.exists():
        skill_path = COMMUNITY_DIR / skill_name / "SKILL.md"
        if not skill_path.exists():
            raise HTTPException(status_code=404, detail="Skill not found")

    try:
        content = skill_path.read_text(encoding="utf-8")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading skill: {str(e)}")

    return {
        "name": skill_name,
        "source": "built-in" if (BUILTIN_DIR / skill_name).exists() else "community",
        "content": content
    }
