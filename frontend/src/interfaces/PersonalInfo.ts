// In frontend/src/interfaces/personalInfo.ts

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  personalWebsiteUrl: string;
  professionalSummary: string;
}

export interface PersonalInfoFormProps {
  formData: PersonalInfo;
  setFormData: (data: PersonalInfo) => void;
}