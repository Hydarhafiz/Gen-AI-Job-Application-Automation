# In backend/app/schemas/job_postings.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, HttpUrl
import uuid

class JobPostingBase(BaseModel):
    user_id: uuid.UUID
    url: Optional[HttpUrl] = None
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    location: Optional[str] = None
    job_description: Optional[str] = None
    applied_at: Optional[datetime] = None

class JobPostingCreate(JobPostingBase):
    pass

class JobPostingInDB(JobPostingBase):
    id: int

    class Config:
        from_attributes = True # Change this from orm_mode = True
        
class JobScrapeRequest(BaseModel):
    url: HttpUrl
    
class JobPosting(JobPostingInDB):
    class Config:
        from_attributes = True