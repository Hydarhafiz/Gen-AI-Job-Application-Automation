// In frontend/src/interfaces/Education.ts

export interface Education {
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_date: string; // Use string to represent date, e.g., "YYYY-MM-DD"
  end_date: string | null; // Use string or null to represent date
}

export interface EducationFormProps {
  formData: Education[];
  setFormData: (data: Education[]) => void;
}