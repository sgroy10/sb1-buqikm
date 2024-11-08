import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FileUpload } from './FileUpload';
import { SplitScreenViewer } from './SplitScreenViewer';
import { CommentSection } from './CommentSection';
import type { ProjectWithFileSets } from '../types/project';

export function ProjectViewer() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectWithFileSets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'design' | 'render'>('split');

  useEffect(() => {
    if (!projectId) return;

    const unsubscribe = onSnapshot(
      doc(db, 'projects', projectId),
      async (snapshot) => {
        try {
          if (snapshot.exists()) {
            const projectData = {
              id: snapshot.id,
              ...snapshot.data(),
              fileSets: [] // Will be populated below
            } as ProjectWithFileSets;

            // Fetch associated file sets
            const fileSetsRef = collection(db, 'fileSets');
            const fileSetsQuery = query(
              fileSetsRef,
              where('projectId', '==', projectId),
              orderBy('createdAt', 'desc')
            );
            
            const fileSetsSnapshot = await getDocs(fileSetsQuery);
            projectData.fileSets = fileSetsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            setProject(projectData);
          } else {
            setError('Project not found');
          }
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error fetching project:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error || 'Project not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <div className="flex items-center space-x-4">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as typeof viewMode)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="split">Split Screen</option>
                <option value="design">Design Only</option>
                <option value="render">Render Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {project.fileSets.map((fileSet) => (
              <div key={fileSet.id} className="mb-8">
                <SplitScreenViewer
                  fileSet={fileSet}
                  viewMode={viewMode}
                />
                <CommentSection
                  fileSetId={fileSet.id}
                  comments={fileSet.comments}
                />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <FileUpload
              projectId={project.id}
              onUploadComplete={() => {
                // Snapshot will automatically update the UI
              }}
            />

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Project Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{project.status.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}