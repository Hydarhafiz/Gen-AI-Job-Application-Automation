# In backend/app/models/projects.py
from sqlalchemy import UUID, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    name = Column(String)
    description = Column(Text)
    github_url = Column(String)
    live_url = Column(String)
    user = relationship("User", back_populates="projects")