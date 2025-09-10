export interface Skill {
  name: string;
  category: string;
}

export interface SkillsFormProps {
  formData: Skill[];
  setFormData: (data: Skill[]) => void;
}