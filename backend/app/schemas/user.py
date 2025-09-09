# In backend/app/schemas/user.py
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, HttpUrl
import uuid

from app.schemas.application import ApplicationInDB
from app.schemas.educations import EducationBase, EducationInDB
from app.schemas.experiences import ExperienceBase, ExperienceInDB
from app.schemas.job_postings import JobPostingInDB
from app.schemas.projects import ProjectBase, ProjectInDB
from app.schemas.skills import SkillBase, SkillInDB

class UserBase(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    linkedin_url: Optional[HttpUrl] = None
    personal_website_url: Optional[HttpUrl] = None
    professional_summary: Optional[str] = None

class UserCreate(UserBase):
    email: EmailStr # Email is still required

    # Now, allow for optional lists of related data upon creation
    experiences: Optional[List[ExperienceBase]] = []
    educations: Optional[List[EducationBase]] = []
    projects: Optional[List[ProjectBase]] = []
    skills: Optional[List[SkillBase]] = []


class UserUpdate(UserBase):
    pass

class UserInDB(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class User(UserInDB):
    experiences: list[ExperienceInDB] = []
    educations: list[EducationInDB] = []
    projects: list[ProjectInDB] = []
    skills: list[SkillInDB] = []
    job_postings: list[JobPostingInDB] = []
    applications: list[ApplicationInDB] = []
    
    class Config:
        orm_mode = True