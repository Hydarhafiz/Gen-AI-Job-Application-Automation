// In frontend/src/interfaces/Skill.ts

export interface Skill {
  name: string;
  category: string | null;
}

export interface SkillsFormProps {
  formData: Skill[];
  setFormData: (data: Skill[]) => void;
}