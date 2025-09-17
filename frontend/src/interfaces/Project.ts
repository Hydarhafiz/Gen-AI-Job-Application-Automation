// In frontend/src/interfaces/Project.ts

export interface Project {
  name: string; // Corrected from 'title' to 'name'
  description: string | null;
  github_url: string | null;
  live_url: string | null;
  // The API output shows start_date and end_date on the project, let's add them
  start_date: string | null; 
  end_date: string | null;
}

export interface ProjectsFormProps {
  formData: Project[];
  setFormData: (data: Project[]) => void;
}