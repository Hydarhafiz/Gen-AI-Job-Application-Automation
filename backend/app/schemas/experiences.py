# In backend/app/schemas/experiences.py
from datetime import date
from typing import Optional
from pydantic import BaseModel
import uuid

class ExperienceBase(BaseModel):
    user_id: uuid.UUID
    company_name: Optional[str] = None
    title: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None

class ExperienceInDB(ExperienceBase):
    id: int

    class Config:
        from_attributes = True