# In backend/app/db/create_tables.py
import os
from sqlalchemy import create_engine
from ..models import Base

# This line is crucial for loading your environment variables
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', '.env'))

# Use the DATABASE_URL from your .env file
DATABASE_URL = os.getenv("DATABASE_URL")

# Make sure the URL is not None before proceeding
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL environment variable is not set.")

engine = create_engine(DATABASE_URL)

def create_tables():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    create_tables()