# In backend/app/schemas/projects.py
from typing import Optional
from pydantic import BaseModel, HttpUrl
import uuid

class ProjectBase(BaseModel):
    user_id: uuid.UUID
    name: Optional[str] = None
    description: Optional[str] = None
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None

class ProjectInDB(ProjectBase):
    id: int

    class Config:
        orm_mode = True