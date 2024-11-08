import { useState } from 'react';
import { STLViewer } from './STLViewer';
import type { FileSet } from '../types/project';

interface SplitScreenViewerProps {
  fileSet: FileSet;
  viewMode: 'split' | 'design' | 'render';
}

export function SplitScreenViewer({ fileSet, viewMode }: SplitScreenViewerProps) {
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'revision'>(
    fileSet.status
  );

  const handleStatusChange = async (newStatus: typeof approvalStatus) => {
    try {
      // Update status in Firestore
      await updateFileSetStatus(fileSet.id, newStatus);
      setApprovalStatus(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Design Review</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStatusChange('approved')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                approvalStatus === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusChange('revision')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                approvalStatus === 'revision'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Request Revision
            </button>
          </div>
        </div>
      </div>

      <div className={`grid ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 p-4`}>
        {(viewMode === 'split' || viewMode === 'design') && (
          <div className="aspect-square">
            <img
              src={fileSet.designImageUrl}
              alt="Design"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        {(viewMode === 'split' || viewMode === 'render') && (
          <div className="aspect-square">
            <STLViewer modelUrl={fileSet.stlFileUrl} />
          </div>
        )}
      </div>
    </div>
  );
}