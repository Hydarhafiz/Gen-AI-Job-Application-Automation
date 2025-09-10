export interface Project {
  name: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
}

export interface ProjectsFormProps {
  formData: Project[];
  setFormData: (data: Project[]) => void;
}