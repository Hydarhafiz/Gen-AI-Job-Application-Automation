# In backend/app/models/user.py
from datetime import datetime
import uuid
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String)
    email = Column(String, unique=True)
    phone_number = Column(String)
    linkedin_url = Column(String)
    personal_website_url = Column(String)
    professional_summary = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    experiences = relationship("Experience", back_populates="user")
    educations = relationship("Education", back_populates="user")
    projects = relationship("Project", back_populates="user")
    skills = relationship("Skill", back_populates="user")
    job_postings = relationship("JobPosting", back_populates="user")
    applications = relationship("Application", back_populates="user")