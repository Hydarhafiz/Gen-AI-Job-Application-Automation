export interface Experience {
  company_name: string; // Corrected to match backend
  title: string;
  start_date: string; // Corrected to match backend
  end_date: string | null; // Corrected to match backend. The API returns a date string, or null.
  is_current: boolean; // Added to match backend
  description: string; // Corrected to match backend. This field holds the responsibilities.
}


export interface ExperienceFormProps {
  formData: Experience[];
  setFormData: (data: Experience[]) => void;
}