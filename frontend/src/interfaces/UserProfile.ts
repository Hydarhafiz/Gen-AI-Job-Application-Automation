// In frontend/src/interfaces/UserProfile.ts

import type { Education } from "./Education";
import type { Experience } from "./Experience";
import type { Project } from "./Project";
import type { Skill } from "./Skill";

export interface UserProfile {
  id: string; // UUID from backend
  name: string;
  email: string;
  phone_number: string | null;
  location: string | null;
  linkedin_url: string | null;
  personal_website_url: string | null;
  professional_summary: string | null;
  created_at: string;
  updated_at: string;
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  skills: Skill[];
  job_postings: any[]; // Or a specific JobPosting interface
  applications: any[]; // Or a specific Application interface
}