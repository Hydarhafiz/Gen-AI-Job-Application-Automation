// In frontend/src/interfaces/Education.ts

export interface Education {
  institution_name: string; // ⬅️ Corrected to match backend
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
}

export interface EducationFormProps {
  formData: Education[];
  setFormData: (data: Education[]) => void;
}