// In frontend/src/interfaces/Experience.ts

export interface Experience {
  company_name: string;
  title: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
}

export interface ExperienceFormProps {
  formData: Experience[];
  setFormData: (data: Experience[]) => void;
}