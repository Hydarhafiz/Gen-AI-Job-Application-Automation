// In frontend/src/interfaces/PersonalInfo.ts

export interface PersonalInfo {
  name: string;
  email: string;
  password?: string;
  phone_number: string;
  location: string;
  linkedin_url: string | null; // Changed to match backend model
  personal_website_url: string | null; // Changed to match backend model
  professional_summary: string | null; // Changed to match backend model
}

export interface PersonalInfoFormProps {
  formData: PersonalInfo;
  setFormData: (data: PersonalInfo) => void;
}