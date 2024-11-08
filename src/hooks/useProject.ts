import { useState, useEffect } from 'react';
import { 
  addDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  getFirestore
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from './useAuth';
import type { Project, FileSet } from '../types/project';

export function useProject() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectsRef = collection(db, 'projects');
        const q = query(
          projectsRef,
          where('assignedTo', '==', user.email),
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const projectList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as Project[];
        
        setProjects(projectList);
        setError(null);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [user?.email]);

  const createProject = async (name: string, assignedToEmail: string) => {
    if (!user?.email || !profile) throw new Error('User must be authenticated');

    try {
      const projectData = {
        name,
        createdBy: user.email,
        creatorRole: profile.role,
        assignedTo: assignedToEmail,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'projects'), projectData);
      
      return { 
        id: docRef.id, 
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (err) {
      console.error('Project creation error:', err);
      throw new Error('Failed to create project');
    }
  };

  const uploadFileSet = async (
    projectId: string, 
    designImage: File, 
    stlFile: File
  ) => {
    if (!user?.email) throw new Error('User must be authenticated');

    try {
      // Upload design image
      const designRef = ref(storage, `projects/${projectId}/designs/${designImage.name}`);
      await uploadBytes(designRef, designImage);
      const designUrl = await getDownloadURL(designRef);

      // Upload STL file
      const stlRef = ref(storage, `projects/${projectId}/stl/${stlFile.name}`);
      await uploadBytes(stlRef, stlFile);
      const stlUrl = await getDownloadURL(stlRef);

      // Create file set in Firestore
      const fileSetData = {
        projectId,
        designImageUrl: designUrl,
        stlFileUrl: stlUrl,
        status: 'pending',
        comments: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        uploadedBy: user.email
      };

      const docRef = await addDoc(collection(db, 'fileSets'), fileSetData);
      
      return { 
        id: docRef.id, 
        ...fileSetData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (err) {
      console.error('File upload error:', err);
      throw new Error('Failed to upload files');
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    uploadFileSet
  };
}