// In frontend/src/components/userProfile/ExperienceForm.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { ExperienceFormProps } from '../../interfaces/Experience';


const ExperienceForm: React.FC<ExperienceFormProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value, type } = e.target;
    const newFormData = [...formData];
    newFormData[index] = {
      ...newFormData[index],
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    };
    setFormData(newFormData);
  };

  const addExperience = () => {
    setFormData([
      ...formData,
      // Corrected property names to match the interface
      {
        company_name: '',
        title: '',
        start_date: '',
        end_date: null,
        is_current: false,
        description: '',
      },
    ]);
  };

  const removeExperience = (index: number) => {
    const newFormData = formData.filter((_, i) => i !== index);
    setFormData(newFormData);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Work Experience</h3>
      {formData.map((experience, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg mb-6 relative">
          {formData.length > 1 && (
            <button
              onClick={() => removeExperience(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Company Name</label>
              <input
                type="text"
                name="company_name" // Corrected name
                value={experience.company_name} // Corrected value
                onChange={(e) => handleChange(e, index)}
                placeholder="Google"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={experience.title}
                onChange={(e) => handleChange(e, index)}
                placeholder="Software Engineer"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="start_date" // Corrected name
                value={experience.start_date} // Corrected value
                onChange={(e) => handleChange(e, index)}
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">End Date</label>
              <input
                type="date"
                name="end_date" // Corrected name
                value={experience.end_date || ''} // Handle null value
                onChange={(e) => handleChange(e, index)}
                disabled={experience.is_current} // Corrected name
                className="p-3 border border-gray-300 rounded-lg disabled:bg-gray-200"
              />
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id={`isCurrent-${index}`}
                name="is_current" // Corrected name
                checked={experience.is_current} // Corrected value
                onChange={(e) => handleChange(e, index)}
                className="mr-2"
              />
              <label htmlFor={`isCurrent-${index}`} className="text-gray-600 font-medium">I currently work here</label>
            </div>
          </div>
          <div className="flex flex-col mt-6">
            <label className="text-gray-600 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={experience.description}
              onChange={(e) => handleChange(e, index)}
              placeholder="Describe your responsibilities and achievements..."
              rows={4}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addExperience}
        className="w-full px-6 py-3 border border-dashed border-gray-400 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add another experience
      </button>
    </div>
  );
};

export default ExperienceForm;