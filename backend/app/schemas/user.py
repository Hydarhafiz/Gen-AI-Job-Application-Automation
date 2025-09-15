# In backend/app/schemas/user.py

from pydantic import BaseModel, HttpUrl, EmailStr
from typing import Optional
from datetime import datetime
import uuid

from app.schemas.application import ApplicationInDB
from app.schemas.educations import EducationInDB
from app.schemas.experiences import ExperienceInDB
from app.schemas.job_postings import JobPostingInDB
from app.schemas.projects import ProjectInDB
from app.schemas.skills import SkillInDB

# Re-define Pydantic models for related tables
class ExperienceCreate(BaseModel):
    title: str
    company: str
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None

class EducationCreate(BaseModel):
    school: str
    degree: str
    field_of_study: str
    start_date: str
    end_date: Optional[str] = None

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None

class SkillCreate(BaseModel):
    name: str

class JobPostingCreate(BaseModel):
    url: HttpUrl
    job_title: str
    company_name: str
    location: Optional[str] = None
    job_description: Optional[str] = None
    requirements: Optional[str] = None
    user_id: uuid.UUID

class ApplicationCreate(BaseModel):
    user_id: uuid.UUID
    job_posting_id: int
    generated_resume_text: Optional[str] = None
    generated_cover_letter_text: Optional[str] = None
    generated_email_template: Optional[str] = None

# --- User Schemas ---

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone_number: Optional[str] = None
    linkedin_url: Optional[HttpUrl] = None
    personal_website_url: Optional[HttpUrl] = None
    professional_summary: Optional[str] = None

class UserCreate(UserBase):
    password: str
    experiences: list[ExperienceCreate] = []
    educations: list[EducationCreate] = []
    projects: list[ProjectCreate] = []
    skills: list[SkillCreate] = []

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
    experiences: list[ExperienceInDB] = []
    educations: list[EducationInDB] = []
    projects: list[ProjectInDB] = []
    skills: list[SkillInDB] = []
    job_postings: list[JobPostingInDB] = []
    applications: list[ApplicationInDB] = []
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str