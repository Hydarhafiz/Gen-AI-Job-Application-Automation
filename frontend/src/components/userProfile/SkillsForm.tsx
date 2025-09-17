// In frontend/src/components/userProfile/SkillsForm.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { SkillsFormProps } from '../../interfaces/Skill';


const SkillsForm: React.FC<SkillsFormProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const newFormData = [...formData];
    newFormData[index] = { ...newFormData[index], [name]: value };
    setFormData(newFormData);
  };

  const addSkill = () => {
    setFormData([...formData, { name: '', category: '' }]);
  };

  const removeSkill = (index: number) => {
    const newFormData = formData.filter((_, i) => i !== index);
    setFormData(newFormData);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Skills</h3>
      {formData.map((skill, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg mb-6 relative">
          {formData.length > 1 && (
            <button
              onClick={() => removeSkill(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Skill Name</label>
              <input
                type="text"
                name="name"
                value={skill.name}
                onChange={(e) => handleChange(e, index)}
                placeholder="React.js"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={skill.category || ''} // Handle null value
                onChange={(e) => handleChange(e, index)}
                placeholder="Frontend Frameworks"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addSkill}
        className="w-full px-6 py-3 border border-dashed border-gray-400 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add another skill
      </button>
    </div>
  );
};

export default SkillsForm;