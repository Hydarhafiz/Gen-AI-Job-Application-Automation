# In backend/app/models/application.py
from datetime import datetime
from sqlalchemy import UUID, Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    job_posting_id = Column(Integer, ForeignKey("job_postings.id"))
    generated_resume_text = Column(Text)
    generated_cover_letter_text = Column(Text)
    generated_email_template = Column(Text)
    generated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    job_posting = relationship("JobPosting", back_populates="applications")