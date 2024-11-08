import React from 'react';
import { useProjects } from '../hooks/useProjects';
import { format } from 'date-fns';

export function ProjectList() {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-600">No projects found</p>
          <p className="text-sm text-gray-500 mt-2">Create a new project to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 p-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
              <p className="text-gray-600 mt-2">{project.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              project.status === 'completed' ? 'bg-green-100 text-green-800' :
              project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {project.status}
            </span>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <p>Assigned to: {project.assignedTo}</p>
              <p>Created by: {project.createdBy}</p>
            </div>
            <div className="text-right">
              <p>Created: {format(project.createdAt, 'MMM d, yyyy')}</p>
              <p>Updated: {format(project.updatedAt, 'MMM d, yyyy')}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}