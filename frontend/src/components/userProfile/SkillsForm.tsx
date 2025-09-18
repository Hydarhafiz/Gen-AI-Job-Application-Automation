// In frontend/src/components/userProfile/SkillsForm.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTag, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { SkillsFormProps } from '../../interfaces/Skill';


const SkillsForm: React.FC<SkillsFormProps> = ({ formData, setFormData }) => {

  const handleCategoryChange = (oldCategory: string, newCategory: string) => {
    const newFormData = { ...formData };
    if (oldCategory !== newCategory) {
      if (newCategory) {
        newFormData[newCategory] = newFormData[oldCategory];
      }
      delete newFormData[oldCategory];
    }
    setFormData(newFormData);
  };

  const handleSkillsChange = (category: string, skills: string) => {
    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
    setFormData({ ...formData, [category]: skillsArray });
  };

  const addCategory = () => {
    const newCategory = `New Category ${Object.keys(formData).length + 1}`;
    setFormData({ ...formData, [newCategory]: [] });
  };

  const removeCategory = (category: string) => {
    const newFormData = { ...formData };
    delete newFormData[category];
    setFormData(newFormData);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Skills</h3>
      {Object.keys(formData).map((category) => (
        <div key={category} className="bg-gray-50 p-6 rounded-lg mb-6 relative border border-gray-200 shadow-sm">
          {Object.keys(formData).length > 1 && (
            <button
              onClick={() => removeCategory(category)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors p-2"
              aria-label={`Remove ${category} category`}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
          <div className="flex flex-col mb-4">
            <label className="text-gray-600 font-medium mb-1 flex items-center">
              <FontAwesomeIcon icon={faTag} className="mr-2 text-blue-500" />
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => handleCategoryChange(category, e.target.value)}
              placeholder="e.g., Programming Languages"
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={formData[category].join(', ')}
              onChange={(e) => handleSkillsChange(category, e.target.value)}
              placeholder="e.g., Python, JavaScript, TypeScript"
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addCategory}
        className="w-full px-6 py-3 border border-dashed border-gray-400 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add another skill category
      </button>
    </div>
  );
};

export default SkillsForm;