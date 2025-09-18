// In frontend/src/interfaces/Skill.ts

// This interface represents a single skill entry.
// It matches the data structure expected by the backend.
export interface Skill {
    name: string;
    category: string;
}

// This is a new type that represents the grouped skills format for the form.
// It is an object where keys are categories and values are arrays of skill names.
export interface GroupedSkillsFormData {
    [category: string]: string[];
}

export interface SkillsFormProps {
    formData: GroupedSkillsFormData;
    setFormData: (data: GroupedSkillsFormData) => void;
}