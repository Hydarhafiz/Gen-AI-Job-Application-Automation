# In backend/app/schemas/user.py

from pydantic import BaseModel, HttpUrl, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid

from .educations import EducationCreate, EducationInDB
from .experiences import ExperienceCreate, ExperienceInDB
from .projects import ProjectCreate, ProjectInDB
from .skills import SkillCreate, SkillInDB
from .application import ApplicationInDB
from .job_postings import JobPostingInDB

# --- User Schemas ---

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone_number: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[HttpUrl] = None
    personal_website_url: Optional[HttpUrl] = None
    professional_summary: Optional[str] = None

class UserCreate(UserBase):
    password: str
    # Use the corrected schemas directly
    experiences: List[ExperienceCreate] = []
    educations: List[EducationCreate] = []
    projects: List[ProjectCreate] = []
    skills: List[SkillCreate] = []

class UserUpdate(UserBase):
    pass

class UserInDB(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    password_hash: str

    class Config:
        from_attributes = True

class User(UserInDB):
    experiences: List[ExperienceInDB] = []
    educations: List[EducationInDB] = []
    projects: List[ProjectInDB] = []
    skills: List[SkillInDB] = []
    job_postings: List[JobPostingInDB] = []
    applications: List[ApplicationInDB] = []
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str