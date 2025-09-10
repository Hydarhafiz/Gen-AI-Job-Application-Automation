// In frontend/src/components/userProfile/EducationForm.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { EducationFormProps } from '../../interfaces/Education';


const EducationForm: React.FC<EducationFormProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const newFormData = [...formData];
    newFormData[index] = { ...newFormData[index], [name]: value };
    setFormData(newFormData);
  };

  const addEducation = () => {
    setFormData([
      ...formData,
      { institutionName: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' },
    ]);
  };

  const removeEducation = (index: number) => {
    const newFormData = formData.filter((_, i) => i !== index);
    setFormData(newFormData);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Education</h3>
      {formData.map((education, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg mb-6 relative">
          {formData.length > 1 && (
            <button
              onClick={() => removeEducation(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Institution Name</label>
              <input
                type="text"
                name="institutionName"
                value={education.institutionName}
                onChange={(e) => handleChange(e, index)}
                placeholder="University of California, Berkeley"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Degree</label>
              <input
                type="text"
                name="degree"
                value={education.degree}
                onChange={(e) => handleChange(e, index)}
                placeholder="Bachelor of Science"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Field of Study</label>
              <input
                type="text"
                name="fieldOfStudy"
                value={education.fieldOfStudy}
                onChange={(e) => handleChange(e, index)}
                placeholder="Computer Science"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={education.startDate}
                onChange={(e) => handleChange(e, index)}
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={education.endDate}
                onChange={(e) => handleChange(e, index)}
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addEducation}
        className="w-full px-6 py-3 border border-dashed border-gray-400 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add another education
      </button>
    </div>
  );
};

export default EducationForm;