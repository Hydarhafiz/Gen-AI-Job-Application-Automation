// In frontend/src/components/userProfile/ProjectsForm.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { ProjectsFormProps } from '../../interfaces/Project';


const ProjectsForm: React.FC<ProjectsFormProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value } = e.target;
    const newFormData = [...formData];
    newFormData[index] = { ...newFormData[index], [name]: value };
    setFormData(newFormData);
  };

  const addProject = () => {
    setFormData([
      ...formData,
      // Corrected property names to match the interface
      { name: '', description: '', github_url: '', live_url: '', start_date: '', end_date: '' },
    ]);
  };

  const removeProject = (index: number) => {
    const newFormData = formData.filter((_, i) => i !== index);
    setFormData(newFormData);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Projects</h3>
      {formData.map((project, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg mb-6 relative">
          {formData.length > 1 && (
            <button
              onClick={() => removeProject(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Project Name</label>
              <input
                type="text"
                name="name"
                value={project.name}
                onChange={(e) => handleChange(e, index)}
                placeholder="JAA - Job Application Assistant"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">GitHub URL</label>
              <input
                type="url"
                name="github_url" // Corrected name
                value={project.github_url || ''} // Handle null value
                onChange={(e) => handleChange(e, index)}
                placeholder="https://github.com/your-username/jaa-project"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Live URL</label>
              <input
                type="url"
                name="live_url" // Corrected name
                value={project.live_url || ''} // Handle null value
                onChange={(e) => handleChange(e, index)}
                placeholder="https://jaa.your-site.com"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="start_date" // Corrected name
                value={project.start_date || ''} // Handle null value
                onChange={(e) => handleChange(e, index)}
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">End Date</label>
              <input
                type="date"
                name="end_date" // Corrected name
                value={project.end_date || ''} // Handle null value
                onChange={(e) => handleChange(e, index)}
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="flex flex-col mt-6">
            <label className="text-gray-600 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={project.description || ''} // Handle null value
              onChange={(e) => handleChange(e, index)}
              placeholder="Describe what the project does, the technologies used, and your contributions..."
              rows={4}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addProject}
        className="w-full px-6 py-3 border border-dashed border-gray-400 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add another project
      </button>
    </div>
  );
};

export default ProjectsForm;