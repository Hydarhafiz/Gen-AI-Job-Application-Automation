# In backend/app/models/job_postings.py
from sqlalchemy import UUID, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class JobPosting(Base):
    __tablename__ = "job_postings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    url = Column(String, unique=True)
    job_title = Column(String)
    company_name = Column(String)
    location = Column(String)
    job_description = Column(Text)
    applied_at = Column(DateTime)
    user = relationship("User", back_populates="job_postings")
    applications = relationship("Application", back_populates="job_posting")