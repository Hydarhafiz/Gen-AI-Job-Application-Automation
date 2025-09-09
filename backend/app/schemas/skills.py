# In backend/app/schemas/skills.py
from typing import Optional
from pydantic import BaseModel
import uuid

class SkillBase(BaseModel):
    user_id: uuid.UUID
    name: Optional[str] = None
    category: Optional[str] = None

class SkillInDB(SkillBase):
    id: int

    class Config:
        orm_mode = True