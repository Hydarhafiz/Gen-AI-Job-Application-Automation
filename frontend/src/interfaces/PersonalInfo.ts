// In frontend/src/interfaces/PersonalInfo.ts

export interface PersonalInfo {
  name: string;
  email: string;
  password?: string; // Add this line, making it optional since we might not need it for future updates
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