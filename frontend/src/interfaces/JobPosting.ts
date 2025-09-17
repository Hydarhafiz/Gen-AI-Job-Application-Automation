
export interface JobPosting {
  id: number;
  user_id: string; // Corresponds to UUID in the backend
  url: string;
  job_title: string;
  company_name: string;
  location: string;
  job_description: string;
  applied_at?: string; // Optional field, use string for DateTime objects
}

export interface JobScrapeRequest {
  url: string;
}