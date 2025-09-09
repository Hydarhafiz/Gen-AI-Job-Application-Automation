# In backend/app/models/experiences.py
from sqlalchemy import UUID, Column, Integer, String, Date, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Experience(Base):
    __tablename__ = "experiences"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    company_name = Column(String)
    title = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    is_current = Column(Boolean)
    description = Column(Text)
    user = relationship("User", back_populates="experiences")