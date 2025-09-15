# In backend/app/crud/users.py
import uuid
from sqlalchemy.orm import Session
from .. import models, schemas
from ..core.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Hash the password before creating the user
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        name=user.name,
        phone_number=user.phone_number,
        linkedin_url=str(user.linkedin_url) if user.linkedin_url else None,
        personal_website_url=str(user.personal_website_url) if user.personal_website_url else None,
        professional_summary=user.professional_summary
    )
    db.add(db_user)
    db.flush() 

    for exp in user.experiences:
        db_exp = models.Experience(**exp.dict(), user_id=db_user.id)
        db.add(db_exp)

    for edu in user.educations:
        db_edu = models.Education(**edu.dict(), user_id=db_user.id)
        db.add(db_edu)

    for proj in user.projects:
        db_proj = models.Project(
            user_id=db_user.id,
            name=proj.name,
            description=proj.description,
            github_url=str(proj.github_url) if proj.github_url else None,
            live_url=str(proj.live_url) if proj.live_url else None
        )
        db.add(db_proj)

    for skill in user.skills:
        db_skill = models.Skill(**skill.dict(), user_id=db_user.id)
        db.add(db_skill)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: uuid.UUID):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

# New function for authentication
def get_user_by_email_with_password(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()