# In backend/app/models/educations.py
from sqlalchemy import UUID, Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Education(Base):
    __tablename__ = "educations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    institution_name = Column(String)
    degree = Column(String)
    field_of_study = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    user = relationship("User", back_populates="educations")