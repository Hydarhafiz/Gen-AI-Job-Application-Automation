# In backend/app/api/endpoints/applications.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ... import schemas, crud
from ...db.database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.ApplicationInDB, status_code=status.HTTP_201_CREATED)
def generate_application(
    application: schemas.ApplicationCreate, # This will be adjusted in the future for LLM
    db: Session = Depends(get_db)
):
    # This is a placeholder. In the next steps, we will add the logic
    # for web scraping and AI generation here.
    return crud.applications.create_application(db=db, application=application)

@router.get("/{application_id}", response_model=schemas.ApplicationInDB)
def read_application(application_id: int, db: Session = Depends(get_db)):
    application = crud.applications.get_application(db, application_id=application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application