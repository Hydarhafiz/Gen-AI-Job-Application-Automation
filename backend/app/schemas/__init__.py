# In backend/app/schemas/__init__.py
from .user import UserBase, UserCreate, UserUpdate, UserInDB, User
from .application import ApplicationCreate, ApplicationInDB
from .educations import EducationBase, EducationInDB
from .projects import ProjectBase, ProjectInDB
from .skills import SkillBase, SkillInDB
from .job_postings import JobPostingBase, JobPostingCreate, JobPostingInDB, JobScrapeRequest