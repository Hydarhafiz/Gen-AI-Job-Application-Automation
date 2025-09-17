// In frontend/src/interfaces/Project.ts

export interface Project {
  name: string;
  description: string | null;
  github_url: string | null; // Changed to match backend model
  live_url: string | null; // Changed to match backend model
}

export interface ProjectsFormProps {
  formData: Project[];
  setFormData: (data: Project[]) => void;
}