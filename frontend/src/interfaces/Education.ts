export interface Education {
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface EducationFormProps {
  formData: Education[];
  setFormData: (data: Education[]) => void;
}