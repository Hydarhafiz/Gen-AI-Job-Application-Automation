# In backend/app/crud/jobpostings.py

from sqlalchemy.orm import Session
from .. import models, schemas

def create_job_posting(db: Session, job_posting: schemas.JobPostingCreate):
    db_job_posting = models.JobPosting(
        user_id=job_posting.user_id,
        url=str(job_posting.url),
        job_title=job_posting.job_title,
        company_name=job_posting.company_name,
        location=job_posting.location,
        job_description=job_posting.job_description,
    )
    db.add(db_job_posting)
    db.commit()
    db.refresh(db_job_posting)
    return db_job_posting

def get_job_posting(db: Session, job_posting_id: int):
    return db.query(models.JobPosting).filter(models.JobPosting.id == job_posting_id).first()

def get_job_posting_by_url(db: Session, url: str):
    return db.query(models.JobPosting).filter(models.JobPosting.url == url).first()