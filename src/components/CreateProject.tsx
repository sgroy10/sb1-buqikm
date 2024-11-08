import { useState, useRef } from 'react';
import { useProjects } from '../hooks/useProjects';
import type { ProjectCategory } from '../types/project';

interface CreateProjectProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateProject({ onClose, onSuccess }: CreateProjectProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('designer');
  const [assignedTo, setAssignedTo] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createProject } = useProjects();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
        const isValidType = /^(application\/pdf|image\/.*|application\/vnd\.openxmlformats-officedocument.*|application\/vnd\.ms-excel|application\/msword|application\/vnd\.ms-powerpoint|text\/plain)$/i.test(file.type);
        return isValidSize && isValidType;
      });

      if (validFiles.length !== newFiles.length) {
        setError('Some files were skipped. Files must be under 50MB and in a supported format (PDF, Images, Office documents).');
      }

      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setUploadProgress(0);

    try {
      if (!files.length) {
        throw new Error('Please select at least one file');
      }

      await createProject(
        name,
        category,
        assignedTo,
        files,
        new Date(deliveryDate),
        remarks,
        (progress) => setUploadProgress(progress)
      );

      onSuccess();
    } catch (err) {
      console.error('Error creating project:', err);
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const groupFilesByType = (files: File[]) => {
    const groups: { [key: string]: File[] } = {};
    files.forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'other';
      if (!groups[ext]) {
        groups[ext] = [];
      }
      groups[ext].push(file);
    });
    return groups;
  };

  const fileGroups = groupFilesByType(files);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Create New Project</h2>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form id="createProjectForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="designer">Designer</option>
                <option value="cad_developer">CAD Developer</option>
                <option value="projects">Projects</option>
                <option value="meetings">Meetings</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Professional's Email</label>
              <input
                type="email"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Files</label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload files</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt,.ppt,.pptx"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, Excel, Word, Images up to 50MB each
                  </p>
                </div>
              </div>

              {Object.entries(fileGroups).length > 0 && (
                <div className="mt-4 space-y-4">
                  {Object.entries(fileGroups).map(([type, groupFiles]) => (
                    <div key={type} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {type.toUpperCase()} Files ({groupFiles.length})
                      </h4>
                      <ul className="space-y-2">
                        {groupFiles.map((file, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(files.indexOf(file))}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
              />
            </div>
          </form>

          {loading && uploadProgress > 0 && (
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                      Uploading
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-indigo-600">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="createProjectForm"
            disabled={loading || !files.length || !deliveryDate || !name.trim() || !assignedTo.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}