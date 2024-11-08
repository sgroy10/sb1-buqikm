import { useState } from 'react';
import { useProject } from '../hooks/useProject';

interface FileUploadProps {
  projectId: string;
  onUploadComplete: () => void;
}

export function FileUpload({ projectId, onUploadComplete }: FileUploadProps) {
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [stlFile, setStlFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadFileSet } = useProject();

  const handleUpload = async () => {
    if (!designImage || !stlFile) {
      setError('Please select both design image and STL file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await uploadFileSet(projectId, designImage, stlFile);
      setDesignImage(null);
      setStlFile(null);
      onUploadComplete();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Upload Files</h3>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Design Image (JPEG, PNG)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setDesignImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {designImage && (
            <p className="mt-1 text-sm text-gray-500">
              Selected: {designImage.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            STL File
          </label>
          <input
            type="file"
            accept=".stl"
            onChange={(e) => setStlFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {stlFile && (
            <p className="mt-1 text-sm text-gray-500">
              Selected: {stlFile.name}
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !designImage || !stlFile}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>
    </div>
  );
}