# In backend/app/crud/applications.py
from sqlalchemy.orm import Session
from .. import models, schemas

def create_application(db: Session, application: schemas.ApplicationCreate):
    db_application = models.Application(
        user_id=application.user_id,
        job_posting_id=application.job_posting_id,
        generated_resume_text=application.generated_resume_text,
        generated_cover_letter_text=application.generated_cover_letter_text,
        generated_email_template=application.generated_email_template,
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def get_application(db: Session, application_id: int):
    return db.query(models.Application).filter(models.Application.id == application_id).first()