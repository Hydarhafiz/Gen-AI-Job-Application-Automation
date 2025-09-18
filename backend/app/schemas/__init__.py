# In backend/app/schemas/__init__.py
from .user import UserBase, UserCreate, UserUpdate, UserInDB, User, Token
from .application import ApplicationCreate, ApplicationInDB, CoverLetterRequest
from .educations import EducationBase, EducationInDB, EducationCreate
from .projects import ProjectBase, ProjectInDB, ProjectCreate
from .skills import SkillBase, SkillInDB, SkillCreate
from .job_postings import JobPostingBase, JobPostingCreate, JobPostingInDB, JobScrapeRequest, JobPosting
from .experiences import ExperienceBase, ExperienceCreate, ExperienceInDB