// In frontend/src/interfaces/Education.ts

export interface Education {
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_date: string; // Date strings
  end_date: string | null; // Date strings or null
}

export interface EducationFormProps {
  formData: Education[];
  setFormData: (data: Education[]) => void;
}