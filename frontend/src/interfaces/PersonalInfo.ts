// In frontend/src/interfaces/PersonalInfo.ts

export interface PersonalInfo {
  name: string;
  email: string;
  phone_number: string;
  location: string;
  linkedin_url: string;
  personal_website_url: string;
  professional_summary: string;
}

export interface PersonalInfoFormProps {
  formData: PersonalInfo;
  setFormData: (data: PersonalInfo) => void;
}