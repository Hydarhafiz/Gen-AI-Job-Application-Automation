export interface Experience {
  companyName: string;
  title: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface ExperienceFormProps {
  formData: Experience[];
  setFormData: (data: Experience[]) => void;
}