# In backend/app/schemas/application.py
from datetime import datetime
from pydantic import BaseModel
import uuid

class ApplicationBase(BaseModel):
    user_id: uuid.UUID
    job_posting_id: int
    generated_resume_text: str
    generated_cover_letter_text: str
    generated_email_template: str

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationInDB(ApplicationBase):
    id: int
    generated_at: datetime

    class Config:
        orm_mode = True