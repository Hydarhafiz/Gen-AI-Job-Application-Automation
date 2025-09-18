# In backend/app/schemas/educations.py
from datetime import date
from typing import Optional
from pydantic import BaseModel
import uuid

class EducationBase(BaseModel):
    user_id: uuid.UUID
    institution_name: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    
class EducationCreate(BaseModel):
    institution_name: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class EducationInDB(EducationBase):
    id: int

    class Config:
        from_attributes = True